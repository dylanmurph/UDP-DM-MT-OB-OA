import os
import time
import subprocess
import board
import busio
import boto3
import RPi.GPIO as GPIO
from gpiozero import OutputDevice
from adafruit_pn532.i2c import PN532_I2C

from dotenv import load_dotenv
load_dotenv()

from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.callbacks import SubscribeCallback


# ----------------------
# ENV VARIABLES
# ----------------------
PUBLISH_KEY = os.getenv("PUBNUB_PUBLISH_KEY")
SUBSCRIBE_KEY = os.getenv("PUBNUB_SUBSCRIBE_KEY")
CHANNEL = os.getenv("PUBNUB_CHANNEL")

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET = os.getenv("AWS_BUCKET")


# ----------------------
# AWS S3 SETUP
# ----------------------
s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

def upload_to_s3(filepath, filename):
    """Upload to S3 and return a public URL."""
    print(f" Uploading {filename} to S3...")

    s3.upload_file(
        filepath,
        AWS_BUCKET,
        filename,
        ExtraArgs={"ACL": "public-read"}  
    )

    url = f"https://{AWS_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    print("Upload complete:", url)
    return url


# ----------------------
# PubNub Setup
# ----------------------
pnconfig = PNConfiguration()
pnconfig.publish_key = PUBLISH_KEY
pnconfig.subscribe_key = SUBSCRIBE_KEY
pnconfig.user_id = "pi-nfc"
pnconfig.enable_subscribe = True

pubnub = PubNub(pnconfig)


# ----------------------
# GPIO Setup
# ----------------------
GPIO.setmode(GPIO.BCM)

LED_RED = 22
LED_YEL = 23
LED_GRN = 24
BUZZ = 18
RELAY = OutputDevice(17, active_high=False)

GPIO.setup(LED_RED, GPIO.OUT)
GPIO.setup(LED_YEL, GPIO.OUT)
GPIO.setup(LED_GRN, GPIO.OUT)
GPIO.setup(BUZZ, GPIO.OUT)

GPIO.output(LED_RED, True)  # Default state = red ON



# ----------------------
# PN532 NFC Reader
# ----------------------
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)
pn532.SAM_configuration()


# ----------------------
# Camera
# ----------------------
CAPTURE_DIR = "/home/pi/captures"
os.makedirs(CAPTURE_DIR, exist_ok=True)

RPICAM = "/usr/bin/rpicam-still"


# Take photo at 1920×1080
def take_photo(uid_hex):
    filename = f"{uid_hex}_{time.strftime('%Y%m%d_%H%M%S')}.jpg"
    path = os.path.join(CAPTURE_DIR, filename)

    subprocess.run([
        RPICAM,
        "-o", path,
        "-t", "1000",
        "--nopreview",
        "--width", "1920",
        "--height", "1080"
    ], check=True)

    return path, filename



# --------------------------
# Listener (access decisions)
# --------------------------
class MyListener(SubscribeCallback):

    def message(self, pubnub, message):
        msg = message.message
        print("Server says:", msg)

        if "access" in msg:
            if msg["access"] == "granted":
                grant_access()
            else:
                deny_access()


pubnub.add_listener(MyListener())
pubnub.subscribe().channels(CHANNEL).execute()


# --------------------------
# Access Control LEDs/Buzzer
# --------------------------
def grant_access():
    GPIO.output(LED_RED, False)
    GPIO.output(LED_GRN, True)
    RELAY.off()
    time.sleep(5)
    GPIO.output(LED_GRN, False)
    GPIO.output(LED_RED, True)
    RELAY.on()


def deny_access():
    GPIO.output(LED_GRN, False)
    GPIO.output(LED_RED, True)
    GPIO.output(BUZZ, True)
    time.sleep(1)
    GPIO.output(BUZZ, False)



# --------------------------
# MAIN LOOP
# --------------------------
print("Waiting for NFC tag...")

try:
    while True:
       
        uid = pn532.read_passive_target(timeout=0.5)

        if uid:
            uid_hex = uid.hex().upper()
            print("Tag detected:", uid_hex)

            # Flash yellow + beep
            GPIO.output(BUZZ, True)
            for _ in range(3):
                GPIO.output(LED_YEL, True)
                time.sleep(0.3)
                GPIO.output(LED_YEL, False)
                time.sleep(0.3)
            GPIO.output(BUZZ, False)

            # Take photo
            img_path, img_name = take_photo(uid_hex)

            # Upload to AWS
            image_url = upload_to_s3(img_path, img_name)

            # Send NFC + image URL to server
            pubnub.publish().channel(CHANNEL).message({
                "nfc_uid": uid_hex,
                "image_url": image_url
            }).sync()

        time.sleep(0.1)

except KeyboardInterrupt:
    GPIO.cleanup()
    print("Exiting cleanly...")

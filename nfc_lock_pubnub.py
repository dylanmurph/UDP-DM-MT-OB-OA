import os
import time
import board
import busio
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

GPIO.output(LED_RED, True)

# ----------------------
# PN532 NFC Reader
# ----------------------
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)
pn532.SAM_configuration()

# --------------------------
# Listener 
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

            # Send UID to server
            pubnub.publish().channel(CHANNEL).message({"nfc_uid": uid_hex}).sync()

        time.sleep(0.1)

except KeyboardInterrupt:
    GPIO.cleanup()
    print("Exiting cleanly...")

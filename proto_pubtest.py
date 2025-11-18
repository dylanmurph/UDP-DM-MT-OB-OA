import time
import board
import busio
import RPi.GPIO as GPIO
from adafruit_pn532.i2c import PN532_I2C

from dotenv import load_dotenv
import os

load_dotenv()

from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

# PubNub Setup (from .env)
PUBLISH_KEY = os.getenv("PUBNUB_PUBLISH_KEY")
SUBSCRIBE_KEY = os.getenv("PUBNUB_SUBSCRIBE_KEY")
CHANNEL = os.getenv("PUBNUB_CHANNEL")

pnconfig = PNConfiguration()
pnconfig.publish_key = PUBLISH_KEY
pnconfig.subscribe_key = SUBSCRIBE_KEY
pnconfig.user_id = "pi-nfc"
pnconfig.enable_subscribe = False

pubnub = PubNub(pnconfig)


# GPIO Setup
GPIO.setmode(GPIO.BCM)

LED_RED = 22
LED_YEL = 23
LED_GRN = 24
BUZZ = 18

GPIO.setup(LED_RED, GPIO.OUT)
GPIO.setup(LED_YEL, GPIO.OUT)
GPIO.setup(LED_GRN, GPIO.OUT)
GPIO.setup(BUZZ, GPIO.OUT)

# Start in RED state
GPIO.output(LED_RED, True)
GPIO.output(LED_YEL, False)
GPIO.output(LED_GRN, False)

# PN532 Setup
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)
pn532.SAM_configuration()

print("Waiting for NFC tag...")


def send_pubnub(uid_hex: str):
    """Publish NFC UID to PubNub."""
    message = {"nfc_uid": uid_hex}
    result = pubnub.publish().channel(CHANNEL).message(message).sync()

    if result.status.is_error():
        print("PubNub publish failed:", result.status.error_data)
    else:
        print("Sent NFC UID to PubNub:", uid_hex)


try:
    while True:
        uid = pn532.read_passive_target(timeout=0.5)

        if uid is not None:
            uid_hex = uid.hex().upper()
            print("Tag detected:", uid_hex)

            # Publish to PubNub
            send_pubnub(uid_hex)

            # LED/Buzzer Logic
            GPIO.output(LED_RED, False)
            GPIO.output(LED_GRN, False)
            GPIO.output(BUZZ, True)

            for _ in range(3):
                GPIO.output(LED_YEL, True)
                time.sleep(0.3)
                GPIO.output(LED_YEL, False)
                time.sleep(0.3)

            GPIO.output(BUZZ, False)

            GPIO.output(LED_GRN, True)
            time.sleep(10)

            GPIO.output(LED_RED, True)
            GPIO.output(LED_YEL, False)
            GPIO.output(LED_GRN, False)

        time.sleep(0.1)

except KeyboardInterrupt:
    print("Exiting…")

finally:
    GPIO.cleanup()

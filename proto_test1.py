import time
import board
import busio
import RPi.GPIO as GPIO
from adafruit_pn532.i2c import PN532_I2C

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

try:
    while True:

        uid = pn532.read_passive_target(timeout=0.5)

        if uid is not None:
            print("Tag detected:", uid.hex().upper())

            # YELLOW for 2 seconds
            GPIO.output(LED_RED, False)
            GPIO.output(LED_GRN, False)
            GPIO.output(BUZZ, True)
            for i in range(3):
                GPIO.output(LED_YEL, True)
                time.sleep(.3)
                GPIO.output(LED_YEL, False)
                time.sleep(.3)
            GPIO.output(BUZZ, False)
            # GREEN for 10 seconds
            GPIO.output(LED_RED, False)
            GPIO.output(LED_YEL, False)
            GPIO.output(LED_GRN, True)
            time.sleep(10)
            # Return to RED
            GPIO.output(LED_RED, True)
            GPIO.output(LED_YEL, False)
            GPIO.output(LED_GRN, False)

        # loop delay
        time.sleep(0.1)

except KeyboardInterrupt:
    print("Exiting…")

finally:
    GPIO.cleanup()

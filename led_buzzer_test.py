import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

RED = 22
YEL = 23
GRN = 24
BUZZ = 18

GPIO.setup(RED, GPIO.OUT)
GPIO.setup(YEL, GPIO.OUT)
GPIO.setup(GRN, GPIO.OUT)
GPIO.setup(BUZZ, GPIO.OUT)

try:
    while True:
        # RED on
        GPIO.output(RED, True)
        time.sleep(1)
        GPIO.output(RED, False)
        # YELLOW on
        GPIO.output(YEL, True)
        time.sleep(1)
        GPIO.output(YEL, False)
        # GREEN on
        GPIO.output(GRN, True)
        time.sleep(1)
        GPIO.output(GRN, False)
        # BUZZER
        GPIO.output(BUZZ, True)
        time.sleep(0.2)
        GPIO.output(BUZZ, False)
        time.sleep(1)

except KeyboardInterrupt:
    pass

finally:
    GPIO.cleanup()

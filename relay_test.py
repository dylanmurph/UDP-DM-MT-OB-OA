from gpiozero import OutputDevice
from time import sleep

relay = OutputDevice(17, active_high=False)

while true
    print("Relay On")
    relay.on()
    sleep(2)
    print("Relay Off")
    relay.off()
    sleep(2)
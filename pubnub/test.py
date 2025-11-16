from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import os

# 1. Configure PubNub
pnconfig = PNConfiguration()
pnconfig.publish_key = os.getenv("PUBNUB_PUBLISH_KEY", "your_publish_key")
pnconfig.subscribe_key = os.getenv("PUBNUB_SUBSCRIBE_KEY", "your_subscribe_key")
pnconfig.uuid = os.getenv("PUBNUB_UUID", "server-uuid")
pubnub = PubNub(pnconfig)

# 2. Create a listener to handle messages
class MySubscribeListener(SubscribeCallback):
    def message(self, pubnub, message):
        print("Received message:", message.message)

# 3. Subscribe to the same channel
pubnub.add_listener(MySubscribeListener())
pubnub.subscribe().channels("test_channel").execute()

from Server.pubnub_config import pubnub
from pubnub.callbacks import SubscribeCallback

# Create a listener to handle messages
class MySubscribeListener(SubscribeCallback):
    def message(self, pubnub, message):
        print("Received message:", message.message)

# Subscribe to the same channel
pubnub.add_listener(MySubscribeListener())
pubnub.subscribe().channels("test_channel").execute()

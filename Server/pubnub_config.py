from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub, SubscribeListener
from dotenv import load_dotenv
import os

load_dotenv()

pnconfig = PNConfiguration()
pnconfig.subscribe_key = os.getenv("PUBNUB_SUBSCRIBE_KEY")
pnconfig.publish_key = os.getenv("PUBNUB_PUBLISH_KEY")
pnconfig.user_id = "server-0"
pnconfig.enable_subscribe = True

pubnub = PubNub(pnconfig)

# Create a custom listener
class StatusListener(SubscribeListener):
    def status(self, pubnub, status):
        print(f'PubNub Status: {status.category.name}')

status_listener = StatusListener()
pubnub.add_listener(status_listener)
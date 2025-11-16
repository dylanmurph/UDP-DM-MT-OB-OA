from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import os

pnconfig = PNConfiguration()
pnconfig.publish_key = os.getenv("PUBNUB_PUBLISH_KEY", "your_publish_key")
pnconfig.subscribe_key = os.getenv("PUBNUB_SUBSCRIBE_KEY", "your_subscribe_key")
pnconfig.uuid = os.getenv("PUBNUB_UUID", "server-uuid")
pubnub = PubNub(pnconfig)
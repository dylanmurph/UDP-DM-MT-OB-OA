from flask import request
from Server.pubnub_config import pubnub

def register_pubnub_routes(app):
    @app.route('/api/publish', methods=['POST'])
    def publish_message():
        envelope = pubnub.publish().channel("your_channel").message(request.json).sync()
        return {"status": "published"}
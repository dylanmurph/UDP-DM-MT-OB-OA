from Server.pubnub_config import pubnub

@app.route('/api/publish', methods=['POST'])
def publish_message():
    envelope = pubnub.publish().channel("your_channel").message(request.json).sync()
    return {"status": "published"}
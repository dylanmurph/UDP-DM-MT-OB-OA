import os
import json
import queue
from flask import Flask, Response, render_template, send_from_directory
from dotenv import load_dotenv
import boto3

from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.callbacks import SubscribeCallback


# ------------------------------------------------------
# Load Environment Variables
# ------------------------------------------------------
load_dotenv()

PUBLISH_KEY = os.getenv("PUBNUB_PUBLISH_KEY")
SUBSCRIBE_KEY = os.getenv("PUBNUB_SUBSCRIBE_KEY")
CHANNEL = os.getenv("PUBNUB_CHANNEL")

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET = os.getenv("AWS_BUCKET")

if not all([PUBLISH_KEY, SUBSCRIBE_KEY, CHANNEL]):
    raise RuntimeError("Missing PubNub credentials in .env")

if not all([AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET]):
    raise RuntimeError("Missing AWS credentials in .env")


# ------------------------------------------------------
# AWS S3 Client
# ------------------------------------------------------
s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

def s3_download_and_delete(key):
    filename = os.path.basename(key)
    local_path = os.path.join(IMAGE_DIR, filename)

    s3.download_file(AWS_BUCKET, key, local_path)
    s3.delete_object(Bucket=AWS_BUCKET, Key=key)

    return filename


# ------------------------------------------------------
# Flask Setup
# ------------------------------------------------------
app = Flask(__name__)

IMAGE_DIR = "./static/uploads"
os.makedirs(IMAGE_DIR, exist_ok=True)

message_queue = queue.Queue()

ALLOWED_UIDS = {"A3A0264E", "2277264E"}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/stream")
def stream():
    def event_stream():
        while True:
            msg = message_queue.get()
            yield f"data: {msg}\n\n"

    return Response(event_stream(), mimetype="text/event-stream")


@app.route("/image/<filename>")
def serve_image(filename):
    return send_from_directory(IMAGE_DIR, filename)


# ------------------------------------------------------
# PubNub Listener
# ------------------------------------------------------
class WebListener(SubscribeCallback):
    def message(self, pubnub, event):
        msg = event.message
        print("Received PubNub message:", msg)

        # Forward UID or other info to browser
        message_queue.put(json.dumps(msg))

        # Access control
        if "nfc_uid" in msg:
            uid = msg["nfc_uid"]
            access = "granted" if uid in ALLOWED_UIDS else "denied"

            pubnub.publish().channel(CHANNEL).message({
                "access": access,
                "uid": uid
            }).sync()

            message_queue.put(json.dumps({
                "nfc_uid": uid,
                "access": access
            }))

        # Handle S3 image key
        if "s3_key" in msg:
            filename = s3_download_and_delete(msg["s3_key"])
            message_queue.put(json.dumps({
                "image_filename": filename
            }))


# ------------------------------------------------------
# PubNub Setup
# ------------------------------------------------------
pnconfig = PNConfiguration()
pnconfig.publish_key = PUBLISH_KEY
pnconfig.subscribe_key = SUBSCRIBE_KEY
pnconfig.user_id = "web-server"
pnconfig.enable_subscribe = True

pubnub = PubNub(pnconfig)
pubnub.add_listener(WebListener())
pubnub.subscribe().channels(CHANNEL).execute()


# ------------------------------------------------------
# Run Webserver
# ------------------------------------------------------
if __name__ == "__main__":
    print("Web server running: http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, threaded=True)

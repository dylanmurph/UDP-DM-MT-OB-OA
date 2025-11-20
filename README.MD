# Hardware Test Server
This branch contains a lightweight test webserver (without a database) used to verify end‑to‑end communication between the HostLock hardware and backend services.

## System Flow

1. **Pi scans an NFC tag** and captures an image.
2. **Image is uploaded to a private S3 bucket** and the Pi sends the server a PubNub message containing the UID and S3 key.
3. **Server receives the message**, checks the UID against its allowed list, and immediately sends an access decision back to the Pi.
4. **Server downloads the image from S3**, saves it locally, deletes it from S3, and streams updates to the browser UI.
5. **Browser UI updates live** with the UID, access result, and captured image.
6. **Pi receives the access decision** and activates the lock hardware accordingly.


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
const pubnub = new PubNub({
  publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY || "default_pub",
  subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY || "default_sub",
  userId: "web-user-" + Math.floor(Math.random() * 10000),
});

if (!process.env.REACT_APP_PUBNUB_PUBLISH_KEY || !process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY) {
  console.warn("PubNub keys not configured. Add them to your .env file.");
}

root.render(
  <React.StrictMode>
    <PubNubProvider client={pubnub}>
      <App />
    </PubNubProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

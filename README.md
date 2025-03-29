# Twilio Frontend

A clean frontend-only webapp to send & receive SMS messages via Twilio.  
You can use the hosted version of this app here: http://twilio-dashboard.pages.dev/

## Features

- View chat history
- Respond to messages
- Draft new messages
- Receive messages dynamically via polling
- New message notifications
- Multi phone numbers support
- Mobile optimized

## Prerequisites

- Twilio account
- At least one Twilio phone number approved to send & receive SMS (A2P)

## Usage

Enter your Twilio account `SID` and `AuthToken` to get started. The `Messages` tab will become enabled for you to access Twilio SMS sending & receiving in a familiar chat interface.

## Screenshots

Login in  
<img src='src/assets/img1.png' width='75%'>

Messages  
<img src='src/assets/img2.png' width='75%'>

Mobile  
<img src='src/assets/img3.png' width='30%'>

## Development

```
$ pnpm install

# Access dev version on http://localhost:5173
$ pnpm run dev

# Build production dist/
$ pnpm run build
```

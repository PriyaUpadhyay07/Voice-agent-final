# AI Voice Agent Testing Guide

Use these steps to get a public link for testing with Twilio:

### 1. Start the Server
Open a terminal and run:
```bash
npx next dev -p 3000
```

### 2. Start the Tunnel
Open a SECOND terminal and run:
```bash
npx localtunnel --port 3000 --local-host 127.0.0.1
```

### 3. Get the Link
- Copy the `https://xxxx.loca.lt` URL.
- Open it in Chrome.
- Enter your Public IP (the page will show it, typically something like `157.49.xx.xx`).

### Important Notes:
- The link changes every time you restart the tunnel.
- Always use `--local-host 127.0.0.1` to avoid "Bad Gateway" errors.
- Ensure only ONE server is running at a time.

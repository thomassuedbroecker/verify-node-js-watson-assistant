# verify-node-js-watson-assistant

Get a Watson Assistant session and send a message to Watson Assistant.

### Git clone

```sh
git clone https://github.com/thomassuedbroecker/verify-node-js-watson-assistant.git
cd verify-node-js-watson-assistant/code
```

### Configure environment

* Create env file

```sh
cat .env-template > .env
```

* Configure env file to your needs

```sh
WATSON_ASSISTANT_VERSION='2021-11-27'
WATSON_ASSISTANT_API_KEY='XXXX'
WATSON_ASSISTANT_SERVICE_URL='https://api.us-south.assistant.watson.cloud.ibm.com'
WASTON_ASSISTANT_ID='XXX'
WATSON_ASSISTANT_ENVIRONMENT_ID='XXX'
```

### Run local on port 3000

```sh
npm install
npm start
```

### Open browser and invoke URL

```sh
open http://localhost:3010/getsession
```

* Example output:

```json
{
"session_id": "37d13c72-1643-4add-bee5-574c6fd062dc"
}
```



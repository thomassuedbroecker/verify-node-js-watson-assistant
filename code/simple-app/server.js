var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config();
var cors = require("cors");
app.use(cors());

const port = 3000;

const AssistantV2 = require('ibm-watson/assistant/v2');
const IamAuthenticator = require('ibm-watson/auth').IamAuthenticator;

var e_version=process.env.WATSON_ASSISTANT_VERSION;
var e_apikey=process.env.WATSON_ASSISTANT_API_KEY;
var e_serverUrl=process.env.WATSON_ASSISTANT_SERVICE_URL;
var e_assistantID=process.env.WASTON_ASSISTANT_ID;
console.log(process.env.WATSON_ASSISTANT_VERSION);
console.log(process.env.WATSON_ASSISTANT_API_KEY);
console.log(process.env.WATSON_ASSISTANT_SERVICE_URL);
console.log(process.env.WASTON_ASSISTANT_ID);

const assistant = new AssistantV2({
  version: e_version,
  authenticator: new IamAuthenticator({
    apikey: e_apikey,
  }),
  serviceUrl: e_serverUrl,
});


app.get('/getSession', (req, res) => {
    let sessionID;
    assistant.createSession({
        assistantId: e_assistantID
    })
    .then(res => {
        console.log(JSON.stringify(res.result, null, 2));
        sessionID = JSON.stringify(res.result, null, 2);
        return sessionID;
    })
    .catch(err => {
        console.log(err);
        sessionID = err;
        return sessionID;
    });
});

const server = app.listen(port, function () {
    console.log('server is running on port:', port ); 
});

module.exports = server;
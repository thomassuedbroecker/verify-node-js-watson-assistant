var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config();
var cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json() );  
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

const AssistantV2 = require('ibm-watson/assistant/v2');
const IamAuthenticator = require('ibm-watson/auth').IamAuthenticator;

var e_version=process.env.WATSON_ASSISTANT_VERSION;
var e_apikey=process.env.WATSON_ASSISTANT_API_KEY;
var e_serverUrl=process.env.WATSON_ASSISTANT_SERVICE_URL;
var e_assistantID=process.env.WATSON_ASSISTANT_ID;
var e_environmentID=process.env.WATSON_ASSISTANT_ENVIRONMENT_ID;

console.log(process.env.WATSON_ASSISTANT_VERSION);
console.log(process.env.WATSON_ASSISTANT_API_KEY);
console.log(process.env.WATSON_ASSISTANT_SERVICE_URL);
console.log(process.env.WATSON_ASSISTANT_ID);
console.log(process.env.WATSON_ASSISTANT_ENVIRONMENT_ID);

const assistant = new AssistantV2({
    version: e_version,
    authenticator: new IamAuthenticator({
      apikey: e_apikey,
    }),
    serviceUrl: e_serverUrl,
  });


app.get('/getsession', (req, res) => {   
    assistant.createSession({
        //assistantId: e_assistantID
        assistantId: e_environmentID
    })
    .then(createSessionresult => {
        console.log(JSON.stringify(createSessionresult.result, null, 2));
        sessionID = JSON.stringify(createSessionresult.result, null, 2);
        res.statusCode = 200;
        res.write(sessionID);
        res.end();
    })
    .catch(createSessionError => {
        console.log(createSessionError);
        res.statusCode = 500;
        res.write(createSessionError);
        res.end();
    });  
});

const server = app.listen(port, function () {
    console.log('server is running on port:', port ); 
});

module.exports = server;
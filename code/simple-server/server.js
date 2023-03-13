var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config();
var cors = require("cors");
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json() );  
app.use(bodyParser.urlencoded({extended: true}));

const port = 3010;

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


// { 'sendmessage' : {
//       'sessionID' : 'XXXX',
//       'message_type': 'text',
//       'text': 'Hello'
//    }
//  }
app.post('/sendmessage', (req, res) => {  

    if (req != undefined) {
        console.log("** Request  \n ", req.toString());
        console.log("** Headers  \n ", JSON.stringify(req.headers));
        const contentType = req.headers["content-type"];
        
        // 1. right contentType
        if (contentType && contentType.indexOf("application/json") !== -1) {
          console.log("** 1. right contentType");       
          // 2. Body exists
          if (req.body != undefined) {
            console.log("** 2. Body exists: \n", JSON.stringify(req.body));          
            // 3. right format
            if (req.body.sendmessage != undefined){
                console.log("** 3. right format: \n", JSON.stringify(req.body.sendmessage));
                
                assistant.message({
                    assistantId: e_environmentID,
                    sessionId: req.body.sendmessage.sessionID,
                    input: {
                      'message_type': req.body.sendmessage.message_type,
                      'text': req.body.sendmessage.text
                      }
                    })
                    .then(assistant_message_res => {
                      console.log(JSON.stringify(assistant_message_res.result, null, 2));
                      res.statusCode = 201;
                      console.log("** 201", assistant_message_res.result);
                      res.json(assistant_message_res.result);
                    })
                    .catch(err => {
                      console.log(err);
                      res.statusCode = 500;
                      console.log("** 500", err);
                      res.json(err);
                    });  
            } else { // 3. right format
              res.statusCode = 406;
              returnvalue = { "info":"Not acceptable wrong format (missing codes)" };
              console.log("** 406", returnvalue);
              res.json(returnvalue);
            }         
          } else { // 2. Body exists
            res.statusCode = 406;
            returnvalue = { "info":"Not acceptable wrong format (no body)" };
            console.log("** 406", returnvalue);
            res.json(returnvalue);
          }
        } else { // 1. right contentType
          res.statusCode = 406;
          returnvalue = { "info":"Not acceptable wrong format" };
          console.log("** 406", returnvalue);
          res.json(returnvalue);
        }
      } else {
        res.statusCode = 406;
        returnvalue = { "info":"Not acceptable wrong format" };
        console.log("** 406", returnvalue);
        res.json(returnvalue);
      }   
});

// { 'sendmessage' : {
//       'sessionID' : 'XXXX',
//       'message_type': 'search',
//       'text': 'Hello'
//    }
//    "options": {
//      "return_context": true,
//      "export": true
//    }
//  }
app.post('/sendsearchmessage', (req, res) => {  

  if (req != undefined) {
      console.log("** Request  \n ", req.toString());
      console.log("** Headers  \n ", JSON.stringify(req.headers));
      const contentType = req.headers["content-type"];
      
      // 1. right contentType
      if (contentType && contentType.indexOf("application/json") !== -1) {
        console.log("** 1. right contentType");       
        // 2. Body exists
        if (req.body != undefined) {
          console.log("** 2. Body exists: \n", JSON.stringify(req.body));          
          // 3. right format
          if (req.body.sendmessage != undefined){
              console.log("** 3. right format: \n", JSON.stringify(req.body.sendmessage));
              
              assistant.message({
                  assistantId: e_environmentID,
                  sessionId: req.body.sendmessage.sessionID,
                  input: {
                     "message_type": req.body.sendmessage.message_type,
                     "search": req.body.sendmessage.text,
                     "options": {
                      "return_context": true,
                      "export": true
                    }
                    }
                  })
                  .then(assistant_message_res => {
                    console.log(JSON.stringify(assistant_message_res.result, null, 2));
                    res.statusCode = 201;
                    console.log("** 201", assistant_message_res.result);
                    res.json(assistant_message_res.result);
                  })
                  .catch(err => {
                    console.log(err);
                    res.statusCode = 500;
                    console.log("** 500", err);
                    res.json(err);
                  });  
          } else { // 3. right format
            res.statusCode = 406;
            returnvalue = { "info":"Not acceptable wrong format (missing codes)" };
            console.log("** 406", returnvalue);
            res.json(returnvalue);
          }         
        } else { // 2. Body exists
          res.statusCode = 406;
          returnvalue = { "info":"Not acceptable wrong format (no body)" };
          console.log("** 406", returnvalue);
          res.json(returnvalue);
        }
      } else { // 1. right contentType
        res.statusCode = 406;
        returnvalue = { "info":"Not acceptable wrong format" };
        console.log("** 406", returnvalue);
        res.json(returnvalue);
      }
    } else {
      res.statusCode = 406;
      returnvalue = { "info":"Not acceptable wrong format" };
      console.log("** 406", returnvalue);
      res.json(returnvalue);
    }   
});

const server = app.listen(port, function () {
    console.log('server is running on port:', port ); 
});

module.exports = server;
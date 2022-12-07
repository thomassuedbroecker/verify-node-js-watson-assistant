// https://cloud.ibm.com/docs/assistant-data?topic=assistant-data-api-client&code=javascript
// Example 1: sets up service wrapper, sends initial message, and
// receives response.
const prompt = require('prompt-sync')();
const dotenv = require('dotenv');
dotenv.config();

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
console.log(process.env.APIKEY);

const AssistantV2 = require('ibm-watson/assistant/v2');
const IamAuthenticator = require('ibm-watson/auth').IamAuthenticator;

// Set up Assistant service wrapper.
const service = new AssistantV2({
  // authenticator: new IamAuthenticator({
  //  apikey: e_apikey,
  //}),
  //serviceUrl: e_serverUrl,
  iam_apikey: e_apikey,
  version: '2019-02-28',
});

const assistantId = e_assistantID; // replace with assistant ID
let sessionId;

// Create session.
service
  .createSession({
    assistant_id: assistantId,
  })
  .then(res => {
    sessionId = res.session_id;
    sendMessage({
      message_type: 'text',
      text: '' // start conversation with empty message
    });
  })
  .catch(err => {
    console.log(err); // something went wrong
  });

// Send message to assistant.
function sendMessage(messageInput) {
  service
    .message({
      assistant_id: assistantId,
      session_id: sessionId,
      input: messageInput
    })
    .then(res => {
      processResponse(res);
    })
    .catch(err => {
      console.log(err); // something went wrong
    });
}

// Process the response.
function processResponse(response) {
  // Display the output from assistant, if any. Supports only a single
  // text response.
  if (response.output.generic) {
    if (response.output.generic.length > 0) {
      if (response.output.generic[0].response_type === 'text') {
        console.log(response.output.generic[0].text);
      }
    }
  }


// We're done, so we close the session.
service
  .deleteSession({
    assistant_id: assistantId,
    session_id: sessionId,
  })
  .catch(err => {
    console.log(err); // something went wrong
  });
}
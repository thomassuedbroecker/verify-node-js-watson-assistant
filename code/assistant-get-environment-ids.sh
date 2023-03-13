#!/bin/bash

# **************** Global variables
source ./.env

export OAUTHTOKEN=""
export IBMCLOUD_APIKEY=$APIKEY
export T_RESOURCEGROUP=$RESOURCE_GROUP
export T_REGION=$REGION
export WA_APIKEY=""
export WA_URL=""
export WA_VERSION='2021-11-27'
export WA_ENVIRONMENT_ID=""

# **********************************************************************************
# Functions definition
# **********************************************************************************

function loginIBMCloud () {
    ibmcloud login  --apikey $IBMCLOUD_APIKEY
    ibmcloud target -r $T_REGION -g $T_RESOURCEGROUP
    ibmcloud target
}

function getAPIKey() {
    TEMPFILE=temp-wa.json
    REQUESTMETHOD=POST
    SERVICE_KEY_NAME=""
    
    ibmcloud resource service-keys --instance-name $WATSON_ASSISTANT_SERVICE_INSTANCE_NAME
    SERVICE_KEY_NAME=$(ibmcloud resource service-keys --instance-name $WATSON_ASSISTANT_SERVICE_INSTANCE_NAME | grep "Service-credentials-custom" | awk '{print $1;}')
    echo "Service Key Name: $SERVICE_KEY_NAME"
    ibmcloud resource service-key $SERVICE_KEY_NAME --output json
    ibmcloud resource service-key $SERVICE_KEY_NAME --output json > $ROOTFOLDER/$TEMPFILE
    export WA_APIKEY=$(cat $ROOTFOLDER/$TEMPFILE | jq '.[0].credentials.apikey' | sed 's/"//g')
    export WA_URL=$(cat $ROOTFOLDER/$TEMPFILE | jq '.[0].credentials.url' | sed 's/"//g')
}

#********************************
#  Get logs
#********************************

function getLogs() {
    TEMPFILE="temp-environment.log"

    # curl -X GET -u "apikey:$WA_APIKEY" "$WA_URL/v2/assistants/$WA_ENVIRONMENT_ID/logs?version=$WA_VERSION"
    curl -X GET -u "apikey:$WA_APIKEY" "$WA_URL/v2/assistants/$WA_ENVIRONMENT_ID/logs?version=$WA_VERSION" >  $ROOTFOLDER/scripts/$TEMPFILE
    echo ""
    echo "curl -X GET -u apikey:$WA_APIKEY $WA_URL/v2/assistants/$WA_ENVIRONMENT_ID/logs?version=$WA_VERSION " 

}

function getEnvironments() {
    TEMPFILE="temp-environments.json"

    echo ""
    curl -X GET -u "apikey:$WA_APIKEY" "$WA_URL/v2/assistants/$WATSON_ASSISTANT_ID/environments?version=$WA_VERSION" 
    curl -X GET -u "apikey:$WA_APIKEY" "$WA_URL/v2/assistants/$WATSON_ASSISTANT_ID/environments?version=$WA_VERSION" > $ROOTFOLDER/scripts/$TEMPFILE 
    echo ""
    echo "curl -X GET -u apikey:$WA_APIKEY $WA_URL/v2/assistants/$WATSON_ASSISTANT_ID/environments?version=$WA_VERSION"

    export WA_ENVIRONMENT_ID=$(cat $ROOTFOLDER/scripts/$TEMPFILE | jq '.environments[0].environment_id' | sed 's/"//g')
    echo "Environment ID: $WA_ENVIRONMENT_ID"
}

# **********************************************************************************
# Execution
# **********************************************************************************

echo "#*******************"
echo "# Connect to IBM Cloud and"
echo "# get the Watson Assistant API key"
echo "#*******************"

loginIBMCloud
getAPIKey

echo "#*******************"
echo "# Connect to IBM Cloud and"
echo "# Get Watson Assistant environments from Assistant ID: $WATSON_ASSISTANT_ID"
echo "#*******************"
getEnvironments

echo "#*******************"
echo "# Connect to IBM Cloud and"
echo "# Get Watson Assistant logs from Assistant ID: $WATSON_ASSISTANT_ID"
echo "#*******************"
getLogs
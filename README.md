
# Serverless Slack Glossary
Create a serverless Slack Glossary with AWS Lambda, API Gateway, DynamoDB, and CloudFormation. All services will be automatically provisioned for you. All that's needed is your Slack App keys.

## What it does ##
This app allows you to build a internal glossary of terms at your organization, easily accessed via a Slack slash command. By default all responses are private.

* ```/glossary help``` will return the entry for "help" and this can be customized in the last step of these instructions
* ```/glossary list``` will return all the entries in the glossary
* ```/glossary <term>``` will return the entry for the submitted term, if it exists
* ```/glossary add <term> <definition>``` will either add a new term, or update an existing term definition
* ```/glossary public <term>``` will post the term entry publicly

## Install Serverless and provision AWS
  
1. Setup your [AWS Credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md)
2. Install [Serverless.js](https://serverless.com)

  ```
  npm install -g serverless
  ```
3. Install The Serverless Slack Glossary Template and provision all AWS services. Note that part of this process is copying serverless.template.yaml to serverless.yaml

  ```
  serverless install --url https://github.com/dshackith/serverless-slack-glossary
  cd serverless-slack-glossary
  npm install
  cp serverless.template.yml serverless.yml
  serverless deploy
  ```


## Create a Slack App
1. Create a new [Slack App](https://api.slack.com/apps/new)
2. Use the generated **POST** url for Slack's slash commands, events, and interactive messages
3. Update serverless.yml with your new Slack App keys

[Slack](https://api.slack.com/apps)




## Install the Slack App and Test

1. Deploy the changes to AWS `serverless deploy`
2. Navigate to the **GET** url provided from serverless
3. Walk through the OAuth flow and install the App
4. Goto the team and test the slash command `/glossary`

## Add entries in Slack
Add a help entry to the Glossary:
```/glossary add Help You can add or update entries in the glossary using `/glossary add <your term> <your definition>`. To see what is currently in the glossary use `/glossary list`.```




_All the tokens and urls above were invalidated before posting this tutorial. You will need to use your own tokens_

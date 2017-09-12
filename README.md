
# Serverless Slack Glossary
Create a serverless Slack Glossary with AWS Lambda, API Gateway, DynamoDB, and CloudFormation. All services will be automatically provisioned for you. All that's needed is your Slack App keys.


## Install Serverless and provision AWS
  
1. Setup your [AWS Credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md)
2. Install [Serverless.js](https://serverless.com)

  ```
  npm install -g serverless
  ```
3. Install The Serverless Slack App Template and provision all AWS services

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
3. Update the [serverless.yml](serverless.yml) with your new Slack App keys

[Slack](https://api.slack.com/apps) | [Serverless](serverless.yml)
:---:|:---:




## Install the Slack App and Test

1. Deploy the changes to AWS `serverless deploy`
2. Navigate to the **GET** url provided from serverless
3. Walk through the OAuth flow and install the App
4. Goto the team and test the slash command `/glossary`

## Add entries in Slack
Add a help entry to the Glossary:
```/glossary add Help You can add or update entries in the glossary using `/glossary add <your term> <your definition>`. To see what is currently in the glossary use `/glossary list`.```




_All the tokens and urls above were invalidated before posting this tutorial. You will need to use your own tokens_

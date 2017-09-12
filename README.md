
# Serverless Slack Glossary
Create a serverless Slack Glossary with AWS Lambda, API Gateway, DynamoDB, and CloudFormation. All services will be automatically provisioned for you. All that's needed is your Slack App keys.


## Install Serverless and provision AWS
![serverless-slack-install](https://cloud.githubusercontent.com/assets/35968/21295095/49631b60-c502-11e6-9043-715fefb180df.gif)
  
1. Setup your [AWS Credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md)
2. Install [Serverless.js](https://serverless.com)

  ```
  npm install -g serverless
  ```
3. Install The Serverless Slack App Template and provision all AWS services

  ```
  serverless install --url https://github.com/dshackith/serverless-slack-glossary
  cd serverless-slack-app
  npm install
  serverless deploy
  ```


## Create a Slack App
![serverless-slack-app](https://cloud.githubusercontent.com/assets/35968/21295093/495c9b32-c502-11e6-95c4-86e0acc95296.gif)

1. Create a new [Slack App](https://api.slack.com/apps/new)
2. Use the generated **POST** url for Slack's slash commands, events, and interactive messages
3. Update the [serverless.yml](serverless.yml) with your new Slack App keys

[Slack](https://api.slack.com/apps) | [Serverless](serverless.yml)
:---:|:---:
![slack-app-keys](https://cloud.githubusercontent.com/assets/35968/21295094/49605452-c502-11e6-9d19-96680cd39858.png) | ![serverless-keys](https://cloud.githubusercontent.com/assets/35968/21295097/49707ac6-c502-11e6-8a4d-ec2f35a1e744.png)



## Install the Slack App and Test
![serverless-slack-app-install](https://cloud.githubusercontent.com/assets/35968/21295096/49648982-c502-11e6-912f-c287b82da3a1.gif)

1. Deploy the changes to AWS `serverless deploy`
2. Navigate to the **GET** url provided from serverless
3. Walk through the OAuth flow and install the App
4. Goto the team and test the slash command `/glossary`

## Add entries in Slack
Add a help entry to the Glossary:
```/glossary add Help You can add or update entries in the glossary using `/glossary add <your term> <your definition>`. To see what is currently in the glossary use `/glossary list`.```




_All the tokens and urls above were invalidated before posting this tutorial. You will need to use your own tokens_

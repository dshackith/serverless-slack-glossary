'use strict';

// Include the serverless-slack bot framework
const slack = require('serverless-slack');

// The function that AWS Lambda will call
exports.handler = slack.handler.bind(slack);

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const table = process.env.GLOSSARY_TABLE;

const scanningParameters = {
  TableName: "Glossary"
}

const errorText = "";

function getDefinition(term) {
  var params = {
    TableName: "Glossary",
    Key: {
      "termlower": term.toLowerCase()
    }
  };
  return docClient.get(params).promise();
};

function prepEntry(str,delim,count){
  var parts = str.split(delim);
  var tail = parts.slice(count).join(delim);
  var result = parts.slice(0,count);
  result.push(tail);
  return result;
}

function getTerm(str){
  var commandArray =prepEntry(str," ",1);
  var entry = commandArray[1];
  return entry;
}

function getGlossary() {
  var params = {
    TableName: "Glossary"
    };
  return docClient.scan(params).promise();
};

function addEntry(word,def) {
  var wordLower = word.toLowerCase();
  var params = {
    TableName: "Glossary",
    Item: {
      term: word,
      definition: def,
      termlower: wordLower
    }
    };
  return docClient.put(params).promise();
};

function removeEntry(word) {
  wordLower = word.toLowerCase();
  var params = {
    TableName: "Glossary",
    Item: {
      termlower: wordLower
    }
  };
  return docClient.delete(params).promise();
};

// Slash Command handler

slack.on('/glossary', (msg, bot) => {
  
  var term = msg.text;
  var definition = "";
  var glossary = "";
  var message = {
    text: ""
  };
  var messageText = "";

  switch (true) {
    case /^list/i.test(term):
      getGlossary().then(function(data) {
        var glossaryRaw = data;
        glossaryRaw.Items.forEach(function(entry) {
          if (entry.termlower != "help") {
            glossary += "*"+entry.term +"*:\n"+entry.definition+"\n"
          }
        });
        message = { 
          text: glossary
        };
        bot.replyPrivate(message);
      }).catch((error) =>{
        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
    case /^add\s\w+/i.test(term): 
      var newEntry = prepEntry(term," ",2);
      var word = newEntry[1];
      var newDef = newEntry[2];
      if (word) {
        addEntry(word,newDef).then(function(data) {
          message = { 
            text: "Added the following entry:\n*"+word+"*:\n"+newDef
          };
          bot.replyPrivate(message);
        }).catch((error) => {
          message = { 
            text: "Something went wrong:\n"+"```"+ error+ "```"
          };
          bot.replyPrivate(message);
        });
      } 
      break;
    case /^remove\s\w/i.test(term):
      var badTerm = getTerm(term)
      removeEntry(badTerm).then(function(data) {
        message = { 
          text: "Removed the following entry:\n*"+badTerm+"*"
        };
      }).catch((error)=> {
        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
    case /^public\s\w/i.test(term):
      var publicTerm = getTerm(term)
      getDefinition(publicTerm).then(function(data) {
        if (data.Item) {
          definition = data.Item.definition;
          var returnedTerm = data.Item.term;
          var messageText = "*" + returnedTerm + "*:\n" + definition;
          message = { 
            text: messageText
          };
          bot.reply(message);
        } else {
          message = {
            text: "Term: " +term+ " not found. You can add it using `/term add " +term+ " <your definition>`"
          };
          bot.replyPrivate(message);
        }
      }).catch((error) =>{
        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
    case /^\w/i.test(term):
      getDefinition(term).then(function(data) {
        if (data.Item) {
          definition = data.Item.definition;
          var returnedTerm = data.Item.term;
          messageText = "*" + returnedTerm + "*:\n" + definition;
          message = { 
            text: messageText
          };
          bot.replyPrivate(message);
        } else {
          message = {
            text: "Term: " +term+ " not found. You can add it using `/term add " +term+ " <your definition>`"
          };
          bot.replyPrivate(message);
        }
      }).catch((error) =>{
        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
    case /^$/i.test(term):
      message = { 
        text: "You need to provide a term or a command to use this slash command"
      };
      bot.replyPrivate(message);
      break;
  }
});


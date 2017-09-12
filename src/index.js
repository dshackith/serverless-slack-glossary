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
  console.log(params)
  console.log("Running get...")
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
  console.log(params)
  console.log("Running scan...")
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
  console.log(params)
  console.log("Adding term:",word)
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
  console.log(params)
  console.log("Removing term:",word)
  return docClient.delete(params).promise();
};

// Slash Command handler

slack.on('/karma', (msg, bot) => {
  let message = {
   //text: '```' + JSON.stringify(msg.text, null, 4) + '```'
   text: "@"+msg.user_name + " has given 0 karma."
  };
  bot.reply(message);
}
);



slack.on('/glossary', (msg, bot) => {
  // let params = {
  //   Key: { def: msg.text },
  //   TableName: Glossary
  // }
  var term = msg.text;
  var definition = "";
  var glossary = "";
  var messageText = "";
  var message = {
    text: "Let me see... nope. Could not find that."
  };

  switch (true) {
    case /^list/i.test(term):
      getGlossary().then(function(data) {
        console.log("Scan results:", JSON.stringify(data, null, 2));
        var glossaryRaw = data;
        // console.log("Glossary:", glossary);
        glossaryRaw.Items.forEach(function(entry) {
          if (entry.term != "help") {
            glossary += "*"+entry.term +"*:\n"+entry.definition+"\n"
          }
        });
        messageText = glossary;
        console.log("Message text:", messageText);
        message = { 
          text: messageText
        };
        bot.replyPrivate(message);
      }).catch((error) =>{
        console.error("Something went wrong", error);
        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
    case /^add\s\w+/i.test(term): 
      console.log("Term was added:",term);
      var newEntry = prepEntry(term," ",2);
      console.log("New Entry:",newEntry);
      var word = newEntry[1];
      var newDef = newEntry[2];
      if (word) {
        addEntry(word,newDef).then(function(data) {
          console.log("Adding new entry:",data)
          message = { 
            text: "Added the following entry:\n*"+word+"*:\n"+newDef
          };
          bot.replyPrivate(message);
        }).catch((error) => {
          console.error("Something went wrong", error);
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
        console.log("Removing entry:",data)
        message = { 
          text: "Removed the following entry:\n*"+badTerm+"*"
        };
      }).catch((error)=> {
        console.error("Something went wrong", error);
        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
    case /^public\s\w/i.test(term):
      var publicTerm = getTerm(term)
      getDefinition(publicTerm).then(function(data) {
        console.log("Definition results:", JSON.stringify(data, null, 2));
        if (data.Item) {
          definition = data.Item.definition;
          var returnedTerm = data.Item.term;
          console.log("Definition:", definition);
          messageText = "*" + returnedTerm + "*:\n" + definition;
          console.log("Message text:", messageText);
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
        console.error("Something went wrong", error);

        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
    case /^\w/i.test(term):
      getDefinition(term).then(function(data) {
        console.log("Definition results:", JSON.stringify(data, null, 2));
        if (data.Item) {
          definition = data.Item.definition;
          var returnedTerm = data.Item.term;
          console.log("Definition:", definition);
          messageText = "*" + returnedTerm + "*:\n" + definition;
          console.log("Message text:", messageText);
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
        console.error("Something went wrong", error);

        message = { 
          text: "Something went wrong:\n"+"```"+ error+ "```"
        };
        bot.replyPrivate(message);
      });
      break;
  }
  
 if (term) 
  {
    
  } 
  else 
  {
    message = { 
      text: "You need to provide a term or a command to use this slash command"
    };
    bot.replyPrivate(message);
  }
}
);


// Reaction Added event handler
slack.on('reaction_added', (msg, bot) => {
  bot.reply({ 
    text: ':wave:' 
  });
});

/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "Hey Team! Ask me design questions!")
});

controller.hears(['hey dahlia'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
  controller.storage.users.get(message.user, function(err, user) {
     if (user && user.name) {
         bot.reply(message, 'Hello ' + user.name + '!!');
     } else {
         bot.reply(message, 'Heyyyy 👋🏻');
     }
 });
 });

controller.hears(['dahlia', 'what are you?'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '`@ds-dahlia` #EC0041');
});

controller.hears(['fog'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '`@ds-fog`#D8DDE6');
});
controller.hears(['midnight'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '`@ds-midnight` #475470');
});
controller.hears(['abyss'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '`@ds-abyss` #2F3542');
});
controller.hears(['blue'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '`@ds-blue` #0A75E3');
});
controller.hears(['what are our primary colors?'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '`@ds-dahlia` #EC0041 | `@ds-fog` #D8DDE6 | `@ds-midnight` #475470 | `@ds-abyss` #2F3542');
});
controller.hears(['what are our status colors?'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '`@ds-red` #FF0000 | `@ds-orange` #FFBA43 | `@ds-green` #0AAC29');
});
controller.hears(['who is on the design team?'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, 'Monica Parra, Nicole Boettcher, John Kreitlow, Kim Hart, Christina Vu, Jane Ngo');
});
controller.hears(['I need a designer'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '@monica @nicole @cvu @jngo @ahajnos');
});
controller.hears(['I need a front-end dev'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '@kim @jkreitlow @cdieter');
});
controller.hears(['show me icons'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, 'https://design.jwplayer.com/docs/#/patterns/iconography');
});
controller.hears(['take me to neverland'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '🧚🏻‍♂️ https://design.jwplayer.com');
});
controller.hears(['make me a design ticket'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, 'https://bit.ly/2G98uCt');
});
controller.hears(['where is smee?'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, ':smee: http://smee.longtailvideo.com/');
});
controller.hears(['take me to the simi-dash'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, '✨ http://simi-dash.longtailvideo.com/ ✨');
});
controller.hears(['where are the docs?'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, 'https://design.jwplayer.com/docs/#/');
});
controller.hears(['help'], ['mention', 'direct_message'], function(bot,message) {
    bot.reply(message, 'These are my commands: \n `hey dahlia` \n `take me to neverland` \n `what are our primary colors?` \n `what are our status colors?` \n `who is on the design team?` \n `I need a designer` \n `I need a front-end dev` \n `make me a design ticket` \n `where is smee?` \n `take me to the simi-dash` \n `show me icons` \n `what are you?` \n `dahlia` \n `fog` \n `midnight` \n `abyss` \n `blue` \n `where are the docs?`');
});

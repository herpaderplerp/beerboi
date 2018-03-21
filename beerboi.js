// const { WebClient } = require('@slack/client');
const {RTMClient} = require('@slack/client');
// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_TOKEN;
// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
rtm.start();
let config = require('config.json');


var UntappdClient = require("node-untappd");
var debug = false;
var untappd = new UntappdClient(debug);

// const web = new WebClient(token);
//
// // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
// const conversationId = '#bots';
//
// // See: https://api.slack.com/methods/chat.postMessage
// web.chat.postMessage({ channel: conversationId, text: 'Hello there' })
//     .then((res) => {
//         // `res` contains information about the posted message
//         console.log('Message sent: ', res.ts);
//     })
//     .catch(console.error);

untappd.setClientId(config.untappd.clientId);
untappd.setClientSecret(config.untappd.clientSecret);
// untappd.setAccessToken(config.untappd.accessToken); // Optional

function polluser(lookupuser){
    untappd.userFeed(function(err,obj){
        var beers = obj.results.forEach(function(checkin){
            console.log("\n"+username,"drank",checkin.beer_name);
            console.log("by",checkin.brewery_name);
            if (checkin.venue_name) console.log("at",checkin.venue_name);
            console.log("on",checkin.created_at);
        });
    },lookupuser);


}

function unregisterUsre(user){
    //check if user in registered, then remove

    if(user in config.registeredUsers){
        config.registeredUsers[user].pup
    }else {

    }
}


function registerUser(user) {
    /*
    place user in temp array
    poll untappd to see if user is valid
    if valid
        add to registered users list
        build user profile
            i don't think this is necessary, just dump while user json, on campare jusr see if variables which matter have changed
        initiate save operation
    else
        reject change
        send error message

     */
    if (user in config.registeredUsers){
        /*
        user already registered message
         */
    }
    else if (user in config.bannedUsers){
        /*
        user banned message
         */
    }
    //else user ok to be registered
    //check user valid
    if (uservalid){
        config.registeredUsers.push(user);
        polluser(user);
    }else{
        /*
        user invalid error
         */
    }

}

setInterval(function () {
    //poll for changes

}, 60000);

let operations={
    'register':function register(commandList){
        registerUser(commandList[2]);
    },
    'unregister':function unregister(commandList) {
        unregisterUser(commandList[2]);
    },
    'help':function help() {
        rtm.sendMessage('Bug JC for command list', event.channel, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

};


rtm.on('message', (event) => {
    // For structure of `event`, see https://api.slack.com/events/message
    let thisUserPreString = '<@' + rtm.activeUserId + '>';


    if (event.type === 'message' && event.text.indexOf(thisUserPreString) === 0) {
        let commandList = event.text.split(' ');

        if (commandList[1] in operations) {
            operations[commandList[1]](commandList);
        }
        else {
            commandList.help();
        }
    }

});


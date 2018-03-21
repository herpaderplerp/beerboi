// const { WebClient } = require('@slack/client');
const {RTMClient} = require('@slack/client');
// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_TOKEN;
// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
rtm.start();


var UntappdClient = require("node-untappd");
var debug = false;
var untappd = new UntappdClient(debug);

var clientId = "[ your api key goes here ]"; // Replace this with your CLIENT ID
var clientSecret = "[ your client secret goes here ]"; // Replace this with your CLIENT SECRET
var accessToken = "[ your access token goes here ]"; // Replace this with an Access Token, Optional


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


untappd.setClientId(clientId);
untappd.setClientSecret(clientSecret);
untappd.setAccessToken(accessToken); // Optional

function polluser(){

    var lookupuser = "[ some user name ]";
    untappd.userFeed(function(err,obj){
        var beers = obj.results.forEach(function(checkin){
            console.log("\n"+username,"drank",checkin.beer_name);
            console.log("by",checkin.brewery_name);
            if (checkin.venue_name) console.log("at",checkin.venue_name);
            console.log("on",checkin.created_at);
        });
    },lookupuser);


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
}

setInterval(function () {
    //poll for changes

}, 60000);


rtm.on('message', (event) => {
    // For structure of `event`, see https://api.slack.com/events/message
    let thisUserPreString = '<@' + rtm.activeUserId + '>';


    if (event.type === 'message' && event.text.indexOf(thisUserPreString) === 0) {
        let commandList = event.text.split(' ');
        switch (commandList[1]) {  //switch on the verb
            case 'register':
                registerUser(commandList[2]);
                break;
            case 'unregister':
                break;
            case 'help':
                rtm.sendMessage('Bug JC for command list', event.channel, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                break;
            default:
                rtm.sendMessage('Unknown command: ' + commandList[1], event.channel, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                break

        }
    }

});


const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config()
const util = require('util')
const mongoose = require("mongoose");

// SERVICES
const TempRecord = require('./Services/TempRecord')

// COMPONENTS IMPORT
const Keyboards = require('./Materials/Keyboard')

// CONSTS
const token = process.env.TELEGRAM_TOKEN_PROD || process.env.TELEGRAM_TOKEN
const port = process.env.PORT
const url = process.env.url  || 'https://colivline.herokuapp.com:443';
const uristring = process.env.MONGODB_URI



// Create a bot that uses 'polling' to fetch new updates
const options = {
    webHook: {
        port: port
    }
};
const bot = new TelegramBot(token, options);
bot.openWebHook()
bot.setWebHook(`${url}/bot${token}`)

mongoose.connect(uristring, {useNewUrlParser: true}).
    then( () => {
    console.log('Succeeded connected to: ' + uristring);
        } )
    .catch( (err) => {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
        })


// Listen for any kind of message. There are different kinds of
// messages.

var option = {
    "parse_mode": "Markdown",
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [[{
            text: "My phone number",
            request_contact: true
        }], ["Cancel"]]
    }
};

bot.onText(/\/distance1/, (msg) => {
    bot.sendMessage(msg.chat.id, "How can we contact you?", option).then(() => {
        bot.once("contact",(msg)=>{
            var option = {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "one_time_keyboard": true,
                    "keyboard": [[{
                        text: "My location",
                        request_location: true
                    }], ["Cancel"]]
                }
            };
            bot.sendMessage(msg.chat.id,
                util.format('Thank you %s with phone %s! And where are you?', msg.contact.first_name, msg.contact.phone_number),
                option)
                .then(() => {
                    bot.once("location",(msg)=>{
                        bot.sendMessage(msg.chat.id, "We will deliver your order to " + [msg.location.longitude,msg.location.latitude].join(";"));
                    })
                })
        })
    })

})

bot.onText(/\/recordtemperature/, (msg) => {

    bot.sendMessage(msg.chat.id, "Send me your temperature in F, I will store it for you. You can keep daily records, generate reports and send it over" )
        .then( () => {
            bot.once('text', (msg) =>{

                if (isNaN(msg.text) ) {
                    bot.sendMessage(msg.chat.id, 'Enter Number if you want to record the temperature, try again with /recordtemperature')
                } else if ( 90< msg.text == msg.text < 110 ) {
                    console.log('reply temperature in F',msg.text)
                    TempRecord.addUserTemp(msg.chat.id, parseFloat(msg.text))
                } else {
                    bot.sendMessage(msg.chat.id, 'Temperature is out of range for a human. Are you an alien?')
                }
            })
        })

})

bot.onText(/\/start/, (msg) => {
    TempRecord.createUser({UserID: msg.chat.id, first_name: msg.chat.first_name})
    bot.sendMessage(msg.chat.id, "Hello. How can help you? See the list of available commands")
})

bot.onText(/\/update/, (msg) => {
    var option = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [[{
                text: "My location",
                request_location: true
            }], ["Cancel"]]
        }
    };
    bot.sendMessage(msg.chat.id, "Share with me your live location to get local updates of COVID19 ", option)
        .then(() => {
            bot.once("location",(msg)=>{

                bot.sendMessage(msg.chat.id, "We will deliver your order to " + [msg.location.longitude,msg.location.latitude].join(";"));
            })
        })



})



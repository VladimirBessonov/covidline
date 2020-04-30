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


bot.onText(/\/recordtemperature/, (msg) => {

    bot.sendMessage(msg.chat.id, "Send me your temperature in F, I will store it for you. You can keep daily records, generate reports and send it over", {
        reply_markup: {
            force_reply: true
        }}
        )
        .then( ( replyPTemp) => {
            bot.onReplyToMessage(replyPTemp.chat.id, replyPTemp.message_id, (msg) =>{

                if (isNaN(msg.text) ) {
                    bot.sendMessage(replyPTemp.chat.id, 'Enter Number if you want to record the temperature, try again with /recordtemperature')
                } else if ( 90< msg.text == msg.text < 110 ) {
                    TempRecord.addUserTemp(msg.chat.id, parseFloat(msg.text))
                    bot.sendMessage(replyPTemp.chat.id, 'Received. you can now generate report, send it over, etc', {
                        parse_mode: "Markdown",
                        reply_markup : {
                            "one_time_keyboard": true,
                            inline_keyboard : Keyboards.reportActions
                        }
                    } )
                } else {
                    bot.sendMessage(msg.chat.id, 'Temperature is out of range for a human. Are you an alien?')
                }
            })
        })
        .catch( err => console.log(err))

})

bot.onText(/\/start/, (msg) => {
    TempRecord.createUser({UserID: msg.chat.id, first_name: msg.chat.first_name})
    bot.sendMessage(msg.chat.id, "Hello. How can help you? See the list of available commands")
})

bot.on("callback_query", (callbackQuery) => {
    switch (callbackQuery.data) {
        case 'deleteTemp':
            TempRecord.deleteTemp(callbackQuery.message.chat.id)
            bot.answerCallbackQuery(callbackQuery.id)
                .then(() => bot.sendMessage(callbackQuery.message.chat.id, "Your temp measurement history is deleted"));
            break
    }
});




const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config()
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN
const port = process.env.PORT
const url = process.env.url  || 'https://https://colivline.herokuapp.com:443';

const options = {
    webHook: {
        // Port to which you should bind is assigned to $PORT variable
        // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
        port: port
        // you do NOT need to set up certificates since Heroku provides
        // the SSL certs already (https://<app-name>.herokuapp.com)
        // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
};

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, options);
bot.openWebHook()
bot.setWebHook(`${url}/bot${token}`)

//
// const app = new Koa()
// const router = Router()
// router.post('/bot', ctx => {
//     const { body} = ctx.request;
//     bot.processUpdate(body)
//     ctx.status = 200
// })
// app.use(bodyParser())
// app.use(router.routes())
// app.listen(process.env.PORT, ()=> {
//     console.log(`Server runs on port ${process.env.PORT}`)

// })
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});
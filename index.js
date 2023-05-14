const qrcode = require('qrcode-terminal');
const app = require('express')();
var bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
require("dotenv").config();

const PORT = 8000;
let send = async () => {
    console.log('send before client');
}

// parse application/json
app.use(bodyParser.json())
app.listen(PORT, () => console.log('Server Started'))

const client = new Client({
    authStrategy: new LocalAuth()
});
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});
client.on('ready', () => {
    console.log('Client is ready!');
    send = async (chatId, message) => {
        return await client.sendMessage(chatId, message);
    }
    app.post("/", async function (req, res) {
        let chatId = req.body.number;
        const message = req.body.message;
        const token = req.headers['token'];
        // check if time is set
        if (token != process.env.TOKEN) {
            console.log(process.env.TOKEN);
            res.status(401).send("Invalid Token");
            return;
        }
        if (!message) {
            res.status(400).send('message not set');
            return;
        }
        if (!chatId) {
            res.status(400).send('number not set');
            return;
        } else {
            chatId = chatId.substring(1) + "@c.us";
        }
        await send(chatId, message);
        res.status(200).send({ message: 'message has been sent' });
    });

    client.sendMessage('918857977254@c.us', 'Hello from NodeJS!');
});

client.initialize();
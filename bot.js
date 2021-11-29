const Discord = require('discord.js');
const bot = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]})
const commands = require("./commands.js");
const fs = require('fs');
let config = require('./config.json');
let token = config.token;
let prefix = config.prefix;

bot.on("ready", function () {
    console.log(bot.user.username + " is on");
});

bot.on('messageCreate', (message) => {
    if (message.author.username !== bot.user.username) {
        let command = message.content.trim() + " ";
        let commandName = command.slice(0, command.indexOf(" "));
        let messageList = command.split(" ");

        for (let commandIndex in commands.comms) {
            let command2 = prefix + commands.comms[commandIndex].name;

            if (command2 === commandName) {
                commands.comms[commandIndex].out(bot, message, messageList);
            }
        }
    }
});

bot.login(token);
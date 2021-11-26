const config = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const prefix = config.prefix;

function rollGiver(bot, message, args) {
    const arg = message.content.split(' ').slice(1);
    const roles = config.roles;
    const userId = message.author.id;

    for (let i = 0; i < roles.length; i++) {
        if (arg == roles[i].name) {
            let roleId = message.guild.roles.cache.get(`${roles[i].id}`)
            let roleName = message.guild.roles.cache.get(`${roles[i].name}`)
            let user = message.guild.members.cache.get(`${userId}`);

            if (user.roles.cache.find(role => role.id == roleId)) {
                message.reply(`You already have ${arg} role`);
                return null;
            }

            user.roles.add(roleId)
            message.reply(`You've got ${roles[i].name} role`);
        }
    }
}

function removeRole(bot, message, args) {
    const arg = message.content.split(' ').slice(1);
    const roles = config.roles;
    const userId = message.author.id;


    for (let i = 0; i < roles.length; i++) {
        if (arg == roles[i].name) {
            let roleId = message.guild.roles.cache.get(`${roles[i].id}`)
            let user = message.guild.members.cache.get(`${userId}`);

            if (user.roles.cache.find(role => role.id == roleId)) {
                user.roles.remove(roleId)
                message.reply(`${roles[i].name} role has been removed`);
            }
            else {
                message.reply(`You don't have ${arg} role`);
                return null;
            }
        }
    }
}

// Admins only
function newRole(bot, message, arguments) {
    const arg = message.content.split(' ').slice(1);
    const roles = config.roles;
    const userId = message.author.id;

    for (let i = 0; i < roles.length; i++) {
        for(let index in roles[i]) {
            if (!roles[i][index].includes(arg.toString())) {
                let role = message.guild.roles.cache.find((role) => {
                    return role.name === arg.toString();
                });

                if(role) {
                    let data = roles;
                    let newData = {name: role.name, id: role.id};

                    data.push(newData)
                    fs.writeFile("config.json", JSON.stringify(data), function(err) {
                            if (err) throw err;
                            console.log('complete');
                        }
                    );
                }
                else {
                    break;
                }
            }
        }
    }

    message.reply(`${arg} role already added`);
}

// Admins only
function deleteRole(bot, message, args) {
    message.reply(`test`);
}

function availableRoles(bot, message, args) {
    const roles = config.roles;
    let messageContent = '';

    for (let i = 0; i < roles.length; i++) {
        messageContent += `${roles[i].name}`;

        if (i < roles.length - 1){
            messageContent += `, `;
        }
    }
    message.reply(`Available roles: ${messageContent}`);
}

let commandList = [
    {
        name: "role",
        out: rollGiver,
        about: "Gives a role"
    },
    {
        name: "roles",
        out: availableRoles,
        about: "Available Roles"
    },
    {
        name: "remove",
        out: removeRole,
        about: "Removes role"
    },
    {
        name: "add",
        out: newRole,
        about: ""
    },
    {
        name: "delete",
        out: deleteRole,
        about: ""
    },

];

module.exports.comms = commandList;
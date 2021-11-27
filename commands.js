const config = require('./config.json');
const fs = require('fs');
const information = require('./package.json');
const versionChanges = require('./changes.json');

function rollGiver(bot, message, args) {
    const arg = message.content.split(' ').slice(1);
    const roles = config.roles;
    const userId = message.author.id;

    for (let i = 0; i < roles.length; i++) {
        if (arg == roles[i].name) {
            let roleId = message.guild.roles.cache.get(`${roles[i].id}`);
            let user = message.guild.members.cache.get(`${userId}`);

            if (user.roles.cache.find(role => role.id == roleId)) {
                message.reply(`You already have ${arg} role`);

                return null;
            }

            user.roles.add(roleId);
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
            let roleId = message.guild.roles.cache.get(`${roles[i].id}`);
            let user = message.guild.members.cache.get(`${userId}`);

            if (user.roles.cache.find(role => role.id == roleId)) {
                user.roles.remove(roleId);
                message.reply(`${roles[i].name} role has been removed`);
            }
            else {
                message.reply(`You don't have ${arg} role`);

                return null;
            }
        }
    }
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

function showChanges(bot, message, args) {
    const changes = versionChanges.new;
    let messageContent = "";

    for (let changesIndex = 0; changesIndex < changes.length; changesIndex++) {
        if (changes[changesIndex]) {
            let change = changes[changesIndex];

            for (let innerIndex = 0; innerIndex < change.length; innerIndex++) {
                if (change[innerIndex].name != '') {
                    let item = change[innerIndex];

                    switch (item.title) {
                        case 'New Command':
                            messageContent += `**${item.title}**\nНазвание: *${item.name}*\nОписание: *${item.description}*\n\n`;
                            break;
                        case 'Changed Command':
                            messageContent += `**${item.title}**\nСтарое название: *${item.oldName}*\nНовое название: *${item.newName}*\nОписание изменения: *${item.description}*\n\n`;
                            break;
                        case 'New Feature':
                            messageContent += `**${item.title}**\nНазвание фичи: *${item.name}*\nОписание: *${item.description}*\n\n`;
                            break;
                        case 'Fix':
                            messageContent += `**${item.title}**\nФикс: *${item.name}*\nОписание: *${item.description}*\n\n`;
                            break;
                    }
                }
            }
        }
    }

    messageContent += "";
    message.reply(`Version ${information.version} changes:\n${messageContent}`);
}

// Admins only
function newRole(bot, message, arguments) {
    const arg = message.content.split(' ').slice(1);
    const roles = config.roles;

    if (message.member.permissions.has("ADMINISTRATOR")) {
        let isRepeated = false;

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name == arg) {
                message.reply(`${arg} role already added`);
                isRepeated = true;
            }

            if (i === roles.length - 1 && !isRepeated) {
                let role = message.guild.roles.cache.find((role) => {

                    return role.name === arg.toString();
                });

                if (role) {
                    let data = config;
                    let newData = {name: role.name, id: role.id};

                    data.roles.push(newData);
                    fs.writeFileSync("config.json", JSON.stringify(data), function (e) {
                        if (e) return console.log(e);
                    });

                    console.log(`role adding complete (${arg})`)
                    message.reply(`${arg} role successfully added`);

                    break;
                }
                else {
                    message.reply(`${arg} role doesn't exist`);

                    break;
                }
            }
        }
    }
    else {
        message.reply(`You don't have permission to add roles`);
    }
}

// Admins only
function deleteRole(bot, message, args) {
    const arg = message.content.split(' ').slice(1);
    const roles = config.roles;

    if (message.member.permissions.has("ADMINISTRATOR")) {

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name != arg) {
                continue;
            }
            else {
                let role = message.guild.roles.cache.find((role) => {
                    return role.name === arg.toString();
                });

                if (role) {
                    let data = config;

                    delete data.roles[i];
                    fs.writeFileSync("config.json", JSON.stringify(data), function (e) {
                        if (e) return console.log(e);
                    });

                    console.log(`role removing complete (${arg})`);
                    message.reply(`${arg} role successfully removed`);

                    break;
                }
                else {
                    message.reply(`${arg} role doesn't exist`);
                }
            }
        }
    }
    else {
        message.reply(`You don't have permission to delete roles`);
    }
}

let commandList = [
    {
        name: "role",
        out: rollGiver,
        about: "Добавляет роль из списка пользователю",
    },
    {
        name: "roles",
        out: availableRoles,
        about: "Все доступные на пользователей роли",
    },
    {
        name: "remove",
        out: removeRole,
        about: "Убрать роль",
    },
    {
        name: "addrole",
        out: newRole,
        about: "Добавить новую роль в список (admin)",
    },
    {
        name: "delete",
        out: deleteRole,
        about: "Удалить ненужную роль из списка (admin)",
    },
    {
        name: "help",
        out: showHelp,
    },
    {
        name: "changes",
        out: showChanges,
        about: `Список изменений текущей версии ${information.version}`,
    },
];

module.exports.comms = commandList;

function showHelp(bot, message, args) {
    const commands = commandList;
    let answerMessage = "```ARM\n";

    for (let i = 0; i < commands.length; i++) {
        if (commands[i].name != "help") {
            answerMessage += `${commands[i].name} ー ${commands[i].about}\n`;
        }
    }

    answerMessage += "```";
    message.reply(`${answerMessage}`);
}
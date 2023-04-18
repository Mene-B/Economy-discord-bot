const Discord = require("discord.js");
const client = new Discord.Client({intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessageTyping
]});

module.exports = client;
const config = require("./config.json");
const token = config.token;
const DataBase = require("easy-json-database");
const db = new DataBase("database.json");

const fs = require('fs');
const commandsFiles = fs.readdirSync("./slash-commands");
const commands = [];
for (const file of commandsFiles){
    const fileImport = require("./slash-commands/" + file);
    const command = {
        data : fileImport.data,
        run : fileImport.run
    }
    commands.push(command);
}

client.login(token);

client.on("ready" , ()=> {
    console.log("ready to work");
})

client.on("interactionCreate", (interaction)=>{
    if (!interaction.isCommand()) return;
    const cmd = commands.find(element => element.data.name === interaction.commandName)
    cmd.run(interaction, db, config)
})

client.on("messageCreate",(message)=>{
})




// quand la commande ajouterRoles est exécutée
// faire un interaction.guild.members.fetch();
// interaction.guild.members.cache.forEach()
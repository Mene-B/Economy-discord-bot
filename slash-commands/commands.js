const {SlashCommandBuilder,EmbedBuilder} = require("discord.js");
const fs = require("fs");

module.exports = {
    data : new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Shows the list of all the commands"),
    run : async function (interaction){
        const files = fs.readdirSync("./slash-commands");
        const newFiles = files.map(file => {
            const command = require("./" + file);
            console.log(command);
            return [command.data.name,command.data.description];
        })
        console.log(newFiles)

        const embed = new EmbedBuilder()
        .setAuthor({name : "Commands"})
        .setColor("White")
        
        newFiles.forEach((file, idx) => {
            embed.addFields({
                name : (idx % 2 === 0 && idx !== 0)? '\u200B' : "/" + file[0],
                value : (idx % 2 === 0 && idx !== 0) ? '\u200B' : file[1],
                inline: true
            })
        })
        interaction.reply({embeds : [embed]})
    }
}
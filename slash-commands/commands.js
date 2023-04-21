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
            return [command.data.name,command.data.description];
        })
        const embed = new EmbedBuilder()
        .setAuthor({name : "Commands"})
        .setColor("White")
        
        newFiles.forEach((file, idx) => {
            embed.addFields({
                name :   "/" + file[0],
                value : file[1],
                inline: true
            })
        })
        if (newFiles.length % 3 !== 0){
            for (let i=0 ; i<3-newFiles.length%3 ; i++){
                embed.addFields({
                    name : "\u200B" ,
                    value : "\u200B",
                    inline : true
                })
            }
        }
        interaction.reply({embeds : [embed]})
    }
}
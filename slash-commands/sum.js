const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('sum')
		.setDescription('Gives the sum of all the balances on the server'),
    run : async function(interaction, db ,config){
        let sum = 0;
        db.all().forEach(element => {
            sum += element.data[0]
        })

        const embed = new EmbedBuilder()
        .setAuthor({
            name : "Economy stats",
            iconURL : "https://i.goopics.net/ocqjqy.png"
        })
        .setFields(
            {name : "Total balance :",value : `${sum} :dollar:`}    // You can modify the message here if you want to
        )
        .setColor("Blue")

        return interaction.reply({embeds : [embed]})
        // Version de Simon : console.log(db.all().map((e) => e.data).reduce((a, p) => a + p, 0))
    }
}
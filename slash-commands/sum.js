const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('sum')
		.setDescription('Gives the sum of all the balances on the server'),
    run : async function(interaction, db ,config){
        let sum = 0;
        db.all().forEach(element => {
            sum += element.data
        })
        return interaction.reply(`The sum of all the balances is ${sum}`)
        // Version de Simon : console.log(db.all().map((e) => e.data).reduce((a, p) => a + p, 0))
    }
}
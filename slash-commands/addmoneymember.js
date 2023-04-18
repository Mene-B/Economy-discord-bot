const { SlashCommandBuilder } = require('discord.js');
const {sendLog} = require("../util");

module.exports = {

    data: new SlashCommandBuilder()
		.setName('addmoneymember')
		.setDescription('Add money to a member as an Admin')
        .addUserOption(option => {
            return option
            .setName("membername")
            .setDescription("Enter the member")
            .setRequired(true)
        })
        .addNumberOption(option => {
            return option
            .setName("quantity")
            .setDescription("Enter the amount of money")
            .setRequired(true)
        }),

    run: async function (interaction,db) {
        if(!interaction.member.roles.cache.has("1097209275530608640")){
            interaction.reply("Only Admins can add money !")
            return
        }
        const user = interaction.options.getUser('membername').id;
        if (!db.has(user)){
            db.set(user,0)
        }
        db.add(user, interaction.options.getNumber("quantity"))
        sendLog(interaction ,`${interaction.member} added ${interaction.options.getNumber("quantity")} credits to ${interaction.options.getUser("membername")}'s balance`);
		return interaction.reply('The money has been added !');
	}

};

const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription("Check your balance or someone else's one")
        .addUserOption(option => {
            return option
            .setName("membername")
            .setDescription("Enter the member you to check the balance")
            .setRequired(false)
        }),
    run: async function (interaction,db) {
        const user = interaction.options.getUser('membername')?.id || interaction.user.id;
        interaction.reply(`<@${user}> now have ${db.get(user) || 0} credits`);
        }
    }
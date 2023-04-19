const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription("Check your balance or someone else's one")
        .addUserOption(option => {
            return option
            .setName("member")
            .setDescription("Enter the member you to check the balance")
            .setRequired(false)
        }),
    run: async function (interaction,db) {
        await interaction.guild.members.fetch();
        const user = interaction.options.getUser('member')?.id || interaction.user.id;
        interaction.reply(`${interaction.guild.members.cache.get(user).nickname || interaction.guild.members.cache.get(user).user.username} now has ${db.get(user) || 0} credits`);
        }
    }
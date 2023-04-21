const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

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
        const embed = new EmbedBuilder()
        .setAuthor({
            name : interaction.guild.members.cache.get(user).nickname + ":atm:"|| interaction.guild.members.cache.get(user).user.username + ":atm:"|| interaction.member.nickname + ":atm:"|| interaction.user.username + ":atm:",
            iconURL : "https://i.goopics.net/ocqjqy.png"
        })
        .setDescription(`**Balance :** ${db.get(user) || 0} :dollar:`)
        .setColor("Gold")

        interaction.reply({embeds : [embed]});
        }
    }
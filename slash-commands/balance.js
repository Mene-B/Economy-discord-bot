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
        if (!db.has(user)){
            db.set(user,[0,0,[],[]])
        }
        const embed = new EmbedBuilder()
        .setAuthor({
            name : (interaction.guild.members.cache.get(user).nickname || interaction.guild.members.cache.get(user).user.username || interaction.member.nickname || interaction.user.username),
            iconURL : "https://i.goopics.net/ocqjqy.png"
        })
        .setDescription(`**Balance :** ${db.get(user)[0]} :dollar:`)   // You can modify the message here if you want to
        .setColor("Gold")

        interaction.reply({embeds : [embed]});
        }
    }
const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('withdrawrole')
		.setDescription('Withdraw a role to one or multiple members as an Admin')
        .addStringOption(option => {
            return option
            .setName("members")
            .setDescription("Mention the members here")
            .setRequired(true)
        })
        .addRoleOption(option => {
            return option
            .setName("role")
            .setDescription("Enter the role you want to remove from the users")
            .setRequired(true)
        }),
        run : async function (interaction, db, config){
            const string = interaction.options.getString("members");
            const regEx = /(<@([0-9]+)>)/g;
            const mentions = string.match(regEx);
            const ids = [];
            if (string.includes("@everyone")){
                await interaction.guild.members.fetch();
                await interaction.guild.members.cache.forEach(member => {
                    if (!member.user.bot){
                        member.roles.remove(interaction.options.getRole("role").id);
                    }
                })
                return interaction.reply("The role has been removed for everyone successfully !")
            }
            if (mentions.lenght === 0){
                return interaction.reply("Please mention members")
            }
            for( const mention of mentions) {
                const id = mention.slice(2).split('');
                id.pop();
                ids.push(id.join(''));
            };
            if (!interaction.member.roles.cache.has(config.adminId)){
                return interaction.reply("Only Admins can remove roles !");
            }else {
                await interaction.guild.members.fetch();
                await ids.forEach(id => {
                    interaction.guild.members.cache.get(id)?.roles.remove(interaction.options.getRole("role"));
                });
            }
            return interaction.reply("The role has been removed");
    }}
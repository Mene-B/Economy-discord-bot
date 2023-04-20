const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('addrole')
		.setDescription('Add a role to one or multiple members as an Admin')
        .addStringOption(option => {
            return option
            .setName("members")
            .setDescription("Mention the members here")
            .setRequired(true)
        })
        .addRoleOption(option => {
            return option
            .setName("role")
            .setDescription("Enter the role you want to add to the users")
            .setRequired(true)
        }),
        run : async function (interaction, db, config){
            const string = interaction.options.getString("members");
            const regEx = /(<@([0-9]+)>)/g;
            const mentions = string.match(regEx);
            const ids = [];
            if (string.match(/@everyone/g)?.length === 1){
                await interaction.guild.members.fetch();
                interaction.guild.members.cache.forEach(member => {
                    if (!member.user.bot){
                        member.roles.add(interaction.options.getRole("role").id)
                    }
                });
                return interaction.reply("The role has been added to everyone in the guild successfully !")

            }
            if (mentions === null){
                return interaction.reply("Please mention members")
            }
            for( const mention of mentions) {
                const id = mention.slice(2).split('');
                id.pop();
                ids.push(id.join(''));
            };
            if (!interaction.member.roles.cache.has(config.adminId)){
                return interaction.reply("Only Admins can add roles !")
            }else {
                await interaction.guild.members.fetch()
                ids.forEach(id => {
                    interaction.guild.members.cache.get(id).roles.add(interaction.options.getRole("role").id);
                });
                return interaction.reply("The role has benn added successfully !");
            }
    }}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('withdrawrole')
		.setDescription('Withdraw a role from one or multiple members as an Admin')
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

            const roles = []
            for (const role of interaction.member.roles.cache){
                roles.push(role[0]);
            }
            const admin = roles.map(role => {
                return interaction.guild.roles.cache.get(role).permissions.has("0x0000000000000008")
            })
            if (!admin.includes(true)){
                const embed = new EmbedBuilder()
                .setAuthor({
                    name : interaction.member.nickname || interaction.user.username,
                    iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
                })
                .setDescription("⛔ **Only Admins can withdraw roles !** ⛔")
                .setColor("Red")

                return interaction.reply("Only Admins can remove roles !");
            }
            if (string.includes("@everyone")){
                await interaction.guild.members.fetch();
                interaction.guild.members.cache.forEach(member => {
                    if (!member.user.bot){
                        member.roles.remove(interaction.options.getRole("role").id);
                    }
                })
                const embed = new EmbedBuilder()
                .setAuthor({
                    name : "Admins",
                    iconURL : "https://i.goopics.net/lxdlsh.png"
                })
                .setDescription(`:negative_squared_cross_mark: The **Admins** withdrew a role from everyone ! :negative_squared_cross_mark:\n\n**Role :** ${interaction.options.getRole("role")}`)  // You can modify the message here if you want to

                return interaction.reply({embeds : [embed]})
            }
            if (mentions.lenght === 0){
                return interaction.reply("Please mention members")
            }
            for( const mention of mentions) {
                const id = mention.slice(2).split('');
                id.pop();
                ids.push(id.join(''));
            };
            await interaction.guild.members.fetch();
            ids.forEach(id => {
                interaction.guild.members.cache.get(id)?.roles.remove(interaction.options.getRole("role"));
            });
            const embed = new EmbedBuilder()
            .setAuthor({
                name : "Admins",
                iconURL : "https://i.goopics.net/lxdlsh.png"
            })
            .setDescription(`:negative_squared_cross_mark: The **Admins** decided to withdraw a role from members\n\n**Role :** ${interaction.options.getRole("role")}\n**Members :** <@${ids.join("> :atm:, <@")}> :atm:`)     // You can modify the message here if you want to
            .setColor("Green")

            return interaction.reply({embeds : [embed]});
    }}
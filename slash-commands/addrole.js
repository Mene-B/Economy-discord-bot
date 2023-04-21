const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

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
            if (!interaction.member.roles.cache.has(config.adminId)){
                const embed = new EmbedBuilder()
                .setAuthor({
                    name : interaction.member.nickname+ ":atm:" || interaction.user.username+ ":atm:",
                    iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
                })
                .setDescription("⛔ **Only Admins can add roles !** ⛔")
                .setColor("Red")


                return interaction.reply({embeds : [embed]})
            }
            if (string.match(/@everyone/g)?.length === 1){
                await interaction.guild.members.fetch();
                interaction.guild.members.cache.forEach(member => {
                    if (!member.user.bot){
                        member.roles.add(interaction.options.getRole("role").id)
                    }
                });
                const embed = new EmbedBuilder()
                .setAuthor({
                    name : "Admins",
                    iconURL : "https://i.goopics.net/ku6net.png"
                })
                .setDescription(`:white_check_mark: The **Admins** added a role to everyone ! :white_check_mark:\n\n**Role :** ${interaction.options.getRole("role")}`)

                return interaction.reply({embeds : [embed]})

            }
            if (mentions === null){
                return interaction.reply("Please mention members or everyone")
            }
            for( const mention of mentions) {
                const id = mention.slice(2).split('');
                id.pop();
                ids.push(id.join(''));
            };
            
            const embed = new EmbedBuilder()
            .setAuthor({
                name : "Admins",
                iconURL : "https://i.goopics.net/ku6net.png"
            })
            .setDescription(`:white_check_mark: The **Admins** decided to give a role to members ! :white_check_mark:\n\n**Role :** ${interaction.options.getRole("role")}\n**Members :** <@${ids.join("> :atm:, <@")}> :atm:`)
            .setColor("Green")


            await interaction.guild.members.fetch()
            ids.forEach(id => {
                interaction.guild.members.cache.get(id).roles.add(interaction.options.getRole("role").id);
            });
            return interaction.reply({embeds : [embed]});
            
    }}
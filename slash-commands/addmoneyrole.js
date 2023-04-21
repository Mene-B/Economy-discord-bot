const { SlashCommandBuilder , EmbedBuilder} = require('discord.js');
const { sendLogRole } = require('../util');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('addmoneyrole')
		.setDescription('Add money to all the people that have a specific role as an Admin')
        .addRoleOption(option => {
            return option
            .setName("role")
            .setDescription("Enter the role you want to add money to")
            .setRequired(true)
        })
        .addNumberOption(option => {
            return option
            .setName("quantity")
            .setDescription("Enter the amount of credits")
            .setRequired(true)
        }),
        run: async function (interaction,db) {
            if(!interaction.member.roles.cache.has("1097209275530608640")){
                const embed = new EmbedBuilder()
                .setAuthor({
                    name : interaction.member.nickname+ ":atm:" || interaction.user.username+ ":atm:",
                    iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
                })
                .setDescription("⛔ **Only Admins can add money to a role !** ⛔")
                .setColor("Red")

                interaction.reply({embeds : [embed]})
                return
            }
            await interaction.guild.members.fetch();
            interaction.guild.members.cache.forEach(member => {
                if (member.roles.cache.has(interaction.options.getRole("role").id)){
                    db.add(member.id, interaction.options.getNumber("quantity"))
                }
            });

            const embed = new EmbedBuilder()
            .setAuthor({
                name : "Admins",
                iconURL : "https://i.goopics.net/ku6net.png"
            })
            .setDescription(`:white_check_mark: The **Admins** decided to give credits to a role ! :white_check_mark:\n\n**Role :** ${interaction.options.getRole("role")}\n**Amount :** ${interaction.options.getNumber("quantity")} :dollar:`)   // You can modify the message here if you want to
            .setColor("Green")

            sendLogRole(interaction, interaction.options.getRole("role"), `${interaction.member}`,`${interaction.options.getNumber("quantity")}`, `${interaction.commandName} command`);
            interaction.reply({embeds : [embed]});
        }
    
    };
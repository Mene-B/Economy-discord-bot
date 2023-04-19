const { SlashCommandBuilder } = require('discord.js');
const { sendLog } = require('../util');

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
                interaction.reply("Only Admins can add money to a role !")
                return
            }
            await interaction.guild.members.fetch();
            await interaction.guild.members.cache.forEach(member => {
                if (member.roles.cache.has(interaction.options.getRole("role").id)){
                    db.add(member.id, interaction.options.getNumber("quantity"))
                }
            });
            sendLog(interaction, `${interaction.options.getNumber("quantity")} credits were given to the role ${interaction.options.getRole("role")} by ${interaction.member}`);
            interaction.reply("The credits have been added to the role");
        }
    
    };
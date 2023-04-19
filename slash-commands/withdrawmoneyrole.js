const {SlashCommandBuilder} = require("discord.js");
const { sendLog } = require("../util");

module.exports = {
    data : new SlashCommandBuilder()
    .setName("withdrawmoneyrole")
    .setDescription("Withdraw money to all the people that have a specific role as an Admin")
    .addRoleOption(option => {
        return option
        .setName("role")
        .setDescription("Enter the role you want to withdraw money from")
        .setRequired(true)
    })
    .addNumberOption(option=> {
        return option
        .setName("quantity")
        .setDescription("Enter the amount of credits")
        .setRequired(true)
    }),
    run : async function(interaction,db,config){
        const role = interaction.options.getRole("role");
        const quantity = interaction.options.getNumber("quantity");
        if (!interaction.member.roles.cache.has(config.adminId)){
            return interaction.reply("Only Admins can execute this command");
        }
        await interaction.guild.members.fetch();
        interaction.guild.members.cache.forEach(member => {
            if (member.roles.cache.has(role.id)){
                db.add(member.id, -quantity);
            }
        });
        sendLog(interaction, `${quantity} credits were withdrawn to the role ${role} by ${interaction.member}`);
        interaction.reply("The credits have been withdrawned to the role");
    }
}


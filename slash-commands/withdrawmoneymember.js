const {SlashCommandBuilder} = require("discord.js");
const {sendLog} = require("../util")

module.exports = {
    data : new SlashCommandBuilder()
    .setName("withdrawmoneymember")
    .setDescription("Withdraw money from a member's balance as an Admin")
    .addUserOption(option => {
        return option
        .setName("member")
        .setDescription("Enter the member")
        .setRequired(true)
    })
    .addNumberOption(option => {
        return option
        .setName("quantity")
        .setDescription("Enter the amount of money you want to withdraw from the member's balance")
        .setRequired(true)
    }),
    run : async function(interaction, db, config){
        if (!interaction.member.roles.cache.has(config.adminId)){
            return interaction.reply("Only Admins can withdraw money from someone's balance")
        }
        const member = interaction.options.getUser("member");
        const quantity = interaction.options.getNumber("quantity");
        db.set(member.id, Math.max(db.get(member.id) - quantity, 0));
        sendLog(interaction ,`${interaction.member} withdrew ${interaction.options.getNumber("quantity")} credits to ${interaction.options.getUser("member")}'s balance`);
        return interaction.reply("The money has been withdrawn !")
    }
}
const {SlashCommandBuilder} = require('discord.js');
const { sendLog } = require('../util');

module.exports = {
    data : new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Use this commanbd to pay someone")
    .addUserOption(option =>{
        return option
        .setName("member")
        .setDescription("Enter the member you want to give money to")
        .setRequired(true)
    })
    .addNumberOption(option => {
        return option
        .setName("quantity")
        .setDescription("Enter the amount you want to pay")
        .setRequired(true)
    }),
    run : async function (interaction,db,config){
        const memberPayed = interaction.options.getUser("member");
        const payerMember = interaction.member;
        const quantity = interaction.options.getNumber("quantity");
        if (quantity < 0){
            return interaction.reply("You can't pay a negative amount of money")
        }
        if (db.get(payerMember.id)<quantity){
            return interaction.reply("You don't have this amount of credits in your balance")
        }else if(memberPayed.id === payerMember.id){
            return interaction.reply("You can't pay yourself...")
        }else {
            db.add(payerMember.id, -quantity);
            db.add(memberPayed.id, quantity);
            sendLog(interaction , `${payerMember} paid ${quantity} credits to ${memberPayed}`);
            return interaction.reply(`You succesfully paid <@${memberPayed.id}> !`)
        }
    }
}
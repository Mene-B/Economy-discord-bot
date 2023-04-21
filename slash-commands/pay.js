const {SlashCommandBuilder,EmbedBuilder} = require('discord.js');
const { sendLogMember } = require('../util');

module.exports = {
    data : new SlashCommandBuilder()
    .setName("pay")   //You can modify the name of the command her eif you want 
    .setDescription("Use this command to pay someone")
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
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.member.nickname || interaction.user.username,
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription("⛔ **You can't pay a negative amount of money !** ⛔")
            .setColor("Red")

            return interaction.reply({embeds : [embed]})
        }
        if (db.get(payerMember.id)<quantity){
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.member.nickname || interaction.user.username,
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription("⛔ **You don't have this amount of credits in your balance** ⛔")
            .setColor("Red")

            return interaction.reply({embeds : [embed]})
        }else if(memberPayed.id === payerMember.id){
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.member.nickname || interaction.user.username,
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription("⛔ **You can't pay yourself** ⛔")
            .setColor("Red")

            return interaction.reply({embeds : [embed]})
        }else {
            db.add(payerMember.id, -quantity);
            db.add(memberPayed.id, quantity);

            const embed = new EmbedBuilder()
            .setAuthor({
                name : "Payment" ,
                iconURL : "https://i.goopics.net/ocqjqy.png"
            })
            .setFields(
                {name : "Payer member :" , value : `${payerMember} :atm:`, inline : false},
                {name : "Quantity :", value : `${quantity} :dollar:`, inline : false},
                {name : "Member payed :" , value : `${memberPayed} :atm:` , inline : false}
            )
            .setColor("Gold")

            sendLogMember(interaction , `${memberPayed}`, `${payerMember}`, `${quantity}`, interaction.commandName + " command");
            sendLogMember(interaction , `${payerMember}`, `${payerMember}`, `${-quantity}`, interaction.commandName + " command", true);
            return interaction.reply({embeds : [embed]})
        }
    }
}
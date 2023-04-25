const {SlashCommandBuilder,EmbedBuilder} = require('discord.js');
const { sendLogMember } = require('../util');

module.exports = {
    data : new SlashCommandBuilder()
    .setName("pay")   
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
        if(!db.has(memberPayed.id)){
            db.set(memberPayed.id,[0,0,[],[]])
        }
        if(!db.has(payerMember.id)){
            db.set(payerMember.id, [0,0,[],[]])
        }
        const invalidQuantity = quantity < 0;
        const lowBalance = db.get(payerMember.id)[0]<quantity;
        const sameTarget = memberPayed.id === payerMember.id;

        const error = invalidQuantity ? `⛔ **You can't pay a negative amount of money !** ⛔`
            : lowBalance ? `⛔ **You don't have this amount of credits in your balance** ⛔`    // You can modify the messages here if you want to
            : sameTarget ? `⛔ **You can't pay yourself** ⛔`
            : undefined;

        if (error){
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.member.nickname || interaction.user.username,
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription(error)
            .setColor("Red")

            return interaction.reply({embeds : [embed]})
        }
        let dataPayer = db.get(payerMember.id);
        let dataPayed = db.get(memberPayed.id);
        dataPayer[0]-=quantity;
        dataPayed[0]+=quantity;
        db.set(payerMember.id, dataPayer);
        db.set(memberPayed.id, dataPayed);

        const embed = new EmbedBuilder()
        .setAuthor({
            name : "Payment" ,
            iconURL : "https://i.goopics.net/ocqjqy.png"
        })
        .setFields(
            {name : "Payer member :" , value : `${payerMember} :atm:`, inline : false},    
            {name : "Quantity :", value : `${quantity} :dollar:`, inline : false},           // You can modify the message here if you want to
            {name : "Member payed :" , value : `${memberPayed} :atm:` , inline : false}
        )
        .setColor("Gold")

        sendLogMember(interaction , `${memberPayed}`, `${payerMember}`, `${quantity}`, interaction.commandName + " command");
        sendLogMember(interaction , `${payerMember}`, `${payerMember}`, `${-quantity}`, interaction.commandName + " command", true);
        return interaction.reply({embeds : [embed]})
    }
}
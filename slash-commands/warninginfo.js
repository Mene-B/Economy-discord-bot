const {SlashCommandBuilder,EmbedBuilder} = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName("warninginfo")
    .setDescription("Get the informations about the warnings that one member has")
    .addUserOption(option =>{
        return option
        .setName("member")
        .setDescription("Enter the member on which you want the informations")
        .setRequired(false)
    }),
    run : async function (interaction,db){
        await interaction.deferReply();
        const member  = interaction.options.getUser("member") || interaction.member;
        if(!db.has(member.id)){
            db.set(member.id, [0,0,[],[]])
        }
        const datas = db.get(member.id);
        const warnings = datas[1];
        const reasons = datas[2];
        const actionners = datas[3];
        const text = (reasons.length > 0) ? "\n\n**Reasons :** " + reasons.map((reason,index)=>{
            return `\n**${index+1}.** ${reason} • **Given by** <@${actionners[index]}>`
        }).join("") : "";
        const embed = new EmbedBuilder()
        .setAuthor({
            name: member.nickname || member.username || member.user.username,
            iconURL: "https://i.goopics.net/mksbjm.png"
        })
        .setDescription(`**This member now has ${warnings} warnings**${text}`)
        .setColor("DarkGold")
        
        interaction.followUp({embeds : [embed]})
    }
}
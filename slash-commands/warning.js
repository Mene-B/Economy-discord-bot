const {SlashCommandBuilder,EmbedBuilder} = require("discord.js");


module.exports = {
    data : new SlashCommandBuilder()
    .setName("warning")
    .setDescription("Give a warning to a member as an Admin")
    .addUserOption(option =>{
        return option
        .setName("member")
        .setDescription("Enetr the member you want to give a warning to")
        .setRequired(true)
    })
    .addStringOption(option=>{
        return option
        .setName("reason")
        .setDescription("Enter the reason of the warning")
        .setRequired(true)
    }),
    run : function (interaction, db){
        const admin = interaction.member;
        let roles = [];
        for (const role of admin.roles.cache){
            roles.push(role[0]);
        }
        roles = roles.map(role => {
            return interaction.guild.roles.cache.get(role).permissions.has("0x0000000000000008");
        })
        if(!roles.includes(true)){
            const embed = new EmbedBuilder()
            .setAuthor({
                name : (interaction.member.nickname || interaction.user.username),
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription("⛔ **Only Admins can give warnings to people !** ⛔")     // You can modify the message here if you want to
            .setColor("Red")

            return interaction.reply({embeds : [embed]});
        }
        const memberWarned = interaction.options.getUser("member");
        const reason = interaction.options.getString("reason");
        if(!db.has(memberWarned.id)){
            db.set(memberWarned.id, [0,0,[],[]]);
        }
        let data = db.get(memberWarned.id);
        data[1]+=1;
        data[2].push(reason);
        data[3].push(admin.id);
        db.set(memberWarned.id, data);
        const embed =new EmbedBuilder()
        .setAuthor({
            name : "Admins",
            iconURL : "https://i.goopics.net/mksbjm.png"
        })
        .setDescription(`:warning: The **Admins** just gave you a warning ! :warning:\n**Member :** ${memberWarned}\n**Reason :** ${reason}`)

        interaction.reply({embeds : [embed]})
        
    }
}
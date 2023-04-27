const {SlashCommandBuilder,EmbedBuilder} =require("discord.js");
const {sendLogWarningRemove}=require("../util.js")

module.exports = {
    data : new SlashCommandBuilder()
    .setName("warningremove")
    .setDescription("Use this command to remove a specific warning from a member")
    .addNumberOption(option => {
        return option
        .setName("number")
        .setDescription("Enter the number of the warning that you want to remove")
        .setRequired(true)
    })
    .addUserOption(option=> {
        return option
        .setName("member")
        .setDescription("Enter the member that you want to remove the warning from")
        .setRequired(true)
    }),
    run : async function (interaction,db){
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
            .setDescription("⛔ **Only Admins can remove warnings from people !** ⛔")     // You can modify the message here if you want to
            .setColor("Red")

            return interaction.reply({embeds : [embed]});
        }
        const user = interaction.options.getUser("member");
        const index = interaction.options.getNumber("number")-1;
        
        if(!db.has(user.id)){
            db.set([0,0,[],[]])
        }
        const datas = db.get(user.id);
        if(index <0 || index+1 >datas[1]){
            return interaction.reply('Please enter a warning number that exists for this member')
        }
        datas[1]-=1;
        const reasons = datas[2];
        const actionners = datas[3];
        const reason = reasons.splice(index,1);
        const actionner = actionners.splice(index,1)
        datas[2]=reasons;
        datas[3]=actionners;
        db.set(user.id,datas);
        await interaction.guild.members.fetch();
        const embed = new EmbedBuilder()
        .setAuthor({
            name : interaction.guild.members.cache.get(user.id).nickname||user.username,
            iconURL: "https://i.goopics.net/ku6net.png"
        })
        .setDescription(`The **Admins** decided to remove one of your warnings\n**Warning reason :** ${reason}\n**Actionned by :** <@${actionner}>`)
        .setColor("Green")

        sendLogWarningRemove(interaction,user,interaction.user,0,reason,actionner);

        interaction.reply({embeds : [embed]})
    }
}
const {SlashCommandBuilder,EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warningremoveall")
    .setDescription("Removes all the warning of the specified member")
    .addUserOption(option => {
        return option
        .setName("member")
        .setDescription("Enter the member that you want to remove the warnings from")
        .setRequired(true)
    }),
    run: async function(interaction,db){
        const user = interaction.options.getUser("member");
        const actionner = interaction.user;
        await interaction.guild.members.fetch();
        const roles = interaction.guild.members.cache.get(actionner.id).roles.cache
        const check = roles.map(role => {
            return interaction.guild.roles.cache.get(role.id).permissions.has("0x0000000000000008")
        });
        if(!check.includes(true)){
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.guild.members.cache.get(actionner.id).nickname || actionner.username,
                iconURL: "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription(`⛔ **Only Admins can remove warnings from people !** ⛔`)
            .setColor("Red")

            return interaction.reply({embeds : [embed]})
        }
        if(!db.has(user.id)){
            db.set(user.id,[0,0,[],[]])
        }
        const datas = db.get(user.id);
        datas[1] =0;
        datas[2]=[];
        datas[3]=[];
        db.set(user.id,datas);
        const embed = new EmbedBuilder()
        .setAuthor({
            name : interaction.guild.members.cache.get(user.id).nickname||user.username,
            iconURL: "https://i.goopics.net/ku6net.png"
        })
        .setDescription(`The **Admins** decided to remove **all** of your warnings !`)
        .setColor("Green")

        interaction.reply({embeds : [embed]})
    }
}
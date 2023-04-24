const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {sendLogMember} = require("../util")

module.exports = {
    data : new SlashCommandBuilder()
    .setName("withdrawmoneymember")
    .setDescription("Withdraw money from a member as an Admin")
    .addUserOption(option => {
        return option
        .setName("member")
        .setDescription("Enter the member")
        .setRequired(true)
    })
    .addNumberOption(option => {
        return option
        .setName("quantity")
        .setDescription("Enter the amount of credits")
        .setRequired(true)
    }),
    run : async function(interaction, db, config){
        const roles = []
        for (const role of interaction.member.roles.cache){
            roles.push(role[0]);
        }
        const admin = roles.map(role => {
            return interaction.guild.roles.cache.get(role).permissions.has("0x0000000000000008")
        })
        if (!admin.includes(true)){
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.member.nickname + ":atm:"|| interaction.user.username+ ":atm:",
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription("⛔ **Only Admins can withdraw money !** ⛔")   // You can modify the message here if you want to
            .setColor("Red")
            return interaction.reply({embeds : [embed]})
        }
        const member = interaction.options.getUser("member");
        const quantity = interaction.options.getNumber("quantity");
        const embed = new EmbedBuilder()
        .setAuthor({
            name : "Admins",
            iconURL : "https://i.goopics.net/lxdlsh.png"
        })
        .setDescription(`:negative_squared_cross_mark: The **Admins** decided to withdraw credits from your balance ! :negative_squared_cross_mark:\n\n**Member :** ${interaction.options.getUser("member")} :atm:\n**Amount :** ${interaction.options.getNumber("quantity")} :dollar:`)   // You can modify the message here if you want to
        .setColor("Green")

        db.set(member.id, Math.max(db.get(member.id) - quantity, 0));
        sendLogMember(interaction , `${interaction.options.getUser("member")}`, `${interaction.member}`, `${-interaction.options.getNumber("quantity")}`, interaction.commandName + " command", true);
        return interaction.reply({embeds : [embed]})
    }
}
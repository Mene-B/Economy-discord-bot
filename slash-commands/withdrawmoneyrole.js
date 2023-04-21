const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const { sendLogRole } = require("../util");

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
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.member.nickname + ":atm:"|| interaction.user.username+ ":atm:",
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription("⛔ **Only Admins can withdraw money from a role !** ⛔")     // You can modify the message here if you want to
            .setColor("Red")

            return interaction.reply({embeds : [embed]});
        }
        await interaction.guild.members.fetch();
        interaction.guild.members.cache.forEach(member => {
            if (member.roles.cache.has(role.id)){
                db.add(member.id, -quantity);
            }
        });
        const embed = new EmbedBuilder()
        .setAuthor({
            name : "Admins",
            iconURL : "https://i.goopics.net/lxdlsh.png"
        })
        .setDescription(`:negative_squared_cross_mark: The **Admins** decided to withdraw credits from a role ! :negative_squared_cross_mark:\n\n**Role :** ${interaction.options.getRole("role")}\n**Amount :** ${interaction.options.getNumber("quantity")} :dollar:`)  // You can modify the message here if you want to
        .setColor("Green")

        sendLogRole(interaction, interaction.options.getRole("role"), `${interaction.member}`,`${-interaction.options.getNumber("quantity")}`, `${interaction.commandName} command`, true);
        interaction.reply({embeds : [embed]});
    }
}


const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const {sendLogMember} = require("../util");
const config = require("../config.json")

module.exports = {

    data: new SlashCommandBuilder()
		.setName('addmoneymember')
		.setDescription('Add credits to a member as an Admin')
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

    run: async function (interaction,db) {
        if(!interaction.member.roles.cache.has(config.adminId)){
            const embed = new EmbedBuilder()
            .setAuthor({
                name : interaction.member.nickname + ":atm:"|| interaction.user.username+ ":atm:",
                iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
            })
            .setDescription("⛔ **Only Admins can add money !** ⛔")
            .setColor("Red")


            interaction.reply({embeds : [embed]})
            return
        }
        const user = interaction.options.getUser('member').id;
        const embed = new EmbedBuilder()
        .setAuthor({
            name : "Admins",
            iconURL : "https://i.goopics.net/ku6net.png"
        })
        .setDescription(`:white_check_mark: The **Admins** decided to give you credits ! :white_check_mark:\n\n**Member :** ${interaction.options.getUser("member")} :atm:\n**Amount :** ${interaction.options.getNumber("quantity")} :dollar:`)
        .setColor("Green")


        if (!db.has(user)){
            db.set(user,0)
        }
        db.add(user, interaction.options.getNumber("quantity"))
        sendLogMember(interaction , `${interaction.options.getUser("member")}`, `${interaction.member}`, `${interaction.options.getNumber("quantity")}`, interaction.commandName + " command");
		return interaction.reply({embeds : [embed]});
	}

};

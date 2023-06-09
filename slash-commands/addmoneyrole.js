const { SlashCommandBuilder , EmbedBuilder} = require('discord.js');
const { sendLogRole } = require('../util');

module.exports = {

    data: new SlashCommandBuilder()
		.setName('addmoneyrole')
		.setDescription('Add money to all the people that have a specific role as an Admin')
        .addRoleOption(option => {
            return option
            .setName("role")
            .setDescription("Enter the role you want to add money to")
            .setRequired(true)
        })
        .addNumberOption(option => {
            return option
            .setName("quantity")
            .setDescription("Enter the amount of credits")
            .setRequired(true)
        }),
        run: async function (interaction,db) {
            const roles = []
            for (const role of interaction.member.roles.cache){
                roles.push(role[0]);
            }
            const admin = roles.map(role => {
                return interaction.guild.roles.cache.get(role).permissions.has("0x0000000000000008")
            })
            if(!admin.includes(true)){
                const embed = new EmbedBuilder()
                .setAuthor({
                    name : interaction.member.nickname || interaction.user.username,
                    iconURL : "https://images.emojiterra.com/twitter/v14.0/1024px/26d4.png"
                })
                .setDescription("⛔ **Only Admins can add money to a role !** ⛔")
                .setColor("Red")

                interaction.reply({embeds : [embed]})
                return
            }
            await interaction.guild.members.fetch();
            interaction.guild.members.cache.forEach(member => {
                if (member.roles.cache.has(interaction.options.getRole("role").id)){
                    if (!db.has(member.id)){
                        db.set(member.id, [0,0,[],[]])
                    }
                    let data = db.get(member.id);
                    data[0]+=interaction.options.getNumber("quantity");
                    db.set(member.id,data);
                }
            });

            const embed = new EmbedBuilder()
            .setAuthor({
                name : "Admins",
                iconURL : "https://i.goopics.net/ku6net.png"
            })
            .setDescription(`:white_check_mark: The **Admins** decided to give credits to a role ! :white_check_mark:\n\n**Role :** ${interaction.options.getRole("role")}\n**Amount :** ${interaction.options.getNumber("quantity")} :dollar:`)   // You can modify the message here if you want to
            .setColor("Green")

            sendLogRole(interaction, interaction.options.getRole("role"), `${interaction.member}`,`${interaction.options.getNumber("quantity")}`, `${interaction.commandName} command`);
            interaction.reply({embeds : [embed]});
        }
    
    };
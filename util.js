const config = require("./config.json");
const {EmbedBuilder} = require("discord.js")

module.exports = {
    sendLogMember : (interaction, member, actionner, quantity, reason, negative) => {
        const embed = new EmbedBuilder()
        .setAuthor({
            name : "Balance updated"
        })
        .setDescription(`**Member :** ${member} :atm:\n**Actionned by :** ${actionner} :atm:\n**Amount :** ${quantity} :dollar:\n**Reason :** ${reason}`)
        .setColor("Green")

        if (negative){embed.setColor("Red")}
        interaction.guild.channels.cache.get(config.logsId).send({embeds : [embed]})
    },
    createLeaders : function(leaders){
        const pages = [[]];
        for (const user of leaders){
            if(pages.at(-1).length === 10){
                pages.push([]);
            }
            pages.at(-1).push(user);
        }
        return pages;
    },
    sendLogRole : async function(interaction,role,actionner,quantity,reason,negative){
        let counter = 0;
        await interaction.guild.members.fetch();
        const members = interaction.guild.roles.cache.get(role.id).members.size;

        

        const embed = new EmbedBuilder()
        .setAuthor({
            name : "Balances updated"
        })
        .setDescription(`**Role :** ${role} (${members} members)\n**Actioned by :** ${actionner} :atm:\n**Amount :** ${quantity} :dollar:\n**Reason :** ${reason}`)
        .setColor("Green")

        if (negative){embed.setColor("Red")}
        interaction.guild.channels.cache.get(config.logsId).send({embeds : [embed]})
    }
}
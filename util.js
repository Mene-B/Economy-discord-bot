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
    },
    sendLogWarningRemove : function(interaction,member,actionnerCommand,number,reason,actionnerWarning){
        const embed = new EmbedBuilder()
        .setAuthor({
            name: "Warning Remove update"
        })
        .setDescription(`**Member :** ${member}\n**Reason of the warning :** ${reason}\n**Given by :** <@${actionnerWarning}>\n**/removearning command actionner :** ${actionnerCommand}`)
        .setColor("Yellow")

        if (interaction.commandName === "warningremoveall"){
            embed
            .setDescription(`**Member :** ${member}\n**All the warnings of this member** (${number})\n**/warningremoveall command actionner :** ${actionnerCommand}`)
        }

        return interaction.guild.channels.cache.get(config.logsId).send({embeds : [embed]})
    },
    sendLogWarning : function(interaction,member, reason, actionner){
        const embed = new EmbedBuilder()
        .setAuthor({name : "Warning update"})
        .setDescription(`**Member warned :** ${member}\n**Reason of the warning :** ${reason}\n**Given by :** ${actionner}`)
        .setColor('Yellow')

        return interaction.guild.channels.cache.get(config.logsId).send({embeds : [embed]})
    }
}
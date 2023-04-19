const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {createLeaders} = require("../util")
module.exports = {
    data : new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Get the leader board of the 15 richest people in the guil, and your rank"),
    run : async function(interaction, db , config){
        const datas = db.all().sort((a,b) => b.data-a.data);
        let page = 0;
        const pages = createLeaders(datas);
        const pagesNumber = pages.length;
        interaction.guild.members.fetch();
        const personalRank = datas.findIndex(element => {
            return element.key === interaction.user.id
        })+1;
        const pagesEmbed = pages.map((page, index) => {
            return new EmbedBuilder()
            .setAuthor({
                name : interaction.client.user.username,
                iconURL : interaction.client.user.displayAvatarURL()
            })
            .setColor("Blue")
            .setDescription(
                page.map((user, i)=>{
                    return `**${(index)*10 + i+1}.** ${interaction.guild.members.cache.get(user.key)} ==> ${user.data} 💰 `
                }).join('\n')
            )
            .setFooter({text : `Your rank : ${personalRank}\n\nPage ${index+1}/${pagesNumber}`})
        })
        interaction.reply({
            embeds : [pagesEmbed[page]]
        })

    }
    
}
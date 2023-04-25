const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder,ButtonStyle, ActionRowBuilder} = require("discord.js");
const {createLeaders} = require("../util")
module.exports = {
    data : new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Get the leader board of the guild"),
    run : async function(interaction, db , config){
        await interaction.deferReply();
        const datas = db.all().sort((a,b) => b.data-a.data);
        let page = 1;
        const pages = createLeaders(datas);
        const pagesNumber = pages.length;
        interaction.guild.members.fetch();
        const personalRank = datas.findIndex(element => {
            return element.key === interaction.user.id
        })+1;
        await interaction.guild.members.fetch();
        const pagesEmbed = pages.map((page, index) => {
            return new EmbedBuilder()
            .setAuthor({
                name : interaction.client.user.username,
                iconURL : interaction.client.user.displayAvatarURL()
            })
            .setColor("Blue")
            .setDescription(
                "**Guild's Leaderboard**\n\n" +
                page.map((user, i)=>{
                    return `**${(index)*10 + i+1}.** ${interaction.guild.members.cache.get(user.key)} :atm: • ${user.data[0]} :dollar: `
                }).join('\n')
            )
            .setFooter({text : `Page ${index+1}/${pagesNumber}  •  Your rank : ${personalRank}`})
        })
        const previousButton = new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous page")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)

        const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next page")
        .setStyle(ButtonStyle.Secondary)

        if (pagesNumber === 1){
            nextButton.setDisabled(true);
        }else{
            nextButton.setDisabled(false)
        }

        const row = new ActionRowBuilder()
        .addComponents([previousButton,nextButton])


        const interactionReply = await interaction.followUp({
            embeds : [pagesEmbed[page-1]],
            components : [row]
        })

        const collector = interactionReply.createMessageComponentCollector({
            filter : () => true,
            time : 60000
        })

        collector.on("collect",(newInteraction)=>{
            if (newInteraction.member.id !== interaction.member.id){
                return newInteraction.reply("Only the user that entered the command can navigate in the leaderboard");
            }
            if (newInteraction.customId === "previous"){
                if (page === 2 ){
                    newInteraction.message.components[0].components[0].data.disabled = true;
                }
                if (newInteraction.message.components[0].components[1].data.disabled === true){
                    newInteraction.message.components[0].components[1].data.disabled = false;
                }
                page --;
                newInteraction.message.edit({
                    embeds : [pagesEmbed[page-1]],
                    components : newInteraction.message.components
                })
            }

            if (newInteraction.customId === "next"){
                if (page === pagesNumber - 1){
                    newInteraction.message.components[0].components[1].data.disabled = true;
                }
                if (newInteraction.message.components[0].components[0].data.disabled === true){
                    newInteraction.message.components[0].components[0].data.disabled = false;
                }
                page ++;
                console.log(page)
                newInteraction.message.edit({
                    embeds : [pagesEmbed[page-1]],
                    components : newInteraction.message.components
                })
            }





            newInteraction.deferUpdate()
        })
    }
    
}
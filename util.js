const config = require("./config.json");

module.exports = {
    sendLog : (interaction, message) => {
        interaction.client.guilds.cache.get(config.guildId).channels.cache.get(config.logsId).send(message)
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
    }
}
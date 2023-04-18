const config = require("./config.json");

module.exports.sendLog = (interaction, message) => {
    interaction.client.guilds.cache.get(config.guildId).channels.cache.get(config.logsId).send(message)
}
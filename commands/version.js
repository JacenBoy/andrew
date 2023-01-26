// Display the current version of the bot.

exports.run = async (client, roomId, args) => {
  client.sendText(roomId, `Andrew version ${require("../package.json").version}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ver','v'],
  permLevel: "User"
};

exports.help = {
  name: "version",
  category: "System",
  description: "Get the current version of the bot.",
  usage: "version"
};
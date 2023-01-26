// Display the current version of the bot.

exports.run = async (client, roomId, args) => {
  await client.sendText(roomId, "The bot is shutting down");
  await Promise.all(client.commands.map(cmd =>
    client.unloadCommand(cmd)
  ));
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["stop", "shutdown", "restart"],
  permLevel: "Support"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot"
};
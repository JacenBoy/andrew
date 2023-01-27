/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/

exports.run = async (client, roomId, args) => {
  if (!args[0]) {
    // General help
    client.sendText(roomId, "You can find a complete list of commands at https://github.com/JacenBoy/andrew/wiki/Commands");
  } else {
    // Show individual command's help.
    if (client.commands.has(args[0])) {
      const cmd = client.commands.get(args[0]);
      const embed = {
        title: `${client.config.prefix}${cmd.help.name}`,
        body: `${cmd.help.description}<br /><b>Usage:</b> ${cmd.help.usage}`,
      };
      client.sendHtmlText(roomId, client.genEmbed(embed));
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help"
};
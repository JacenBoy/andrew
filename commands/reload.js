// Reload a modified command

exports.run = async (client, roomId, args) => {
  await client.sendText(roomId, "Reloading commands");
  args.forEach(async (cmd) => {
    const command = client.commands.get(cmd);
    
    let response = await client.unloadCommand(command.help.name);
    if (response) return client.sendText(roomId, `Error Unloading: ${response}`);

    response = client.loadCommand(command.help.name);
    if (response) return client.sendText(roomId, `Error Loading: ${response}`);

    await client.sendText(roomId, `The command \`${command.help.name}\` has been reloaded`);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Admin"
};

exports.help = {
  name: "reload",
  category: "System",
  description: "Reloads a command that's been modified.",
  usage: "reload [command]"
};
const {Collection} = require("@discordjs/collection");
const {MatrixClient, SimpleFsStorageProvider, RustSdkCryptoStorageProvider} = require("matrix-bot-sdk");

class Andrew extends MatrixClient {
  constructor (config) {
    // Pass paremeters from the config to the MatrixClient class
    super(config.homeserver, config.accessToken, new SimpleFsStorageProvider(config.storagePath), new RustSdkCryptoStorageProvider(config.cryptoPath));

    // Load the config file into our modified class
    this.config = config;

    // discord.js has a cool Collections utility that we're going to use to store things like events and commands
    this.commands = new Collection();
    this.aliases = new Collection();

    // Require the logger module for persistent logging
    this.logger = require("../modules/Logger.js");

    // We'll use promisify around setTimeout in order to simulate "sleep" functionality
    this.wait = require("util").promisify(setTimeout);
  }

  // Add our functions for command loading and reloading

  loadCommand (commandName) {
    try {
      this.logger.log(`Loading Command: ${commandName.split(".")[0]}`);
      const props = require(`../commands/${commandName}`);
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand (commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  }

  //PERMISSION LEVEL FUNCTION
  // Uses a switch/case and fallthroughs to identify the correct permissions
  checkPermissions (permLevel, userId) {
    switch (permLevel) {
      case "User":
        // Always return true for the user check
        return true;
      case "Support":
        // Check if the user is in the support list
        if (this.config.support.includes(userId)) return true;
      case "Admin":
        // Check if the user is in the admins list
        if (this.config.admins.includes(userId)) return true;
      case "Owner":
        // Check if the user is the bot owner
        if (this.config.ownerID == userId) return true;
      default:
        // If we've fallen through this far, the user does not have the correct permissions
        return false;
    }
  }

  // We'll add some useful utility functions to our modified client class

  // randInt - generates a random integer.
  randInt (min, max) {
    return Math.floor(Math.random() * (+max - +min)) + +min;
  }

  // cleanSyn - clean and shorten a synopsis to under 512 characters
  cleanSyn (synin) {
    if (!synin) {
      return "No synopsis provided";
    }
    if (! /\S/.test(synin)) {
      return "No synopsis provided";
    }
    synin = synin.replace(/(<p>)?(<\/p>)?(<a.*>)?(<\/a>)?/g, "");
    if (synin.length >= 512) {
      return synin.substring(0, synin.lastIndexOf(" ", 502)) + "... (more)";
    }
    return synin;
  }

  // pad - Zero pad a number
  pad (n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}

module.exports = Andrew;
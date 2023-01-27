// Search Kitsu for multiple anime
const kitsu = require("node-kitsu");

exports.run = async (client, roomId, args) => {
  const aniname = args.join(" ");
  if (!aniname) return client.sendText(roomId, "Please specify an anime name.");

  let results;
  try {
    client.logger.debug(`Search started for search term "${aniname}"`);
    results = await kitsu.searchAnime(aniname, 0);
  }
  catch (ex) {
    client.logger.error(`${ex}`);
    return client.sendText(roomId, "An error occurred running this command");
  }
  if (!results || !results[0]) {
    client.sendText(roomId, "No results found");
    client.logger.warn(`No anime found for the search term "${aniname}"`);
  }

  const fieldarray = [];
  for (let i = 0; i < results.length; i++) {
    const aniresult = results[i].attributes;
    fieldarray[i] = {
      "name": aniresult.titles.en || aniresult.canonicalTitle || aniresult.titles.en_jp,
      "value": `Rating: ${aniresult.averageRating || 0}%<br />Episodes: ${aniresult.episodeCount || 0}<br />Status: ${aniresult.status == "tba" ? "TBA" : `${aniresult.status.toProperCase()}`}>br /><a href="https://kitsu.io/anime/${aniresult.slug}">Kitsu.io</a>`
    };
  }

  const embed = {
    "title": "Search Results",
    "body": "",
    "fields": fieldarray
  };
  await client.sendHtmlText(roomId, client.genEmbed(embed));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["anisearch", "as"],
  permLevel: "User"
};

exports.help = {
  name: "animesearch",
  category: "Kitsu",
  description: "List the top ten results for an anime.",
  usage: "animesearch [name]"
};
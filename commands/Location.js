const { keith } = require('../keizzah/keith');

keith({
  nomCom: "location",
  desc: "get user location",
  categorie: "tools",
  reaction: "📍"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, auteurMsgRepondu, nomAuteurMessage } = commandeOptions;

  // If user is replying to someone
  if (auteurMsgRepondu) {
    try {
      const contextInfo = ms.message?.extendedTextMessage?.contextInfo;
      if (contextInfo?.quotedMessage?.locationMessage) {
        const loc = contextInfo.quotedMessage.locationMessage;
        const latitude = loc.degreesLatitude;
        const longitude = loc.degreesLongitude;
        const name = nomAuteurMessage || "This user";
        
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        return await repondre(
          `📍 ${name}'s Location:\n` +
          `Latitude: ${latitude}\n` +
          `Longitude: ${longitude}\n` +
          `Google Maps: ${googleMapsLink}`
        );
      }
    } catch (error) {
      console.error(error);
    }
    return await repondre("The message you're replying to doesn't contain a location.");
  }
  
  // If user is sharing their own location
  if (ms.message.locationMessage) {
    const loc = ms.message.locationMessage;
    const latitude = loc.degreesLatitude;
    const longitude = loc.degreesLongitude;
    
    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    return await repondre(
      `📍 Your Location:\n` +
      `Latitude: ${latitude}\n` +
      `Longitude: ${longitude}\n` +
      `Google Maps: ${googleMapsLink}`
    );
  }

  // If no location found
  await repondre(
    "To use this command:\n" +
    "1. Share your location directly\n" +
    "OR\n" +
    "2. Reply to someone's location message\n" +
    "Note: You can only see locations that users have actively shared."
  );
});

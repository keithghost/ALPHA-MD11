const { keith } = require('../keizzah/keith');
var gis = require('g-i-s');
const { generateWAMessageContent, generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys').default;

keith({
  nomCom: "img2",
  categorie: "Search",
  reaction: "📷"
},
async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Which image are you looking for?');
    return;
  }

  const searchTerm = arg.join(" ");
  
  // Search for images
  gis(searchTerm, async (error, results) => {
    if (error) {
      repondre("Oops, an error occurred while searching for images!");
      return;
    }
    
    if (!results || results.length === 0) {
      repondre("No images found for your search term!");
      return;
    }
    
    // Limit to 5 results
    const imageResults = results.slice(0, 5);
    
    // Create carousel cards
    const push = [];
    let i = 1;
    
    for (const image of imageResults) {
      try {
        push.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `📷 Image ${i} of ${imageResults.length}`
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: 'Swipe to view more results'
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: '',
            hasMediaAttachment: true,
            imageMessage: await createImageMessage(zk, image.url)
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                "name": "cta_copy",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Copy Image URL",
                  "copy_code": image.url
                })
              },
              {
                "name": "cta_url",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Open in Browser",
                  "url": image.url
                })
              }
            ]
          })
        });
        i++;
      } catch (e) {
        console.error("Error processing image:", e);
      }
    }
    
    // Create the carousel message
    const bot = generateWAMessageFromContent(dest, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `*🔍 Image Search Results for:* ${searchTerm}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: 'Swipe to view more results'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: push
            })
          })
        }
      }
    }, {
      quoted: ms
    });
    
    // Send the message
    await zk.relayMessage(dest, bot.message, { messageId: bot.key.id });
  });
});

async function createImageMessage(zk, imageUrl) {
  const { imageMessage } = await generateWAMessageContent({
    image: { url: imageUrl }
  }, {
    upload: zk.waUploadToServer
  });
  return imageMessage;
}

const { keith } = require("../keizzah/keith");
const { getAllConversations, getUserConversations } = require("../database/gptmemory");

keith({
    nomCom: "gpthistory",
    categorie: "AI",
    reaction: "📜",
    description: "View GPT conversation history"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser, auteurMessage } = commandeOptions;
    const isOwner = superUser;
    const targetUser = arg[0]?.includes('@') ? arg[0] : null;

    try {
        if (targetUser && isOwner) {
            // Owner viewing specific user's history
            const conversations = await getUserConversations(targetUser, 10);
            if (conversations.length === 0) {
                return repondre(`No conversation history found for ${targetUser}`);
            }

            let message = `📜 *GPT History for @${targetUser.split('@')[0]}*\n\n`;
            conversations.forEach((conv, index) => {
                const lastMessage = conv.history.slice(-1)[0];
                message += `${index+1}. ${new Date(conv.lastUpdated).toLocaleString()}\n`;
                message += `   Last: ${lastMessage.content.substring(0, 30)}${lastMessage.content.length > 30 ? '...' : ''}\n`;
                message += `   Messages: ${conv.history.length}\n\n`;
            });

            return repondre(message, { mentions: [targetUser] });

        } else if (isOwner) {
            // Owner viewing all conversations
            const allConversations = await getAllConversations(15);
            if (allConversations.length === 0) {
                return repondre("No conversation history found");
            }

            let message = "📜 *All GPT Conversations*\n\n";
            allConversations.forEach((conv, index) => {
                message += `${index+1}. @${conv.jid.split('@')[0]}\n`;
                message += `   Last: ${new Date(conv.lastUpdated).toLocaleString()}\n`;
                message += `   Messages: ${conv.history.length}\n\n`;
            });

            return repondre(message);

        } else {
            // Regular user viewing their own history
            const conversations = await getUserConversations(auteurMessage, 5);
            if (conversations.length === 0) {
                return repondre("You have no conversation history");
            }

            let message = "📜 *Your Recent GPT Conversations*\n\n";
            conversations.forEach((conv, index) => {
                const lastMessage = conv.history.slice(-1)[0];
                message += `${index+1}. ${new Date(conv.lastUpdated).toLocaleString()}\n`;
                message += `   Last: ${lastMessage.content.substring(0, 40)}${lastMessage.content.length > 40 ? '...' : ''}\n\n`;
            });

            return repondre(message);
        }
    } catch (error) {
        console.error("History command error:", error);
        return repondre("❌ Failed to retrieve history" + error );
    }
});

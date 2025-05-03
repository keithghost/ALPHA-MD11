const { keith } = require("../keizzah/keith");
const axios = require('axios');
const { 
    saveConversation, 
    getConversation,
    clearConversation
} = require('../database/gptmemory');

keith({
    nomCom: "gp",
    aliases: ["gpt4", "ai"],
    reaction: '⚔️',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, auteurMessage, repondre } = commandeOptions;
    const query = arg.join(" ").trim();

    if (!query) return repondre("Please provide a message.");

    // Generate unique conversation ID (user jid + timestamp)
    const conversationId = `${auteurMessage}_${Date.now()}`;
    
    try {
        // Get previous conversation history if exists
        let conversationHistory = await getConversation(auteurMessage);
        
        // Add new user message to history
        conversationHistory.push({
            role: "user",
            content: query,
            timestamp: new Date()
        });

        // Prepare API payload with context
        const payload = {
            messages: conversationHistory,
            new_message: query
        };

        const response = await axios.post(
            "https://apis-keith.vercel.app/ai/deepseek",
            payload,
            { timeout: 15000 }
        );

        if (response.data?.status && response.data?.result) {
            const aiResponse = response.data.result;
            
            // Add AI response to history
            conversationHistory.push({
                role: "assistant",
                content: aiResponse,
                timestamp: new Date()
            });

            // Save updated conversation
            await saveConversation(auteurMessage, conversationId, conversationHistory);

            // Send response with context
            await zk.sendMessage(dest, {
                text: aiResponse,
                contextInfo: {
                    externalAdReply: {
                        title: "ALPHA-MD GPT",
                        body: `Context-aware response | Memory: ${conversationHistory.length} messages`,
                        thumbnailUrl: "https://files.catbox.moe/palnd8.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                        mediaType: 1,
                        showAdAttribution: true,
                    },
                },
            });

        } else {
            repondre("Failed to get a valid response from the AI.");
        }
    } catch (error) {
        console.error("GPT Error:", error); 
        repondre(error.response?.data?.message || "Sorry, I encountered an error." + error );
    }
});

// Additional command to manage memory
keith({
    nomCom: "gptclear",
    categorie: "AI",
    reaction: "🧹"
}, async (dest, zk, commandeOptions) => {
    const { auteurMessage, repondre } = commandeOptions;
    
    try {
        const success = await clearConversation(auteurMessage);
        repondre(success ? 
            "✅ Your conversation history has been cleared" :
            "❌ No conversation history found"
        );
    } catch (error) {
        console.error("Clear memory error:", error);
        repondre("❌ Failed to clear memory");
    }
});

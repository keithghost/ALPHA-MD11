const { keith } = require('../keizzah/keith');
const { updatePresenceSettings } = require('../database/presence');

keith({
    nomCom: 'offline',
    categorie: 'Utils',
    reaction: '🔴'
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner only command');

    await updatePresenceSettings({ 
        isActive: false 
    });
    repondre('✅ Bot is now offline');
});

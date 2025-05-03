const { keith } = require('../keizzah/keith');
const { updatePresenceSettings } = require('../database/presence');

keith({
    nomCom: 'online',
    categorie: 'Utils',
    reaction: '🟢'
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner only command');

    await updatePresenceSettings({ 
        status: 'available', 
        isActive: true 
    });
    repondre('✅ Bot is now online (available)');
});

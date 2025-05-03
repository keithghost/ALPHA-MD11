const { keith } = require('../keizzah/keith');
const { updatePresenceSettings } = require('../database/presence');

keith({
    nomCom: 'typing',
    categorie: 'Utils',
    reaction: '✍️'
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner only command');

    await updatePresenceSettings({ 
        status: 'composing', 
        isActive: true 
    });
    repondre('✅ Bot is now showing typing indicator');
});

const { keith } = require('../keizzah/keith');
const { getAutoBioSettings, updateAutoBioSettings } = require('../database/autobio');

keith({
    nomCom: 'autobio',
    categorie: 'Utils',
    reaction: '📝'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner privileges required');

    const action = arg[0]?.toLowerCase();
    const newMessage = arg.slice(1).join(' ');

    if (!action) {
        const settings = await getAutoBioSettings();
        return repondre(
            `📝 *AutoBio Settings*\n\n` +
            `Status: ${settings.status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
            `Message: ${settings.message}\n` +
            `Timezone: ${settings.timezone}\n\n` +
            `Usage:\n` +
            `▸ ${prefixe}autobio on/off - Toggle AutoBio\n` +
            `▸ ${prefixe}autobio message [text] - Set custom message\n` +
            `▸ ${prefixe}autobio timezone [zone] - Set timezone (e.g., Africa/Nairobi)`
        );
    }

    try {
        let response = '';
        const updates = {};

        if (action === 'on' || action === 'off') {
            updates.status = action;
            response = `✅ AutoBio is now *${action.toUpperCase()}*`;
        } 
        else if (action === 'message' && newMessage) {
            updates.message = newMessage;
            response = `✅ AutoBio message updated!`;
        } 
        else if (action === 'timezone' && newMessage) {
            updates.timezone = newMessage;
            response = `✅ Timezone set to *${newMessage}*`;
        } 
        else {
            return repondre(`❌ Invalid command. Use *${prefixe}autobio* for help.`);
        }

        await updateAutoBioSettings(updates);
        return repondre(response);
    } catch (error) {
        console.error('AutoBio command error:', error);
        return repondre('❌ Failed to update AutoBio settings!');
    }
});

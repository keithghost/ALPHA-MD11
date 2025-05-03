// Command Plugin
const { keith } = require('../keizzah/keith');
const { getAntiDeleteSettings, updateAntiDeleteSettings } = require('../database/antidelete');

keith({
    nomCom: 'antidelete',
    categorie: 'Moderation',
    reaction: '⚠️'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner privileges required');

    const action = arg[0]?.toLowerCase();
    const subOption = arg[1]?.toLowerCase();

    if (!action) {
        const settings = await getAntiDeleteSettings();
        return repondre(
            `⚠️ *Anti-Delete Settings*\n\n` +
            `Status: ${settings.status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
            `Notify All: ${settings.notify_all ? '✅ Enabled' : '❌ Disabled'}\n\n` +
            `Usage:\n` +
            `▸ ${prefixe}antidelete on - Enable anti-delete\n` +
            `▸ ${prefixe}antidelete off - Disable anti-delete\n` +
            `▸ ${prefixe}antidelete notify on - Enable notifications for all messages\n` +
            `▸ ${prefixe}antidelete notify off - Disable notifications for all messages`
        );
    }

    if (action === 'notify') {
        if (subOption !== 'on' && subOption !== 'off') {
            return repondre(`❌ Invalid notify option. Use ${prefixe}antidelete notify on/off`);
        }
        try {
            await updateAntiDeleteSettings({ notify_all: subOption === 'on' });
            return repondre(`✅ Notify-all is now *${subOption.toUpperCase()}*`);
        } catch (error) {
            console.error('AntiDelete command error:', error);
            return repondre('❌ Failed to update notify settings');
        }
    }

    if (action !== 'on' && action !== 'off') {
        return repondre(`❌ Invalid option. Use ${prefixe}antidelete on/off`);
    }

    try {
        await updateAntiDeleteSettings({ status: action });
        return repondre(`✅ Anti-Delete is now *${action.toUpperCase()}*`);
    } catch (error) {
        console.error('AntiDelete command error:', error);
        return repondre('❌ Failed to update settings');
    }
});

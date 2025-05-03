const { keith } = require('../keizzah/keith');
const { getAutoViewStatusSettings, updateAutoViewStatusSettings } = require('../database/autoviewstatus');

keith({
    nomCom: 'autoviewstatus',
    categorie: 'Utils',
    reaction: '👀'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner privileges required');

    const action = arg[0]?.toLowerCase();

    if (!action) {
        const settings = await getAutoViewStatusSettings();
        return repondre(
            `👀 *AutoViewStatus Settings*\n\n` +
            `Status: ${settings.status === 'on' ? '✅ ON' : '❌ OFF'}\n\n` +
            `Usage:\n` +
            `▸ ${prefixe}autoviewstatus on - Enable auto-viewing status\n` +
            `▸ ${prefixe}autoviewstatus off - Disable auto-viewing status`
        );
    }

    if (action !== 'on' && action !== 'off') {
        return repondre(`❌ Invalid option. Use ${prefixe}autoviewstatus on/off`);
    }

    try {
        await updateAutoViewStatusSettings({ status: action });
        return repondre(`✅ AutoViewStatus is now *${action.toUpperCase()}*`);
    } catch (error) {
        console.error('AutoViewStatus command error:', error);
        return repondre('❌ Failed to update settings');
    }
});

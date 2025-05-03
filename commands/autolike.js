const { keith } = require('../keizzah/keith');
const { getAutoLikeSettings, updateAutoLikeSettings } = require('../database/autolike');

keith({
    nomCom: 'autolike',
    categorie: 'Utils',
    reaction: '❤️'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner privileges required');

    const action = arg[0]?.toLowerCase();
    const param = arg[1]?.toLowerCase();
    const value = parseInt(arg[2]);

    if (!action) {
        const settings = await getAutoLikeSettings();
        return repondre(
            `❤️ *AutoLike Settings*\n\n` +
            `Status: ${settings.status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
            `Throttle: ${settings.throttle_delay}ms\n` +
            `Reaction Delay: ${settings.reaction_delay}ms\n` +
            `Emojis: ${settings.emojis.slice(0, 5).join(' ')}...\n\n` +
            `Usage:\n` +
            `▸ ${prefixe}autolike on/off\n` +
            `▸ ${prefixe}autolike throttle [ms]\n` +
            `▸ ${prefixe}autolike delay [ms]\n` +
            `▸ ${prefixe}autolike emojis 😀 👍 🎉`
        );
    }

    try {
        const updates = {};
        let response = '';

        if (action === 'on' || action === 'off') {
            updates.status = action;
            response = `✅ AutoLike ${action === 'on' ? 'ENABLED' : 'DISABLED'}`;
        } 
        else if (action === 'throttle' && !isNaN(value) && value > 0) {
            updates.throttle_delay = value;
            response = `✅ Throttle delay set to ${value}ms`;
        }
        else if (action === 'delay' && !isNaN(value) && value > 0) {
            updates.reaction_delay = value;
            response = `✅ Reaction delay set to ${value}ms`;
        }
        else if (action === 'emojis' && param) {
            const emojis = arg.slice(1).filter(e => e.trim());
            if (emojis.length > 0) {
                updates.emojis = emojis;
                response = `✅ Emoji list updated (${emojis.length} emojis)`;
            } else {
                return repondre('❌ Please provide at least one emoji');
            }
        }
        else {
            return repondre(`❌ Invalid command. Use ${prefixe}autolike for help`);
        }

        const success = await updateAutoLikeSettings(updates);
        return repondre(success ? response : '❌ Failed to update settings');
    } catch (error) {
        console.error('AutoLike command error:', error);
        return repondre('❌ An error occurred');
    }
});

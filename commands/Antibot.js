const { keith } = require('../keizzah/keith');
const { getAntiBotSettings, updateAntiBotSettings } = require('../database/antibot');

keith({
    nomCom: 'antibot',
    categorie: 'Group',
    reaction: '🤖'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifGroupe, superUser, verifAdmin } = commandeOptions;

    if (!verifGroupe) return repondre('*For groups only*');
    if (!superUser && !verifAdmin) return repondre('*Admin only command*');

    const action = arg[0]?.toLowerCase();
    const subAction = arg[1]?.toLowerCase();

    try {
        if (!action) {
            const { status, action: currentAction } = await getAntiBotSettings(dest);
            return repondre(
                `🤖 *AntiBot Settings*\n\n` +
                `Status: ${status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                `Action: ${currentAction.toUpperCase()}\n\n` +
                `Usage:\n` +
                `▸ .antibot on/off\n` +
                `▸ .antibot action delete/warn/remove`
            );
        }

        if (action === 'on' || action === 'off') {
            await updateAntiBotSettings(dest, { status: action });
            return repondre(`✅ AntiBot is now ${action.toUpperCase()}`);
        }

        if (action === 'action' && ['delete', 'warn', 'remove'].includes(subAction)) {
            await updateAntiBotSettings(dest, { action: subAction });
            return repondre(`✅ AntiBot action set to ${subAction.toUpperCase()}`);
        }

        return repondre('❌ Invalid command. Use .antibot for help');
    } catch (error) {
        console.error('AntiBot command error:', error);
        return repondre('❌ Failed to update settings');
    }
});

const { keith } = require('../keizzah/keith');
const { getAntiLinkSettings, updateAntiLinkSettings } = require('../database/antilink');
const { getWarnings, resetWarnings } = require('../database/warn');
keith({
    nomCom: 'antilink',
    categorie: 'Group',
    reaction: '🔗'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifGroupe, superUser, verifAdmin, auteurMsgRepondu } = commandeOptions;

    if (!verifGroupe) return repondre('*For groups only*');
    if (!superUser && !verifAdmin) return repondre('*Admin only command*');

    const action = arg[0]?.toLowerCase();
    const subAction = arg[1]?.toLowerCase();

    try {
        if (!action) {
            const { status, action: currentAction } = await getAntiLinkSettings(dest);
            return repondre(
                `🔗 *AntiLink Settings*\n\n` +
                `Status: ${status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                `Action: ${currentAction.toUpperCase()}\n\n` +
                `Usage:\n` +
                `▸ .antilink on/off\n` +
                `▸ .antilink action delete/warn/remove\n` +
                `▸ .antilink warns @user\n` +
                `▸ .antilink reset @user`
            );
        }

        switch (action) {
            case 'on':
            case 'off':
                await updateAntiLinkSettings(dest, { status: action });
                return repondre(`✅ AntiLink is now ${action.toUpperCase()}`);

            case 'action':
                if (['delete', 'warn', 'remove'].includes(subAction)) {
                    await updateAntiLinkSettings(dest, { action: subAction });
                    return repondre(`✅ AntiLink action set to ${subAction.toUpperCase()}`);
                }
                return repondre('❌ Invalid action. Use delete/warn/remove');

            case 'warns':
                if (!auteurMsgRepondu) return repondre('❌ Mention a user');
                const warnCount = await getWarnings(auteurMsgRepondu, dest);
                return repondre(
                    `⚠️ @${auteurMsgRepondu.split('@')[0]} has ${warnCount} warning(s)`,
                    { mentions: [auteurMsgRepondu] }
                );

            case 'reset':
                if (!auteurMsgRepondu) return repondre('❌ Mention a user');
                await resetWarnings(auteurMsgRepondu, dest);
                return repondre(
                    `✅ Warnings reset for @${auteurMsgRepondu.split('@')[0]}`,
                    { mentions: [auteurMsgRepondu] }
                );

            default:
                return repondre('❌ Invalid command. Use .antilink for help');
        }
    } catch (error) {
        console.error('AntiLink command error:', error);
        return repondre('❌ Failed to process command');
    }
});

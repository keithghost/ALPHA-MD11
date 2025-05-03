const { keith } = require('../keizzah/keith');
const { addSudoNumber, removeSudoNumber, isSudo } = require('../database/sudo');

keith({
    nomCom: 'sudo',
    categorie: 'Mods',
    reaction: '👑'
}, async (dest, zk, commandeOptions) => {
    const { arg, auteurMsgRepondu, repondre, prefixe, superUser } = commandeOptions;

    if (!superUser) {
        return repondre('❌ This command is restricted to bot owner');
    }

    if (!arg[0] || !auteurMsgRepondu) {
        return repondre(
            `👑 *Sudo Management*\n\n` +
            `Usage:\n` +
            `▸ ${prefixe}sudo add @user - Add sudo\n` +
            `▸ ${prefixe}sudo remove @user - Remove sudo\n\n` +
            `Reply to a message or mention the user`
        );
    }

    const action = arg[0].toLowerCase();
    const targetJid = auteurMsgRepondu;

    try {
        switch (action) {
            case 'add':
                if (await isSudo(targetJid)) {
                    return repondre(`❌ @${targetJid.split('@')[0]} is already sudo`, 
                        { mentions: [targetJid] });
                }
                await addSudoNumber(targetJid);
                return repondre(`✅ @${targetJid.split('@')[0]} is now a sudo user`,
                    { mentions: [targetJid] });

            case 'remove':
            case 'del':
                if (!await isSudo(targetJid)) {
                    return repondre(`❌ @${targetJid.split('@')[0]} isn't sudo`,
                        { mentions: [targetJid] });
                }
                await removeSudoNumber(targetJid);
                return repondre(`✅ @${targetJid.split('@')[0]} removed from sudo`,
                    { mentions: [targetJid] });

            default:
                return repondre('❌ Invalid action. Use "add" or "remove"');
        }
    } catch (error) {
        console.error('Error managing sudo user:', error);
        return repondre('❌ Failed to update sudo permissions');
    }
});

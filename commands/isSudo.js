const { keith } = require('../keizzah/keith');
const { isSudo } = require('../database/sudo');

keith({
    nomCom: 'issudo',
    categorie: 'Mods',
    reaction: '👑'
}, async (dest, zk, commandeOptions) => {
    const { auteurMsgRepondu, repondre, verifGroupe } = commandeOptions;

    if (!auteurMsgRepondu) {
        return repondre('❌ Please mention a user to check');
    }

    try {
        const sudoStatus = await isSudo(auteurMsgRepondu);
        return repondre(
            `👑 *Sudo Status*\n\n` +
            `User: @${auteurMsgRepondu.split('@')[0]}\n` +
            `Status: ${sudoStatus ? '✅ Sudo User' : '❌ Not Sudo'}`,
            { mentions: [auteurMsgRepondu] }
        );
    } catch (error) {
        console.error('Error checking sudo status:', error);
        return repondre('❌ Failed to check sudo status');
    }
});

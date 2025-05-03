const { keith } = require('../keizzah/keith');
const { banUser, unbanUser, isBanned, getBannedUsers } = require('../database/banuser');

keith({
    nomCom: 'ban',
    categorie: 'Mods',
    reaction: '🚫'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser, auteurMsgRepondu, verifGroupe } = commandeOptions;

    if (!superUser) return repondre('❌ Owner privileges required');

    const action = arg[0]?.toLowerCase();
    const reason = arg.slice(1).join(' ') || 'No reason provided';

    if (!action) {
        const bannedUsers = await getBannedUsers();
        let message = '🚫 *Banned Users*\n\n';
        
        if (bannedUsers.length === 0) {
            message += 'No users are currently banned';
        } else {
            bannedUsers.forEach(user => {
                message += `• @${user.jid.split('@')[0]} - ${user.reason}\n`;
            });
        }

        message += `\nUsage:\n${prefixe}ban [add/remove] @user [reason]`;
        return repondre(message);
    }

    if (!auteurMsgRepondu) {
        return repondre('❌ Please mention or reply to a user');
    }

    try {
        switch (action) {
            case 'add':
                if (await isBanned(auteurMsgRepondu)) {
                    return repondre(`❌ @${auteurMsgRepondu.split('@')[0]} is already banned`, {
                        mentions: [auteurMsgRepondu]
                    });
                }
                await banUser(auteurMsgRepondu, reason);
                return repondre(`✅ @${auteurMsgRepondu.split('@')[0]} has been banned\nReason: ${reason}`, {
                    mentions: [auteurMsgRepondu]
                });

            case 'remove':
            case 'del':
                if (!await isBanned(auteurMsgRepondu)) {
                    return repondre(`❌ @${auteurMsgRepondu.split('@')[0]} is not banned`, {
                        mentions: [auteurMsgRepondu]
                    });
                }
                await unbanUser(auteurMsgRepondu);
                return repondre(`✅ @${auteurMsgRepondu.split('@')[0]} has been unbanned`, {
                    mentions: [auteurMsgRepondu]
                });

            default:
                return repondre(`❌ Invalid action. Use ${prefixe}ban add/remove @user [reason]`);
        }
    } catch (error) {
        console.error('Ban command error:', error);
        return repondre('❌ Failed to process ban request');
    }
});

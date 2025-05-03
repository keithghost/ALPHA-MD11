const { keith } = require('../keizzah/keith');
const { getAutoReadStatus, setAutoReadStatus } = require('../database/autoread');

keith({
    nomCom: 'autoread',
    categorie: 'Utils',
    reaction: '📖'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser } = commandeOptions;

    if (!superUser) return repondre('❌ Owner privileges required');

    const action = arg[0]?.toLowerCase();

    if (!action) {
        const status = await getAutoReadStatus();
        return repondre(
            `📖 *AutoRead Status:* ${status === 'on' ? '✅ ON' : '❌ OFF'}\n\n` +
            `Usage:\n` +
            `▸ ${prefixe}autoread on - Enable auto-read\n` +
            `▸ ${prefixe}autoread off - Disable auto-read`
        );
    }

    if (action !== 'on' && action !== 'off') {
        return repondre(`❌ Invalid option. Use *${prefixe}autoread on/off*`);
    }

    const success = await setAutoReadStatus(action);
    if (success) {
        repondre(`✅ AutoRead is now *${action.toUpperCase()}*`);
    } else {
        repondre('❌ Failed to update AutoRead status!');
    }
});

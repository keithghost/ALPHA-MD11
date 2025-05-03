const { keith } = require('../keizzah/keith');
const { getAllSudoNumbers } = require('../database/sudo');

keith({
    nomCom: 'getsudo',
    categorie: 'Mods',
    reaction: '📜'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    try {
        const sudoUsers = await getAllSudoNumbers();
        
        if (sudoUsers.length === 0) {
            return repondre('📜 *Sudo List*\n\nNo sudo users configured');
        }

        const formattedList = sudoUsers.map(jid => `• @${jid.split('@')[0]}`).join('\n');
        return repondre(
            `📜 *Sudo Users*\n\n${formattedList}`,
            { mentions: sudoUsers }
        );
    } catch (error) {
        console.error('Error getting sudo list:', error);
        return repondre('❌ Failed to retrieve sudo list');
    }
});

const { keith } = require('../keizzah/keith');
const { getAntiBadWordSettings, updateAntiBadWordSettings } = require('../database/antibadword');

keith({
    nomCom: 'antibadword',
    categorie: 'Group',
    reaction: '🚫'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifGroupe, superUser, verifAdmin, auteurMsgRepondu } = commandeOptions;

    if (!verifGroupe) return repondre('*For groups only*');
    if (!superUser && !verifAdmin) return repondre('*Admin only command*');

    const action = arg[0]?.toLowerCase();
    const subAction = arg[1]?.toLowerCase();
    const word = arg[2];

    try {
        if (!action) {
            const { status, action: currentAction, wordlist } = await getAntiBadWordSettings(dest);
            return repondre(
                `🚫 *AntiBadWord Settings*\n\n` +
                `Status: ${status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                `Action: ${currentAction.toUpperCase()}\n` +
                `Word Count: ${wordlist.length}\n\n` +
                `Usage:\n` +
                `▸ .antibadword on/off\n` +
                `▸ .antibadword action delete/warn/remove\n` +
                `▸ .antibadword addword [word]\n` +
                `▸ .antibadword delword [word]`
            );
        }

        switch (action) {
            case 'on':
            case 'off':
                await updateAntiBadWordSettings(dest, { status: action });
                return repondre(`✅ AntiBadWord is now ${action.toUpperCase()}`);
                
            case 'action':
                if (['delete', 'warn', 'remove'].includes(subAction)) {
                    await updateAntiBadWordSettings(dest, { action: subAction });
                    return repondre(`✅ Action set to ${subAction.toUpperCase()}`);
                }
                return repondre('❌ Invalid action. Use delete/warn/remove');
                
            case 'addword':
                if (!word) return repondre('❌ Provide a word to add');
                const { wordlist: currentList } = await getAntiBadWordSettings(dest);
                if (currentList.includes(word.toLowerCase())) {
                    return repondre(`❌ "${word}" already in list`);
                }
                await updateAntiBadWordSettings(dest, { 
                    wordlist: [...currentList, word.toLowerCase()] 
                });
                return repondre(`✅ Added "${word}" to bad words list`);
                
            case 'delword':
                if (!word) return repondre('❌ Provide a word to remove');
                const { wordlist: currentWords } = await getAntiBadWordSettings(dest);
                if (!currentWords.includes(word.toLowerCase())) {
                    return repondre(`❌ "${word}" not in list`);
                }
                await updateAntiBadWordSettings(dest, { 
                    wordlist: currentWords.filter(w => w !== word.toLowerCase()) 
                });
                return repondre(`✅ Removed "${word}" from list`);
                
            default:
                return repondre('❌ Invalid command');
        }
    } catch (error) {
        console.error('AntiBadWord command error:', error);
        return repondre('❌ Failed to process command');
    }
});

const { keith } = require('../keizzah/keith');
const { setEvent, getEvent } = require('../database/events');

keith({
    nomCom: 'events',
    categorie: 'Group',
    reaction: '🎉'
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser, auteurMsgRepondu, verifGroupe } = commandeOptions;

    // Validate group and admin permissions
    if (!verifGroupe) return repondre('❌ This command only works in groups');
    if (!superUser && !auteurMsgRepondu?.admin) {
        return repondre('❌ You need admin rights to use this command');
    }

    const action = arg[0]?.toLowerCase();
    const eventType = arg[1]?.toLowerCase();
    const validEvents = ['welcome', 'goodbye', 'antipromote', 'antidemote'];

    // Show current settings if no arguments
    if (!action || !eventType || !validEvents.includes(eventType)) {
        try {
            const [welcome, goodbye, antipromote, antidemote] = await Promise.all([
                getEvent(verifGroupe, 'welcome'),
                getEvent(verifGroupe, 'goodbye'),
                getEvent(verifGroupe, 'antipromote'),
                getEvent(verifGroupe, 'antidemote')
            ]);

            return repondre(
                `🎉 *Group Events Settings*\n\n` +
                `Welcome: ${welcome === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                `Goodbye: ${goodbye === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                `Anti-Promote: ${antipromote === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                `Anti-Demote: ${antidemote === 'on' ? '✅ ON' : '❌ OFF'}\n\n` +
                `*Usage:*\n` +
                `▸ ${prefixe}events on/off [event-type]\n` +
                `*Examples:*\n` +
                `▸ ${prefixe}events on welcome\n` +
                `▸ ${prefixe}events off antidemote`
            );
        } catch (error) {
            console.error('Error fetching events:', error);
            return repondre('❌ Failed to load settings');
        }
    }

    // Validate action
    if (action !== 'on' && action !== 'off') {
        return repondre(`❌ Invalid action. Use "on" or "off"\nExample: ${prefixe}events on welcome`);
    }

    // Update setting
    try {
        const success = await setEvent(verifGroupe, eventType, action);
        if (success) {
            return repondre(`✅ *${eventType.toUpperCase()}* is now ${action === 'on' ? 'ENABLED' : 'DISABLED'}`);
        }
        return repondre('❌ Failed to update settings');
    } catch (error) {
        console.error('Error updating event:', error);
        return repondre('❌ Database error while updating');
    }
});

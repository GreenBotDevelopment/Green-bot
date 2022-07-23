"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Stats extends QuickCommand_1.Command {
    get name() {
        return "stats";
    }
    get aliases() {
        return ["bi", "botinfo"];
    }
    get category() {
        return "Everyone Commands";
    }
    get description() {
        return "My current info!";
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (yield e.client.cluster.broadcastEval("this.guilds.size")).reduce((e, t) => e + t, 0);
            e.send({
                embeds: [
                    {
                        author: { name: "Green-bot | Infos", url: "https://discord.gg/greenbot", icon_url: e.author.dynamicAvatarURL() },
                        color: 0x3a871f,
                        description: "Green-bot is a free discord music bot wich aims to provide free 24/7 music for everyone!",
                        fields: [
                            { name: "Current node", value: "Node-Europa ( Germany )", inline: true },
                            { name: "Server Count", value: t.toLocaleString(), inline: true },
                            { name: "Framework", value: "NodeJS - Lavalink - Shoukaku", inline: true },
                        ],
                        footer: { text: "Want more? Check our premium (green-bot.app/premium)", icon_url: e.client.user.dynamicAvatarURL() },
                    },
                ],
            });
        });
    }
}
exports.default = Stats;

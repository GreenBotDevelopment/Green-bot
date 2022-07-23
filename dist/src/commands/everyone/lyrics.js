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
const node_fetch_1 = require("node-fetch");
class Queue extends QuickCommand_1.Command {
    get name() {
        return "lyrics";
    }
    get description() {
        return "Shows the lyrics of the current track or another track";
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: false, vote: true };
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.args[0]) {
                const i = e.args.join(" "), r = "https://some-random-api.ml/lyrics?title=" +
                    i
                        .toLowerCase()
                        .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
                        .split(" ")
                        .join("%20"), o = yield (0, node_fetch_1.default)(r), c = yield o.json();
                return c.title
                    ? e.send({
                        embeds: [
                            {
                                author: { name: `${c.title ? c.title : i} - ${c.author ? c.author : "Unknown"}`, icon_url: c.thumbnail[0], url: "https://green-bot.app" },
                                color: 0x3a871f,
                                description: `${c.lyrics.slice(0, 4e3)}`,
                                footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.dynamicAvatarURL() },
                            },
                        ],
                    })
                    : e.errorMessage("No lyrics found for `" + i + "`");
            }
            {
                if (!e.dispatcher || !e.dispatcher.current)
                    return e.errorMessage("Please provide a song name");
                const i = e.dispatcher.current.info.title, r = "https://some-random-api.ml/lyrics?title=" +
                    i
                        .toLowerCase()
                        .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
                        .split(" ")
                        .join("%20"), t = yield (0, node_fetch_1.default)(r), o = yield t.json();
                return o.title
                    ? e.send({
                        embeds: [
                            {
                                author: { name: `${o.title ? o.title : i} - ${o.author ? o.author : "Unknown"}`, icon_url: o.thumbnail[0], url: "https://green-bot.app" },
                                color: 0x3a871f,
                                description: `${o.lyrics.slice(0, 4e3)}`,
                                footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.dynamicAvatarURL() },
                            },
                        ],
                    })
                    : e.errorMessage("No lyrics found for `" + e.dispatcher.current.info.title + "`");
            }
        });
    }
}
exports.default = Queue;

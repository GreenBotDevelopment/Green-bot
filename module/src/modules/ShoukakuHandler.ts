import { Spotify } from "@tuneorg/spotify";
import { Shoukaku, Connectors, Player, Node } from "shoukaku";
import { getData } from "spotify-url-info";
import { BaseDiscordClient } from "../BaseDiscordClient";
import { Context } from "./Context";
import { SlashContext } from "./SlashContext";

interface UserCooldown {
    userId: string;
    last_cmd: number
}

export class ShoukakuHandler extends Shoukaku {
    client: BaseDiscordClient;
    cache: Array<any>;
    cooldowns: Array<UserCooldown>
    constructor(client: BaseDiscordClient) {
        super(new Connectors.Eris(client), client.config.lavalink, client.config.shoukaku),
            this.client = client;
        this.cooldowns = [];
        this.cache = [];
        this.on("error", (NodeName: string, error: Error) => {
            console.log(`[Shoukaku] Node ${NodeName} got an error: ${error}`);
            console.log(error);
        })

        this.on("disconnect", (name: string, players: Array<Player>, moved: boolean) => {
            console.log(`[Shoukaku] The node ${name} just lost connection to lavalink WS.`);

            if (!moved)
                players.forEach(pl => {
                    this.client.queue.delete(pl.connection.guildId)
                    pl.connection.disconnect()
                })
        })
    }
    checkURL(url: string) {
        try {
            return new URL(url), true;
        } catch (err) {
            return false;
        }
    }
    async fetchSp(searchQuery: string, spotifyEngine: Spotify) {
        let result, scraped;
        try {
            await spotifyEngine.renewToken();
            result = await spotifyEngine.search(searchQuery);
        } catch (err) {
            console.debug("[Spotify] Could not use API, scraping");
            result = await getData(searchQuery);
            scraped = true;
        }
        if (!result || !result.tracks.length) result = await getData(searchQuery), scraped = true;
        result.type = result.type.toLowerCase();
        return { data: result, sc: scraped };
    }
    async spotify(searchQuery: string, audioNode: Node, spotifyEngine: Spotify) {
        let data;
        const res = await this.fetchSp(searchQuery, spotifyEngine);
        if (!res || !res.data) return console.log(`[Spotify] Not found for ${searchQuery} while using spotify resolver.`);
        switch (res.data.type) {
            case "track":
                const search = await audioNode.rest.resolve(`ytsearch:${res.sc ? res.data.name : res.data.tracks[0].title} ${res.sc ? res.data.artists[0].name : res.data.tracks[0].artists}`)
                search && (data = search.tracks[0])
                break;
            case "playlist":
            case "album":
                data = res.sc ? res.data.tracks.items : res.data.tracks;
                break;
            default:
                return null;
        }
        return { raw: data, sp: res.data, scraped: res.sc };
    }

    checkEligible(context: Context | SlashContext | any) {
        let eligible = true;
        const found = this.cooldowns.find(cd => cd.userId === context.author.id)
        if (!found) {
            this.cooldowns.push({
                userId: context.author.id,
                last_cmd: 2500 + Date.now()
            })
        }
        else {
            if (found.last_cmd > Date.now()) {
                eligible = false;
            }
            const index = this.cooldowns.findIndex(cd => cd.userId === context.author.id)
            this.cooldowns[index].last_cmd = 2500 + Date.now()
        }
        return eligible
    }

    async search(audioNode: Node, searchQuery: string, context: any) {
        if (this.cache.find(s => s.id === searchQuery)) return { tracks: [this.cache.find(s => s.id === searchQuery).info] }
        if (this.checkURL(searchQuery) && searchQuery.includes("spotify")) return await this.spotify(searchQuery, audioNode, context.client.spotify)
        const res = await audioNode.rest.resolve(this.checkURL(searchQuery) ? searchQuery : `ytsearch:${searchQuery}`)
        if (this.checkURL(searchQuery) && res && res.tracks.length) this.cache.push({ id: res.tracks[0].info.uri, info: res.tracks[0] });
        return res;
    }
}

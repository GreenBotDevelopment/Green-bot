"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BaseDiscordClient_1 = require("./BaseDiscordClient");
const config_1 = tslib_1.__importDefault(require("../config"));
const client = new BaseDiscordClient_1.BaseDiscordClient(config_1.default);
client.listenners(config_1.default.debug);
client.init();

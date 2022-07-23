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
exports.CollectorManager = void 0;
class CollectorManager {
    constructor() {
        this._constr = [];
    }
    create(collectorData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._constr.find(c => c.channelId === collectorData.channelId && c.type === collectorData.type)) {
                const col = this._constr.find(c => c.channelId === collectorData.channelId);
                this.end(collectorData.channelId);
            }
            collectorData.timeout = setTimeout(() => {
                this.end(collectorData.channelId);
            }, collectorData.time).unref();
            this._constr.push(collectorData);
            return collectorData;
        });
    }
    end(collectorId) {
        const collector = this._constr.find(col => col.channelId === collectorId);
        if (!collector)
            return;
        this._constr = this._constr.filter(cl => cl.channelId !== collectorId);
        collector.end("TIMES_UP");
    }
    stop(collectorId) {
        this._constr = this._constr.filter(cl => cl.channelId !== collectorId);
    }
    handle(data, type) {
        const collector = this._constr.find(col => col.channelId === data.channel.id && col.type === type);
        if (!collector)
            return false;
        if (!collector.filter(data))
            return false;
        collector.exec(data);
        return true;
    }
}
exports.CollectorManager = CollectorManager;

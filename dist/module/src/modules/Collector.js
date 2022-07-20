"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorManager = void 0;
class CollectorManager {
    _constr;
    constructor() {
        this._constr = [];
    }
    async create(collectorData) {
        if (this._constr.find(c => c.channelId === collectorData.channelId && c.type === collectorData.type)) {
            const col = this._constr.find(c => c.channelId === collectorData.channelId);
            this.end(collectorData.channelId);
        }
        collectorData.timeout = setTimeout(() => {
            this.end(collectorData.channelId);
        }, collectorData.time).unref();
        this._constr.push(collectorData);
        return collectorData;
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

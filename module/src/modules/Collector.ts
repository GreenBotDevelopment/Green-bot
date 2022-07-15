import { CommandInteraction, Interaction, Message } from "eris";

interface Collector {
    channelId: string;
    userId?: string;
    time: number | null;
    filter: CallableFunction;
    timeout?: any;
    type: "message" | "button";
    end: CallableFunction;
    exec: CallableFunction;
}


export class CollectorManager {
    _constr: Array<Collector>
    constructor() {
        this._constr = [];
    }

    async create(collectorData: Collector) {
        if (this._constr.find(c => c.channelId === collectorData.channelId && c.type === collectorData.type)) {
           const col =  this._constr.find(c => c.channelId === collectorData.channelId);
            this.end(collectorData.channelId);
        }
        collectorData.timeout = setTimeout(() => {
            this.end(collectorData.channelId)
        }, collectorData.time).unref()
        this._constr.push(collectorData);
        return collectorData
    }

    end(collectorId: string) {
        const collector = this._constr.find(col => col.channelId === collectorId)
        if (!collector) return
        this._constr = this._constr.filter(cl => cl.channelId !== collectorId);
        collector.end("TIMES_UP")
    }

    stop(collectorId: string) {
        this._constr = this._constr.filter(cl => cl.channelId !== collectorId)
    }

    handle(data: any,type: "message" | "button") {
        const collector = this._constr.find(col => col.channelId === data.channel.id && col.type === type)
        if (!collector) return false;
        if (!collector.filter(data)) return false;
        collector.exec(data)
        return true;
    }
}
export class BaseError{
    name: any;
    constructor(name){
        this.name = name;
    }

    handler(err){
        console.log(err)
        return console.log(`[${this.name || "Process<Unknownn>"}] ${err}`)
    }
}
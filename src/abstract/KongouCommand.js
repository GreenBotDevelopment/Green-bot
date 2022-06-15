class BaseCommand {
    constructor(o) {
        if (((this.client = o), this.constructor === BaseCommand)) throw new TypeError('Abstract class "BaseCommand" cannot be instantiated directly.');
    }
    get permissions() {
        return null;
    }
}
module.exports = BaseCommand;
const fr_aliases = require("./FR").aliases
const en_aliases = require("./EN").aliases
const es_aliases = require("./ES").aliases

function getFile(locale) {
    switch (locale) {
        case "EN":
            return require("./EN/translations")
        case "FR":
            return require("./FR/translations")
        case "ES":
            return require(".ES/translations")
        default:
            return require("./EN/translations")
    }
}

function resolveLanguage(args) {
    if (args === "FR" || fr_aliases.includes(args)) return "FR"
    if (args === "EN" || en_aliases.includes(args)) return "EN"
    if (args === "ES" || es_aliases.includes(args)) return "ES"
    return null
}
module.exports = { getFile, resolveLanguage };

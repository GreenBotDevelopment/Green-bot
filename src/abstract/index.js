const fr_aliases = require("./FR").aliases
const en_aliases = require("./EN").aliases

function getFile(locale) {
    switch (locale) {
        case "EN":
            return require("./EN/translations")
        case "FR":
            return require("./FR/translations")
        default:
            return require("./EN/translations")
    }
}

function resolveLanguage(args) {
    if (args === "FR" || fr_aliases.includes(args)) return "FR"
    if (args === "EN" || en_aliases.includes(args)) return "EN"
    return null
}
module.exports = { getFile, resolveLanguage };
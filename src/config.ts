import { Config, Options } from "./index"
import fs from "fs"

export function loadConfig(options: Options): Config {
    const global = loadGlobal()
    const local = loadLocal(options)
    const config = options.ignoreGlobalConfig ? local : { ...global, ...local }

    validate(config)
    return config as Config
}

function validate(config: Partial<Config>) {
    if (!config.host) {
        throw new Error('config error: specify the "host" field')
    } else if (!config.password && !config.privateKeyFile) {
        throw new Error('config error: specify "password" or "privateKeyFile" field')
    } else if (!config.path || !config.remoteDir) {
        throw new Error('config error: both "path" and "remoteDir" fields are required')
    }
}

function loadGlobal() {
    return parseFile(process.env.EASYUPLOAD_CONFIG)
}

function loadLocal({ configFile }: Options) {
    return parseFile(configFile || "ezupload.json")
}

function parseFile(path?: string): Config | {} {
    try {
        const file = fs.readFileSync(path, "utf-8")
        const config = JSON.parse(file)

        if (config) return config
    } catch (e) {
    }

    return {}
}

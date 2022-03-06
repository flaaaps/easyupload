import { Arguments, Config, Options } from "./index"
import fs from "fs"

export function resolveConfiguration(args: Arguments) {
    const config = args.configFile ? loadFromFile(args) : {
        host: args.host,
        username: args.username,
        password: args.password,
        privateKey: args.privateKey,
        path: args.path,
        remoteDir: args.remoteDir,
        excludeFolders: args.excludeFolders
    } as Options

    validate(config, args.configFile !== null)

    return config
}

export function loadFromFile(options: Arguments): Config {
    const global = loadGlobal()
    const local = loadLocal(options.configFile!!)
    const config = options.ignoreGlobalConfig ? local : { ...global, ...local }

    return config as Config
}

export function validate(config: Partial<Config> | Partial<Options>, configFile: boolean) {
    const configType = configFile ? "field" : "argument"

    if (!config.username) {
        throw new Error(formatError("username", configType))
    } else if (!config.host) {
        throw new Error(formatError("host", configType))
    } else if (!config.password && !config.privateKeyFile && !config.privateKey) {
        throw new Error(`config error: specify the \"password\" or \"${configFile ? "privateKeyFile" : "privateKey"}\" ${configType}`)
    } else if (!config.path || !config.remoteDir) {
        throw new Error(`config error: both ${configType} \"path\" and \"remoteDir\" are required`)
    }
}

function formatError(field: string, configType: "field" | "argument") {
    return `config error: specify the "${field}" ${configType}`
}

function loadGlobal() {
    return parseFile(process.env.EASYUPLOAD_CONFIG)
}

function loadLocal(configFile: string) {
    return parseFile(configFile || "ezupload.json")
}

function parseFile(path?: string): Config | {} {
    try {
        if (!path) return {}
        const file = fs.readFileSync(path, "utf-8")
        const config = JSON.parse(file)

        if (config) return config
    } catch (e) {
    }

    return {}
}

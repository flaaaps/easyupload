export type Config = {
    host: string
    username: string
    password?: string
    path: string | string[]
    remoteDir: string
    excludeFolders?: string[]
    privateKeyFile?: string
    privateKey: undefined
}

export type Arguments = {
    logType: Log
    configFile: string | null
    ignoreGlobalConfig: boolean

    host?: string
    username?: string
    password?: string
    path?: string | string[]
    remoteDir?: string
    excludeFolders?: string[]
    privateKey?: string
}

export type Options = {
    host: string
    username: string
    password: string
    path: string | string[]
    remoteDir: string
    excludeFolders: string[]
    privateKey: string
    privateKeyFile: undefined
}

export type Log = "all" | "none" | "files" | "progress"

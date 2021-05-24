export type Config = {
    host: string
    username: string
    password?: string
    path: string
    remoteDir: string
    excludeFolders?: string[]
    privateKeyFile?: string
}

export type Options = {
    logType: Log
    configFile: string
}

export type Log = "all" | "none" | "files" | "progress"

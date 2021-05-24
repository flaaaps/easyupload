type Config = {
    host: string
    username: string
    password?: string
    path: string
    remoteDir: string
    excludeFolders?: string[]
    privateKeyFile?: string
}

type Options = {
    logType: Log
    configFile: string
}

type Log = "all" | "none" | "files" | "progress"

import arg from "arg"
import fs from "fs"

// @ts-ignore
import SftUpload from "sftp-upload"
import { Arguments, Config, Log, Options } from "./index"
import { resolveConfiguration } from "./config"

function parseArgsToOptions(raw: string[]): Arguments {
    const args = arg(
        {
            "--config": String,
            "--log-type": String,
            "--ignore-global-config": Boolean,

            "--host": String,
            "--username": String,
            "--password": String,
            "--path": String,
            "--remoteDir": String,
            "--privateKey": String,
            "--excludedFolders": [String],

            "-c": "--config",
            "-log": "--log-type",
            "-i": "--ignore-global-config",
            "-p": "--path"
        },
        {
            argv: raw.slice(2)
        }
    )

    const host: any = args["--host"]
    let configFile: string | null = args["--config"] || "ezupload.json"

    if (host) {
        configFile = null
    }

    return {
        configFile: configFile,
        logType: (args["--log-type"] as Log) || "all",
        ignoreGlobalConfig: !!args["--ignore-global-config"],

        host,
        privateKey: args["--privateKey"],
        path: args["--path"]?.split(",") || [],
        excludeFolders: args["--excludedFolders"],
        password: args["--password"],
        remoteDir: args["--remoteDir"]?.replace(":", ""),
        username: args["--username"]
    }
}

export function cli(args: string[]) {
    const options = parseArgsToOptions(args)
    const config: Config | Options = resolveConfiguration(options)

    const key = config.privateKeyFile ? parsePrivateKey(fs.readFileSync(config.privateKeyFile).toString()) : config.privateKey ? parsePrivateKey(config.privateKey)
        : undefined

    const sftpConfig = {
        ...config,
        privateKey: key
    }

    const sftp = new SftUpload(sftpConfig)
    const logType = options.logType
    sftp.on("error", function(err: any) {
        throw err
    })
        .on("uploading", (progress: any) => {
            const outputFile = `Uploading "${progress.file}"...`
            const outputProgress = `${progress.percent}% completed`

            if (logType === "all") {
                console.log(outputFile)
                console.log(outputProgress)
            } else if (logType === "files") console.log(outputFile)
            else if (logType === "progress") console.log(outputProgress)
        })
        .on("completed", () => {
            if (logType === "all" || logType === "progress") console.log("Upload Completed")
        })
        .upload()
}

function parsePrivateKey(key: string) {
    if(!key.startsWith("-----BEGIN RSA PRIVATE KEY-----") && !key.endsWith("-----END RSA PRIVATE KEY-----")) {
        return key
    }

    const plainKey = key.replace("-----BEGIN RSA PRIVATE KEY-----", "")
        .replace("-----END RSA PRIVATE KEY-----", "")
        .trim()

    return `
-----BEGIN RSA PRIVATE KEY-----
${plainKey.replace(" ", "\n")}
-----END RSA PRIVATE KEY-----`
}
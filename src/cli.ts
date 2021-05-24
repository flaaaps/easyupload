import arg from "arg"
import fs from "fs"

import SftUpload from "sftp-upload"

function parseArgsToOptions(raw): Options {
    const args = arg(
        {
            "--config": String,
            "--log-type": String,
        },
        {
            argv: raw.slice(2),
        }
    )
    return {
        configFile: args["--config"] || "easyconf.json",
        logType: (args["--log-type"] as Log) || "all",
    }
}

function checkConfig(config: Config) {
    if (!config.host) {
        throw new Error('config error: specify the "host" field')
    } else if (!config.password && !config.privateKeyFile) {
        throw new Error('config error: specify "password" or "privateKeyFile" field')
    } else if (!config.path || !config.remoteDir) {
        throw new Error('config error: both "path" and "remoteDir" fields are required')
    }
}

export function cli(args) {
    const options = parseArgsToOptions(args)
    const config: Config = JSON.parse(fs.readFileSync(options.configFile, "utf-8"))
    checkConfig(config)

    const sftpConfig = {
        ...config,
        privateKey: fs.readFileSync(config.privateKeyFile),
    }
    const sftp = new SftUpload(sftpConfig)
    const logType = options.logType
    sftp.on("error", function (err) {
        throw err
    })
        .on("uploading", function (progress) {
            const outputFile = `Uploading "${progress.file}"...`
            const outputProgress = `${progress.percent}% completed`

            if (logType === "all") {
                console.log(outputFile)
                console.log(outputProgress)
            } else if (logType === "files") console.log(outputFile)
            else if (logType === "progress") console.log(outputProgress)
        })
        .on("completed", function () {
            if (logType === "all" || logType === "progress") console.log("Upload Completed")
        })
        .upload()
}

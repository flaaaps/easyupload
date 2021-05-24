import arg from "arg"
import fs from "fs"

import SftUpload from "sftp-upload"
import { Log, Options } from "./index"
import { loadConfig } from "./config"

function parseArgsToOptions(raw: string[]): Options {
    const args = arg(
        {
            "--config": String,
            "--log-type": String,
            "--ignore-global-config": Boolean,

            "-c": "--config",
            "-log": "--log-type",
            "-i": "--ignore-global-config"
        },
        {
            argv: raw.slice(2),
        }
    )

    return {
        configFile: args["--config"] || "ezupload.json",
        logType: (args["--log-type"] as Log) || "all",
        ignoreGlobalConfig: !!args["--ignore-global-config"]
    }
}

export function cli(args: string[]) {
    const options = parseArgsToOptions(args)
    const config = loadConfig(options)

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

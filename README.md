# easyupload
Easily upload folders to your server using SFTP

```shell
$ npm install -g @flaaaps/easyupload
```

## Example

Create the default config file `ezupload.json` in your root directory

```json
{
    "host": "my.ip",
    "username": "root",
    "path": "./src/",
    "remoteDir": "/tempDir/new",
    "excludedFolders": ["node_modules"],
    "privateKeyFile": "path/to/keyfile.ppk"
}
```

Upload based on the configuration in `ezupload.json`
```bash
$ easyupload
```

## Configuration
The following fields can be specified in the config file

- **host** - Remote server IP/Hostname
- **username** - SFTP server's username
- **path** - folder that should be uploaded to the server
- **excludedFolders** - array of paths to folders that should *not* be ignored and not uploaded
- **password** - SFTP server's password (optional)
- **privateKeyFile** - RSA key, you must upload a public key to the remote server before attempting to upload any content.
- **remoteDir** - directory on the server, where files are going to be uploaded

### Global Configuration

You can specify the path to a global config file in the `EASYUPLOAD_CONFIG` environment variable. 
These options are applied to every project using easyupload, but can be overwritten by the local `ezupload.json` config file.

See the [arguments](#arguments) section for more information on how to disable this mechanism.

## Arguments
**`--config -c`** - specify custom configuration file

**`--log-type -log`** - set a log type: "all", "none", "progress" or "files", defaults to "all"

**`--ignore-global-config -i`** - don't pull options from the global config file

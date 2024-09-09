const FileSystem = require('fs')
const Path = require('path')
const { fileTypes, fileIcons } = require("./fileExtension")

exports.load = (root, location) => {
    return new Promise((resolve, reject) => {
        let files = FileSystem.readdirSync(location)
        let result = []

        files.forEach(file => {
            if (file.startsWith('.')) {
                return;
            }

            let name = file
            let path = Path.join(location, name)
            let extension = Path.extname(name)
            let stats = FileSystem.statSync(path)
            let type = fileTypes[extension] || 'Other File'
            let icon = fileIcons[extension] || '<i class="fa-solid fa-file"></i>'
            let subPath = path.replace(root, '')

            if (stats.isDirectory()) {
                subPath = Path.join("?dir=", subPath)
            }
            result.push({
                name: name,
                path: path,
                isDirectory: stats.isDirectory,
                size: stats.size,
                lastModified: stats.mtime,
                ext: extension,
                type: type,
                icon: icon,
                subPath: subPath
            })
        })
        resolve(result)
    })
};
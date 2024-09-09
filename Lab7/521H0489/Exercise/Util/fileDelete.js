const FileSystem = require('fs');

exports.deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        FileSystem.unlinkSync(filePath, (err => {
            if (err) {
                reject(err);
            } else {
                resolve(`File ${filePath} has been deleted.`);
            }
        }));
    });
};


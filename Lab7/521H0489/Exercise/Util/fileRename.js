const FileSystem = require('fs');
const Path = require('path');

exports.renameFile = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        FileSystem.rename(oldPath, newPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(`File ${oldPath} has been renamed to ${newPath}.`);
            }
        });
    });
};

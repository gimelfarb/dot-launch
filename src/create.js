const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { writeHtmlLaunch } = require('./html');

const mkdirAsync = promisify(fs.mkdir);

module.exports = {
    createLaunchFile,
};

async function createLaunchFile(filepath, data) {
    await ensureFolderCreated(path.dirname(filepath));
    const d = createDeferred();
    const out = fs.createWriteStream(filepath);
    out.once('error', d.reject);
    out.once('finish', d.resolve);
    writeHtmlLaunch(out, data);
    out.end();
    return d.promise;
}

function createDeferred() {
    let d;
    let p = new Promise((resolve, reject) => d = { resolve, reject });
    d.promise = p;
    return d;
}

async function ensureFolderCreated(folderpath) {
    try {
        await mkdirAsync(folderpath);
    }
    catch (err) {
        if (err.code === 'EEXIST') return;
        if (err.code === 'ENOENT') {
            await ensureFolderCreated(path.dirname(folderpath));
            await mkdirAsync(folderpath);
            return;
        }
        throw err;
    }
}

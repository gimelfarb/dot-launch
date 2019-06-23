const path = require('path');
const { createLaunchFile } = require('./create');

module.exports = {
    execAsync,
};

async function execAsync(...args) {
    const { filepath, flags } = processArgs(args);
    const data = createLaunchData(filepath, flags);
    await createLaunchFile(filepath, data);
}

function processArgs(args) {
    let filepath = '.launch/app.html';
    const flags = {};

    for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (arg[0] === '-') {
            const flagname = arg[1] === '-' ? arg.substring(2) : arg.substring(1);
            if (i < args.length - 1 && args[i + 1][0] !== '-') {
                flags[flagname] = args[i + 1];
                ++i;
            } else {
                flags[flagname] = true;
            }
        } else {
            filepath = getFilePath(arg);
            break;
        }
    }

    return { filepath, flags };
}

function getFilePath(name) {
    name = name || 'app';
    if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
        return name;
    }
    if (name.indexOf('.') >= 0) {
        return `.launch/${name}`;
    }
    return `.launch/${name}.html`;
}

function createLaunchData(filepath, flags) {
    const ext = path.extname(filepath);
    if (ext === '.html' || ext === '.htm') {
        const url = flags['url'] || process.env.URL;
        if (!url) throw new Error('Expected --url on command-line or URL env variable');
        return { url };
    } else {
        throw new Error(`Unsupported file type: ${ext}`);
    }
}

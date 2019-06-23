const { execAsync } = require('./cli');
const { createLaunchFile } = require('./create');

module.exports = {
    createLaunchFile,
    cli: execAsync
};

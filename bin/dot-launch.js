#!/usr/bin/env node
const { cli } = require('../src');
const args = process.argv.slice(2);
cli(...args).catch(err => {
    console.error('dot-launch err: ', err);
    process.exit(-1);
});

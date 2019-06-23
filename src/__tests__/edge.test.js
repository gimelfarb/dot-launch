const { writeHtmlLaunch } = require('../html');
const stream = require('stream');

describe('edge', () => {
    describe('writeHtmlLaunch()', () => {
        test('default data', async () => {
            const out = createStringWriteable();
            writeHtmlLaunch(out);
            await streamClose(out);
            expect(out.toString()).toMatch('about:blank');
        });
        test('default url', async () => {
            const out = createStringWriteable();
            writeHtmlLaunch(out);
            await streamClose(out);
            expect(out.toString()).toMatch('about:blank');
        });
    });
});

async function streamClose(out) {
    const d = createDeferred();
    out.once('error', d.reject);
    out.once('finish', d.resolve);
    out.end();
    return d.promise;
}

function createStringWriteable() {
    let str = '';
    const out = new stream.Writable({
        write(chunk, _encoding, cb) {
            str += chunk.toString();
            cb();
        }
    });
    out.toString = () => str;
    return out;
}

function createDeferred() {
    let d;
    let p = new Promise((resolve, reject) => d = { resolve, reject });
    d.promise = p;
    return d;
}

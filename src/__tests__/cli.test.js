const { cli } = require('..');
const mockedEnv = require('mocked-env');
const mockFs = require('mock-fs');
const fs = require('fs');

async function fileExists(filepath) {
    return new Promise((resolve) => {
        fs.exists(filepath, resolve);
    });
}

async function fileAsString(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            err ? reject(err) : resolve(data.toString());
        });
    });
}

describe('cli', () => {
    beforeEach(() => {
        mockFs();
    });
    afterEach(() => {
        mockFs.restore();
    });
    test('Fail with no URL', async () => {
        await expect(cli()).rejects.toThrow('Expected --url');
    });
    describe('env', () => {
        let restoreEnv;
        const targetUrl = 'http://127.0.0.1:35789/';
        beforeAll(() => {
            restoreEnv = mockedEnv({ URL: targetUrl });
        });
        afterAll(() => {
            restoreEnv();
        });
        test('Fail with invalid filepath', async () => {
            mockFs({ './existing-file': '' });
            await expect(cli('./existing-file/app.html')).rejects.toThrow();
        });
        test('Fail when file access denied', async () => {
            mockFs({ './app.html': mockFs.file({ mode: 0 }) });
            await expect(cli('./app.html')).rejects.toThrow('permission');
        });
        test('Fail when folder access denied', async () => {
            mockFs({ './launch': mockFs.directory({ mode: 0 }) });
            await expect(cli('./launch/subdir/app.html')).rejects.toThrow('permission');
        });
        test.each([
            ['', '.launch/app.html'],
            ['frontend', '.launch/frontend.html'],
            ['./launch.html', './launch.html'],
            ['./abc/def/app.html', './abc/def/app.html']
        ])('dot-launch %s', async (arg, outfile) => {
            expect(await fileExists(outfile)).toBe(false);
            await (arg ? cli(arg) : cli());
            expect(await fileExists(outfile)).toBe(true);
            expect(await fileAsString(outfile)).toMatch(targetUrl);
        });
    });
    describe('args', () => {
        const targetUrl = 'http://127.0.0.1:63781/';
        test.each([
            ['--url', ['--url', targetUrl], '.launch/app.html'],
            ['--unsupported', ['--unsupported', '-x', '--url', targetUrl], '.launch/app.html'],
            ['--url file', ['--url', targetUrl, 'frontend.htm'], '.launch/frontend.htm'],
            ['--url \'\'', ['--url', targetUrl, ''], '.launch/app.html']
        ])('dot-launch %s', async (_name, cliArgs, outfile) => {
            expect(await fileExists(outfile)).toBe(false);
            await cli(...cliArgs);
            expect(await fileExists(outfile)).toBe(true);
            expect(await fileAsString(outfile)).toMatch(targetUrl);
        });

        test('dot-launch --url file.unknown', async () => {
            expect(cli('--url', targetUrl, 'frontend.xml')).rejects.toThrow('Unsupported');
        });
    });
});
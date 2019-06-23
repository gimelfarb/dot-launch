module.exports = {
    writeHtmlLaunch,
};

function writeHtmlLaunch(out, data) {
    let { url } = data || {};
    url = url || 'about:blank';
    const html = 
`<!DOCTYPE html>
<html>
    <head>
        <title>Redirecting...</title>
        <meta http-equiv="refresh" content="0;url=${url}">
        <script>window.location.replace("${url}");</script>
    </head>
    <body>
        Redirecting <a href="${url}">here</a> ...
    </body>
</html>
`;

    out.write(html);
}
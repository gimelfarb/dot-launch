# dot-launch 
[![Build Status][travis-badge]][travis-href] [![Coverage Status][codecov-badge]][codecov-href] [![Semantic Versioning][semrel-badge]][semrel-href]

[travis-href]: https://travis-ci.org/gimelfarb/dot-launch
[codecov-href]: https://codecov.io/gh/gimelfarb/dot-launch
[semrel-href]: https://github.com/semantic-release/semantic-release

[travis-badge]: https://img.shields.io/travis/gimelfarb/dot-launch/master.svg
[codecov-badge]: https://img.shields.io/codecov/c/gh/gimelfarb/dot-launch.svg
[semrel-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

Creates an HTML launch file to redirect to app URL. Used in a development workflow when URL is dynamic and is generated at run-time (i.e. exposed via random port, or via docker-compose).

Checkout examples below to explore how `dot-launch` is intended to be used.

## Getting Started

### Installation

At a minimum, install the package:

```bash
$ npm i --save-dev dot-launch
```

### Usage

Use it from command-line to create a launch file:

```bash
# Set URL via environment
$ export URL=http://127.0.0.1:35789/
# Create: .launch/app.html
$ dot-launch
# Create: .launch/frontend.html
$ dot-launch frontend
# Create: ./launch.html
$ dot-launch ./launch.html
# Set URL via command-line switch
$ dot-launch --url=http://127.0.0.1:35789/
```

## Examples

### Debugging React app on random port with Visual Studio Code

We will setup a debugging experience for a React front-end app, running on a randomly chosen available port.

Let's set it up and open Visual Studio Code:

```bash
$ npx create-react-app dot-launch-cra-debug --use-npm
$ cd dot-launch-cra-debug
$ npm i -D dot-launch envex
$ code .
```

We will utilise [`envex`](https://github.com/gimelfarb/envex) utility to setup and control environment variables. Create a `.envexrc.json` configuration file:

```js
// File: .envexrc.json
{
    "profiles": {
        "npm:start": {
            "env": {
                // Selecting a random free available port, which will
                // be passed down to 'react-scripts start'
                "PORT": "$(npx -q get-port-cli)",
                "BROWSER": "none"
            }
        },
        "npm:start:port": {
            "env": {
                // Passing the dynamic URL to dot-launch using the selected
                // PORT value - this will get written to .launch/app.html
                "URL": "http://localhost:${PORT}/"
            }
        }
    }
}
```

Modify `package.json` scripts:

```js
// File: package.json
{
    "scripts": {
        // This will setup PORT env variable, and then run 'start:port' script,
        // which will first invoke dot-launch to generate .launch/app.html (with
        // selected PORT value in the URL), and then proceed to react-scripts start
        "start": "envex npm run start:port",
        "start:port": "envex dot-launch && react-scripts start",
    }
}
```

Don't forget to add `.launch` folder to your `.gitignore` file!

Finally, you can start frontend locally via:

```bash
$ npm start
```

To debug in Visual Studio Code, we add the following launch configuration:

```json
// File: .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Frontend",
            "file": "${workspaceFolder}/.launch/app.html",
            "webRoot": "${workspaceFolder}"
        },
    ]
}
```

Now, when you press F5, VSCode will launch Chrome and redirect to the running app URL (whichever port it is running under).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](../../tags). 

## Authors

* **Lev Gimelfarb** - *Initial work* - [@gimelfarb](https://github.com/gimelfarb)

See also the list of [contributors](https://github.com/gimelfarb/html-fiddle/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [html-redirect](https://github.com/eush77/html-redirect) - Inspiration for the launch HTML page contents

Also, thanks [@PurpleBooth](https://github.com/PurpleBooth), for the [README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) you created for all of us to use!

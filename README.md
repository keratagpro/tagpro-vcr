# TagPro VCR

*Note*: This project was originally developed by [Kera](https://github.com/keratagpro/tagpro-vcr) but that user seems to have gone dark,
with no response to pull requests or private messages. Development continues here, with hopes of merging with the original at some point in
the future.

## Usage

1.  Install the userscript: [tagpro-vcr.user.js](https://bash-tp.github.io/tagpro-vcr/tagpro-vcr.user.js).

2.  Play a game of [TagPro](http://tagpro.gg).

3.  Upload the recording to the VCR: https://bash-tp.github.io/tagpro-vcr

## Technical Info

The userscript records WebSocket messages coming from the server and stores them with timestamps
into a newline-delimited JSON file. More specifically, every line is an array consisting of a timestamp, the event name and event data.
For example, this is an event for playing the burst sound at 14.52s:

```json
[14520, "sound", { "s": "burst", "v": 1 }]
```

The VCR webpage runs the original game client code (`global-game.js`), but replaces the socket.io library with a "fake socket" that replays the recorded events.

## Development

*   Install lerna globally: `npm install --global lerna`
*   Run `lerna bootstrap` (runs `npm install` in sub-packages)
*   Run `lerna run build` (runs `npm run build` in sub-packages)

To automatically recompile when source files change, `cd` to sub-package directories and run `npm run watch`.
To test the webpage component, `cd webpage` and run `npm run test` to start a webserver on `http://localhost:8080`.

Settings for Visual Studio Code are included in the source tree. If you're using VS Code, the `TSLint` and `es6-string-html` plugins are recommended.

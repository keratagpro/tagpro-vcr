# TagPro VCR

## Usage

1.  Install the userscript: [tagpro-vcr.user.js](https://keratagpro.github.io/tagpro-vcr/tagpro-vcr.user.js).

2.  Play a game of [TagPro](http://tagpro.gg).

3.  Upload the recording to the VCR: https://keratagpro.github.io/tagpro-vcr

## Technical Info

The userscript records WebSocket messages coming from the server and stores them with timestamps
into a newline-delimited JSON file. More specifically, every line is an array consisting of a timestamp, the event name and event data.
For example, this is an event for playing the burst sound at 14.52s:

```json
[14520, "sound", { "s": "burst", "v": 1 }]
```

The VCR webpage runs the original game client code (`global-game.js`), but replaces the socket.io library with a "fake socket" that replays the recorded events.

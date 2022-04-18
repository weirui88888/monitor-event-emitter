# EventEmitter ![language-typescript](https://img.shields.io/badge/typescript-blue?style=flat&logo=typescript&logoColor=white) [![codecov](https://codecov.io/gh/weirui88888/pretty-event-emitter/branch/master/graph/badge.svg?token=T9PAH7EJN1)](https://codecov.io/gh/weirui88888/pretty-event-emitter)

## Install

```javascript
npm i -S pretty-event-emitter
```

## Usage

```javascript
import PrettyEventEmitter from "pretty-event-emitter"

const eventsBus = new PrettyEventEmitter()

eventsBus.on("download", (status) => console.log(status))

eventsBus.emit("download", true)

eventsBus.off("download")

eventsBus.watch() // monitor the operation of all registered processors
```

## Contributing

[issue](https://github.com/weirui88888/pretty-event-emitter/issues)
[pr](https://github.com/weirui88888/pretty-event-emitter/pulls)

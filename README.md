# calc-monaco-editor

A browser based editor for a simple DSL to perform calculations.

It shows how to integrate ANTLR with monaco.

This is the companion repository to this ARTICLE

SCREENSHOT

## Generating the lexer and the parser

```
./gradlew generateParser
```

## Build everything and run the server

```
npm install
./gradlew generateParser
tsc
webpack
cd server
./gradlew runServer
```

Now visit http://localhost:8888

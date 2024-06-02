## Introduction to Node.js: basic concepts and principles of work Installing and configuring the development environment to work with Node.js

### Task

Configure a Node.js project that can be launched using the `npm start` script. The application should read a command-line argument called `--name`. If this argument is not present in the command line, `NAME` should be taken from a `.env` file. If such a file is not present, then the `name` should be set to `"unknown user"`. The application should output a message to the console saying `"Hello ${name}!"`.

### How to test

Rename [`.env.example`](.env.example) into `.env` or create your own file for testing. 
If you want to run the tests locally run `npm install jest -D` for installing dependencies after that run `npx jest` for running tests.


### Run project
```
npm i
npm start
```

### Test project (Jest)
```
npm test
```
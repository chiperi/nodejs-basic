# Node.js Practical

## Asynchronous programming in Node.js: code with callbacks
### Task
Write the programm for reading files in directory [`./files`](./files/) (use function `fs.readdir`). Each file contains strings of text or numbers.
The program must find all the numbers in all the files, calculate their sum and display the result on the screen. File names and their formats can be different, so the program must read all files with formats `.txt`, `.csv`, `.json` and `.xml` in the directory (use function `fs.readFile(file, "utf8", callback)` for reading files).

If no numbers are found in any file, or if no directory or files are found, the program should display a message `No numbers for calculating`.

### Example
For example, if the `./files` directory contains four files `file1.txt`, `file2.csv`, `file3.json`, and `file4.xml` that have the following content:

```
file1.txt:
foo
bar
123
456
baz

file2.csv:
hello,world,789,321

file3.json:
{
  "name": "John",
  "age": 30,
  "city": "New York"
}

file4.xml:
<root>
  <string>hello</string>
  <number>123</number>
  <string>world</string>
  <number>456</number>
  <string>foo</string>
</root>
```

The program should process the files and display the following message on the screen:
`The sum of the numbers in the files: 2298`

### Note
For correct tests passing use only `console.log()` for printing of the results or error message, and delete needless calls of `console.log()` in your code.

Do not use synchronous functions (like `readFileSync`, `readdirSync` or `existsSync`)  from`fs`
### How to run and test
`npm start` to run you `app.js` file or simple `node app.js`.
In order to run tests localy before autograding on GitHub, use the command `npm install` for installing dependencies and `npm test` for the tests running. Please do not modify any files in the [tests](./tests/) directory.

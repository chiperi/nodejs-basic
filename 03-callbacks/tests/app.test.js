const filesDir = "./files";
const path = require("path");

let fs;
describe("app.js", () => {
  beforeEach(() => {
    fs = require("fs");
    jest.mock("fs");
  });
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("should call fs.readdir with correct arguments", (done) => {
    readdirSpy = jest.spyOn(fs, "readdir");
    require("../app");
    expect(readdirSpy).toHaveBeenCalledWith(filesDir, expect.any(Function));
    done();
  });

  it("should call fs.readFile with correct arguments", async () => {
    const file = "file1.txt";
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, [file]);
    });
    const readFileMock = jest.spyOn(fs, "readFile");
    require("../app");
    const filePath = path.join(filesDir, file);
    await new Promise((r) => setTimeout(r, 500));
    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(readFileMock).toHaveBeenCalledWith(
      filePath,
      "utf8",
      expect.any(Function)
    );
  });

  it("should call fs.readFile 2 times", async () => {
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, ["file1.txt", "file2.json"]);
    });
    fs.readFile.mockImplementationOnce(async (path, options, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, "");
    });
    const readFileMock = jest.spyOn(fs, "readFile");
    require("../app");
    await new Promise((r) => setTimeout(r, 500));
    expect(readFileMock).toHaveBeenCalledTimes(2);
  });

  it("should call fs.readFile 3 times", async () => {
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, ["file1.txt", "file2.txt", "file3.txt"]);
    });
    fs.readFile.mockImplementation(async (path, options, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, "");
    });
    const readFileMock = jest.spyOn(fs, "readFile");
    require("../app");
    await new Promise((r) => setTimeout(r, 500));
    expect(readFileMock).toHaveBeenCalledTimes(3);
  });

  it("should call fs.readFileSync 0 times", async () => {
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, ["file1.txt", "file2.txt", "file3.txt"]);
    });
    const readFileSyncMock = jest.spyOn(fs, "readFileSync");
    require("../app");
    await new Promise((r) => setTimeout(r, 500));
    expect(readFileSyncMock).toHaveBeenCalledTimes(0);
  });

  it("should call fs.readdirSync 0 times", async () => {
    const readdirSyncMock = jest.spyOn(fs, "readdirSync");
    require("../app");
    expect(readdirSyncMock).toHaveBeenCalledTimes(0);
  });
  it("should call console.log with sum of numbers when numbers exist in one file", async () => {
    const files = ["file1.txt", "file2.json"];
    const randomNum1 = Math.floor(Math.random() * 100) + 1;
    const randomNum2 = Math.floor(Math.random() * 100) + 1;
    const consoleLogMock = jest.spyOn(console, "log");
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, files);
    });

    fs.readFile.mockImplementation(async (filePath, options, cb) => {
      await new Promise((r) => setTimeout(r, 100));
      if (filePath === path.join(filesDir, files[0]))
        cb(null, `a,hkhl ${randomNum1}, ${randomNum2}, c`);
      if (filePath === path.join(filesDir, files[1]))
        cb(null, `{"age": "sixteen", "name": "Tom"}`);
    });
    require("../app");
    await new Promise((r) => setTimeout(r, 500));
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      `The sum of the numbers in the files: ${randomNum1 + randomNum2}`
    );
  });
  it("should call console.log with sum of numbers when numbers exist in all files", async () => {
    const files = ["file1.txt", "file2.csv", "file3.json", "file4.xml"];
    const randomNum1 = Math.floor(Math.random() * 100) + 1;
    const randomNum2 = Math.floor(Math.random() * 100) + 1;
    const consoleLogMock = jest.spyOn(console, "log");
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, files);
    });
    fs.readFile.mockImplementation(async (filePath, options, cb) => {
      await new Promise((r) => setTimeout(r, 100));
      if (filePath === path.join(filesDir, files[0]))
        cb(null, `a,hkhl 24, ${randomNum1}, c`);
      if (filePath === path.join(filesDir, files[1]))
        cb(null, `h, w,76,${randomNum2}`);
      if (filePath === path.join(filesDir, files[2]))
        cb(null, `{"age": 45, "name": "Tom"}`);
      if (filePath === path.join(filesDir, files[3]))
        cb(null, `<root><string>hello</string><number>125</number></root>`);
    });
    require("../app");
    await new Promise((r) => setTimeout(r, 700));
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      `The sum of the numbers in the files: ${270 + randomNum1 + randomNum2}`
    );
  });
  it("should call console.log 'No numbers for calculating' when directory ./files not exist", async () => {
    const consoleLogMock = jest.spyOn(console, "log");
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      if (path === filesDir) {
        const error = new Error("ENOENT");
        error.code = "ENOENT";
        callback(error);
      }
    });
    require("../app");
    await new Promise((r) => setTimeout(r, 500));
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith("No numbers for calculating");
  });
  it("should call console.log 'No numbers for calculating' when no files in ./files exist", async () => {
    const consoleLogMock = jest.spyOn(console, "log");
    fs.readdir.mockImplementationOnce(async (path, callback) => {
      await new Promise((r) => setTimeout(r, 100));
      callback(null, []);
    });
    require("../app");
    await new Promise((r) => setTimeout(r, 500));
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith("No numbers for calculating");
  });
});


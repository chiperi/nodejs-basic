const { execSync } = require("child_process");
const fs = require("fs");

describe("app", () => {
  beforeEach(() => {
    if (fs.existsSync(".env")) {
      fs.unlinkSync(".env");
    }
  });

  it('should output "Hello unknown user!" if --name argument and .env file are not present', () => {
    const output = execSync("npm start").toString();
    expect(output).toContain("Hello unknown user!");
  });

  it('should output "Hello User-from-parameters!" if --name is present', () => {
    const output = execSync(
      "npm start -- --name User-from-parameters"
    ).toString();
    expect(output).toContain("Hello User-from-parameters!");
  });

  it('should output "Hello User-from-dotenv!" if --name argument is not present, but .env file is present', () => {
    fs.writeFileSync(".env", "NAME=User-from-dotenv");
    const output = execSync("npm start").toString();
    expect(output).toContain("Hello User-from-dotenv!");
  });

  it('should output "Hello User-from-parameters!" if --name argument is present and .env file is present', () => {
    fs.writeFileSync(".env", "NAME=User-from-dotenv");
    const output = execSync("npm start -- --name User-from-parameters").toString();
    expect(output).toContain("Hello User-from-parameters!");
  });

  it('should output "Hello User-from-dotenv2!" if --notname argument is present and .env file is present', () => {
    fs.writeFileSync(".env", "NAME=User-from-dotenv2");
    const output = execSync("npm start -- --notname User-from-parameters").toString();
    expect(output).toContain("Hello User-from-dotenv2!");
  });

  it('should output "Hello unknown user!" if --notname argument is present and .env file is not present', () => {
    const output = execSync("npm start -- --notname User-from-parameters").toString();
    expect(output).toContain("Hello unknown user!");
  });

  it('should output "Hello User-from-parameters2!" if --name argument is present and --notname argument is present too', () => {
    const output = execSync("npm start -- --notname User-from-parameters --name User-from-parameters2").toString();
    expect(output).toContain("Hello User-from-parameters2!");
  });
});

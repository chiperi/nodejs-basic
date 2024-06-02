require("dotenv").config();

const nameFlagIndex = process.argv.indexOf("--name");
const nameArg = nameFlagIndex > -1 && process.argv[nameFlagIndex + 1] 
    ? process.argv[nameFlagIndex + 1] 
    : process.env.NAME 
    ? process.env.NAME 
    : "unknown user";

console.log(`Hello ${nameArg}!`);
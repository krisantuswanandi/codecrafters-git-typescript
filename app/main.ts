import * as fs from "fs";
import zlib from "zlib";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
  Init = "init",
  CatFile = "cat-file",
}

switch (command) {
  case Commands.Init:
    fs.mkdirSync(".git", { recursive: true });
    fs.mkdirSync(".git/objects", { recursive: true });
    fs.mkdirSync(".git/refs", { recursive: true });
    fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
    console.log("Initialized git directory");
    break;
  case Commands.CatFile:
    const hash = args[2];
    const dir = hash.substring(0, 2);
    const file = hash.substring(2);
    const blob = fs.readFileSync(`.git/objects/${dir}/${file}`);
    const buff = zlib.unzipSync(blob);
    const data = buff.toString();
    const [_, content] = data.split("\0");
    process.stdout.write(content);
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

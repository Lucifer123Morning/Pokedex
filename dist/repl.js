import { createInterface } from "readline";
import * as fs from "fs";
import { getCommands } from "./command_exit.js";
export function cleanInput(input) {
    return input
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((word) => word !== "");
}
export function startREPL() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "pokedex > ",
    });
    // Подготовка файла лога
    const logFile = "repl.log";
    try {
        fs.writeFileSync(logFile, "", "utf8"); // создаём или очищаем файл
    }
    catch { }
    // Получаем реестр команд
    const commands = getCommands();
    rl.prompt();
    rl.on("line", async (input) => {
        const words = cleanInput(input);
        if (words.length === 0) {
            rl.prompt();
            return;
        }
        const commandName = words[0];
        const cmd = commands[commandName];
        if (!cmd) {
            console.log(`Unknown command: ${commandName}`);
            try {
                fs.appendFileSync(logFile, `Unknown command: ${commandName}\n`, "utf8");
            }
            catch { }
            rl.prompt();
            return;
        }
        // Выполняем колбэк команды
        try {
            cmd.callback(commands);
        }
        catch (err) {
            const msg = `Error running command "${commandName}": ${err.stack || err.message}\n`;
            console.error(msg);
            try {
                fs.appendFileSync(logFile, msg, "utf8");
            }
            catch { }
        }
        rl.prompt(); // продолжаем работу REPL
    });
    rl.on("close", () => {
        process.exit(0);
    });
}

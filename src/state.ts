import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js";
import type { CLICommand } from "./command.js";

// Новый тип State
export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
};

// Инициализация состояния
export function initState(): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex > ",
    });

    const commands: Record<string, CLICommand> = getCommands();

    return { rl, commands };
}
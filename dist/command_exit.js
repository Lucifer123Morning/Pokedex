// -----------------
// Колбэк команды exit
// -----------------
export function commandExit(_commands) {
    console.log("Closing the Pokedex... Goodbye!");
    process.exit(0);
}
// -----------------
// Колбэк команды help
// -----------------
export function commandHelp(commands) {
    console.log("Welcome to the Pokedex!");
    console.log("Usage:");
    console.log(""); // пустая строка перед списком команд
    for (const key of Object.keys(commands)) {
        const cmd = commands[key];
        console.log(`${cmd.name}: ${cmd.description}`);
    }
}
// -----------------
// Функция для получения реестра команд
// -----------------
export function getCommands() {
    return {
        help: {
            name: "help",
            description: "Displays a help message",
            callback: commandHelp,
        },
        exit: {
            name: "exit",
            description: "Exit the Pokedex",
            callback: commandExit,
        },
        // здесь можно добавлять другие команды
    };
}

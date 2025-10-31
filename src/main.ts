import { initState } from "./state.js";
import { startREPL } from "./repl.js";

const state = initState();
startREPL(state); // передаём state

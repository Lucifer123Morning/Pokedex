import { commandExplore } from "./command_explore";
class InMemoryCache {
    m = new Map();
    get(k) {
        return this.m.get(k);
    }
    add(k, v) {
        this.m.set(k, v);
    }
}
describe("commandExplore", () => {
    const area = "pastoria-city-area";
    const apiResponse = {
        pokemon_encounters: [
            { pokemon: { name: "tentacool" } },
            { pokemon: { name: "tentacruel" } },
            { pokemon: { name: "magikarp" } },
        ],
    };
    let origFetch;
    beforeEach(() => {
        origFetch = global.fetch;
    });
    afterEach(() => {
        global.fetch = origFetch;
        jest.restoreAllMocks();
    });
    test("fetches and caches pokemon names, then reads from cache on second call", async () => {
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => apiResponse,
            status: 200,
            statusText: "OK",
        });
        global.fetch = fetchMock;
        const outputs = [];
        const state = {
            print: (s) => outputs.push(String(s)),
            write: (s) => outputs.push(String(s)),
            log: (s) => outputs.push(String(s)),
            commands: {},
            readline: {},
            pokeAPI: {},
            cache: new InMemoryCache(),
        };
        await commandExplore(state, area);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(outputs).toContain(`Exploring ${area}...`);
        expect(outputs).toContain("Found Pokemon:");
        expect(outputs).toContain(" - tentacool");
        expect(outputs).toContain(" - tentacruel");
        expect(outputs).toContain(" - magikarp");
        outputs.length = 0;
        // second call: ensure fetch not called again and results come from cache
        await commandExplore(state, area);
        expect(fetchMock).toHaveBeenCalledTimes(1); // still one
        expect(outputs).toContain(`Exploring ${area}...`);
        expect(outputs).toContain("Found Pokemon:");
        expect(outputs).toContain(" - tentacool");
    });
    test("prints usage when no args", async () => {
        const outputs = [];
        const state = {
            print: (s) => outputs.push(String(s)),
            write: (s) => outputs.push(String(s)),
            log: (s) => outputs.push(String(s)),
            commands: {},
            readline: {},
            pokeAPI: {},
            cache: new InMemoryCache(),
        };
        await commandExplore(state);
        expect(outputs).toContain("Usage: explore <area_name>");
    });
});

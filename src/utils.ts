export namespace utils {
    export function shuffleArray<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    export function valueWithDefault<T>(value: T | undefined | null, defaultValue: T): T {
        return value ?? defaultValue;
    }
}

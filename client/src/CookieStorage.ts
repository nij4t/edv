
export class CookieStorage implements Storage {
    private ttl: number
    /**
     * @param ttl - Time in minutes after value will be cleared
     */
    constructor(ttl = 5) {
        this.ttl = ttl
    }

    [name: string]: any;
    length: number;

    clear(): void {
        throw new Error("Method not implemented.");
    }

    getItem(key: string): string {
        var name = key + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    key(index: number): string {
        throw new Error("Method not implemented.");
    }

    removeItem(key: string): void {
        this.set(key, "", new Date(0))
    }

    setItem(key: string, value: string): void {
        const ttl = new Date()
        ttl.setTime(ttl.getTime() + this.ttl * 1000 * 60)
        this.set(key, value, ttl);
    }

    private set(key: string, value: string, expiresAt: Date) {
        document.cookie = `${key}=${value};expires=${expiresAt.toUTCString()};path=/`
    }
}

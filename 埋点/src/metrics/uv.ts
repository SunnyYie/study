export class UVTracker {
    private static instance: UVTracker;
    private uniqueVisitors: Set<string>;

    private constructor() {
        this.uniqueVisitors = new Set<string>();
    }

    public static getInstance(): UVTracker {
        if (!UVTracker.instance) {
            UVTracker.instance = new UVTracker();
        }
        return UVTracker.instance;
    }

    public trackUV(userId: string): void {
        this.uniqueVisitors.add(userId);
    }

    public getUVCount(): number {
        return this.uniqueVisitors.size;
    }
}
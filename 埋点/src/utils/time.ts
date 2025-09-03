export function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString();
}

export function calculateTimeDifference(start: number, end: number): number {
    return end - start;
}

export function getCurrentTimestamp(): number {
    return Date.now();
}
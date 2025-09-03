export function trackPV(page: string): void {
    const currentPV = getPV(page);
    setPV(page, currentPV + 1);
}

function getPV(page: string): number {
    const pvData = localStorage.getItem(`pv_${page}`);
    return pvData ? parseInt(pvData, 10) : 0;
}

function setPV(page: string, count: number): void {
    localStorage.setItem(`pv_${page}`, count.toString());
}
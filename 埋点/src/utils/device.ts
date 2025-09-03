export function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const isMobile = /Mobi|Android/i.test(userAgent);
    const isTablet = /Tablet|iPad/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
        userAgent,
        platform,
        isMobile,
        isTablet,
        isDesktop,
    };
}
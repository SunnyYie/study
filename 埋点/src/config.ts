export const config = {
    apiEndpoint: 'https://api.example.com/track', // API endpoint for sending tracking data
    sampleRate: 1, // Sampling rate for tracking events (1 means 100%)
    storageKey: 'tracking_data', // Key for storing tracking data in local storage
    userIdentifier: 'user_id', // Key for identifying users
    sessionTimeout: 30 * 60 * 1000, // Session timeout in milliseconds (30 minutes)
    trackBounceRate: true, // Enable or disable bounce rate tracking
    trackPageVisit: true, // Enable or disable page visit tracking
    trackDuration: true, // Enable or disable duration tracking
    trackSource: true, // Enable or disable source tracking
    trackUser: true, // Enable or disable user tracking
};
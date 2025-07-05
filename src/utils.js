export const YESTERDAY = new Date(Date.now() - 24 * 60 * 60 * 1000 + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
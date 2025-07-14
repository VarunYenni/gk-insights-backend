import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export function getYesterdayIST() {
    const now = new Date();
    const tz = 'Asia/Kolkata';
    const indiaNow = toZonedTime(now, tz);        // converts UTC → IST
    indiaNow.setDate(indiaNow.getDate() - 1);     // go back 1 day
    return formatInTimeZone(indiaNow, tz, 'yyyy-MM-dd');
}
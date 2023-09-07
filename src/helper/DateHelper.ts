/**
 * Convert timestamp to date string
 * 
 * @param serial  * Convert timestamp to date string
 * @returns date string,eg:2018-07-08
 */
export function formatDateFromSerial(serial: number): string {
    // Excel's base date is 1900-01-01, but it has a bug where it thinks 1900 is a leap year.
    // Hence, we adjust for that by subtracting 1 for dates after 1900-02-28 (60 in serial value)
    const baseDate = new Date(1900, 0, 1);
    if (serial <= 60) {
        // For dates on or before 1900-02-28
        baseDate.setDate(baseDate.getDate() + serial - 1);
    } else {
        // Adjust for the fact that Excel wrongly thinks 1900 is a leap year.
        baseDate.setDate(baseDate.getDate() + serial - 2);
    }

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;
    const date = baseDate.getDate();

    // Convert date to YYYY-MM-DD format
    return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
}


/**
 * Format date as string like 'yyyy-MM-dd'
 * 
 * @param date date
 * @returns Formatted date
 */
export function FormatDate_yyyyMMdd(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
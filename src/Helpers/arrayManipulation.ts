/**
 * Check if an string (needle) exists on array(haystack) 
 * @param {string} needle 
 * @param {Array<string>} haystack 
 * @returns {boolean}
 */
export function isStringOnArray(needle: string, haystack: Array<string>): boolean {
    if (haystack.includes(needle)) {
        return true;
    } else {
        return false;
    }
}
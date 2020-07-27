/**
 * ========================================
 * Helpers - Frequently Used common methods
 * ========================================
 */

// Native implementation for _.pick
export function pick(object, keys) {
    return keys.reduce((obj, key) => {
        if (object && object.hasOwnProperty(key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
}

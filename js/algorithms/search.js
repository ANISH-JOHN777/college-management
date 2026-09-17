/**
 * search.js
 * -----------------------------------------------------
 * ACADEMIC ALGORITHM: LINEAR SEARCH
 * 
 * Purpose:
 * Sequentially inspects each record in an array until a target match is found.
 * Used for searching Students, Faculty, and Courses by ID, Name, or code.
 * 
 * Logic:
 * 1. Start from the first record (index 0).
 * 2. Compare the target value with the current record's specified property key.
 * 3. If a match is found: return the matching record (and optionally index).
 * 4. Otherwise: continue sequentially to the next record.
 * 5. If the entire array is checked and no match is found: return null.
 * 
 * TIME COMPLEXITY:
 * - Best Case: O(1) [Target found at the first position index 0]
 * - Average Case: O(n) [Target found near the middle on average]
 * - Worst Case: O(n) [Target at the last position or not present at all]
 * 
 * SPACE COMPLEXITY:
 * - O(1) Auxiliary Space [Iterative search requires constant extra memory]
 * -----------------------------------------------------
 */

/**
 * Executes a manual Linear Search on an array of objects.
 * 
 * @param {Array<Object>} array - List of items (e.g. students, faculty, courses)
 * @param {string|number} target - Value to search for
 * @param {string} key - Object key property to inspect (e.g. 'id', 'name', 'courseId')
 * @param {boolean} [exactMatch=false] - If true, enforces exact string equality; if false, substring match
 * @returns {Object|null} Matching object or null if not found
 */
export function linearSearch(array, target, key, exactMatch = false) {
    if (!Array.isArray(array) || array.length === 0 || target === undefined || target === null) {
        return null;
    }

    const searchTarget = String(target).trim().toLowerCase();

    // Iterate sequentially through every record in the array
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (!item || item[key] === undefined) continue;

        const val = String(item[key]).trim().toLowerCase();

        if (exactMatch) {
            if (val === searchTarget) {
                return item; // Best/Average/Worst case match returned
            }
        } else {
            if (val.includes(searchTarget) || searchTarget.includes(val)) {
                return item;
            }
        }
    }

    return null; // Target not found after checking all n elements
}

/**
 * Executes a manual Linear Search returning all matching elements (for filtered lists).
 * 
 * @param {Array<Object>} array - Input array
 * @param {string} query - Search term
 * @param {Array<string>} keys - Keys to inspect
 * @returns {Array<Object>} Filtered list matching query
 */
export function linearSearchAll(array, query, keys = ['id', 'name']) {
    if (!Array.isArray(array)) return [];
    if (!query || String(query).trim() === "") return [...array];

    const searchTarget = String(query).trim().toLowerCase();
    const results = [];

    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        let isMatch = false;

        for (let k = 0; k < keys.length; k++) {
            const key = keys[k];
            if (item[key] !== undefined && String(item[key]).toLowerCase().includes(searchTarget)) {
                isMatch = true;
                break;
            }
        }

        if (isMatch) {
            results.push(item);
        }
    }

    return results;
}

/**
 * Checks duplicate membership using linear traversal.
 * 
 * Time Complexity: Worst Case O(n)
 * Space Complexity: O(1)
 * 
 * @param {Array<string>} list - Array of strings/IDs
 * @param {string} targetId - Target ID to check
 * @returns {boolean} True if exists, false otherwise
 */
export function linearMembershipCheck(list, targetId) {
    if (!Array.isArray(list)) return false;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === targetId) {
            return true; // Match found
        }
    }
    return false;
}

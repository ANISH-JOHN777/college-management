/**
 * sort.js
 * -----------------------------------------------------
 * ACADEMIC ALGORITHM: INSERTION SORT
 * 
 * Purpose:
 * Sorts records in-place alphabetically or numerically by a target property key.
 * Primary academic use case: Sorting Students alphabetically by Name.
 * 
 * IMPORTANT ACADEMIC DIRECTIVE:
 * - DO NOT use Array.prototype.sort().
 * - Manually implemented using nested loops.
 * 
 * Logic:
 * 1. Iterate from index 1 to n - 1 (considering index 0 as sorted sub-array).
 * 2. Pick the current element (key/current item) to be inserted into the sorted part.
 * 3. Compare the current element with elements in the sorted sub-array (from right to left).
 * 4. Shift all elements greater than key one position to the right.
 * 5. Insert key into its correct sorted position.
 * 
 * TIME COMPLEXITY:
 * - Best Case: O(n) [Array is already sorted; inner loop condition fails immediately]
 * - Average Case: O(n²) [Randomly ordered array requires n^2/4 comparisons/shifts]
 * - Worst Case: O(n²) [Array is reverse sorted; requires max shifts]
 * 
 * SPACE COMPLEXITY:
 * - O(1) Auxiliary Space [In-place sorting algorithm, no extra arrays allocated]
 * -----------------------------------------------------
 */

/**
 * Executes a manual Insertion Sort on an array of objects by property key.
 * Modifies the array in-place and returns it.
 * 
 * @param {Array<Object>} array - Input array of objects (e.g., Student instances)
 * @param {string} key - Property key to sort by (e.g. 'name')
 * @param {boolean} [ascending=true] - Sort direction (true for A-Z, false for Z-A)
 * @returns {Array<Object>} Sorted array reference
 */
export function insertionSort(array, key = 'name', ascending = true) {
    if (!Array.isArray(array) || array.length <= 1) {
        return array;
    }

    const n = array.length;

    // Start from the second element (index 1) up to index n - 1
    for (let i = 1; i < n; i++) {
        const currentItem = array[i];
        const currentValue = String(currentItem[key] || '').toLowerCase();

        let j = i - 1;

        // Shift elements of array[0..i-1] that are greater/smaller than currentValue
        while (j >= 0) {
            const comparisonValue = String(array[j][key] || '').toLowerCase();

            let shouldShift = false;
            if (ascending) {
                // For ascending order: shift if comparisonValue > currentValue
                shouldShift = comparisonValue.localeCompare(currentValue) > 0;
            } else {
                // For descending order: shift if comparisonValue < currentValue
                shouldShift = comparisonValue.localeCompare(currentValue) < 0;
            }

            if (shouldShift) {
                array[j + 1] = array[j]; // Shift element to the right
                j = j - 1;
            } else {
                break; // Position found
            }
        }

        // Place currentItem into its correct sorted position
        array[j + 1] = currentItem;
    }

    return array;
}

/**
 * Returns a detailed step-by-step trace of Insertion Sort for visualization.
 * Useful for the Algorithm Lab UI section to visually demonstrate item shifts!
 * 
 * @param {Array<string>} list - Simple array of strings (e.g., student names)
 * @returns {Array<Object>} Array of step snapshots { step, arrayState, highlightedIndices, description }
 */
export function getInsertionSortSteps(list) {
    const arr = [...list];
    const steps = [];

    steps.push({
        step: 0,
        arrayState: [...arr],
        highlightedIndices: [],
        description: "Initial unsorted array state."
    });

    let stepCount = 1;
    for (let i = 1; i < arr.length; i++) {
        const keyVal = arr[i];
        let j = i - 1;

        steps.push({
            step: stepCount++,
            arrayState: [...arr],
            highlightedIndices: [i],
            description: `Selecting item '${keyVal}' at index ${i} to insert into sorted sub-array.`
        });

        while (j >= 0 && arr[j].toLowerCase().localeCompare(keyVal.toLowerCase()) > 0) {
            arr[j + 1] = arr[j];

            steps.push({
                step: stepCount++,
                arrayState: [...arr],
                highlightedIndices: [j, j + 1],
                description: `Shifted '${arr[j]}' right from index ${j} to index ${j + 1} (since '${arr[j]}' > '${keyVal}').`
            });

            j--;
        }

        arr[j + 1] = keyVal;

        steps.push({
            step: stepCount++,
            arrayState: [...arr],
            highlightedIndices: [j + 1],
            description: `Inserted '${keyVal}' into sorted position index ${j + 1}.`
        });
    }

    steps.push({
        step: stepCount,
        arrayState: [...arr],
        highlightedIndices: Array.from({ length: arr.length }, (_, k) => k),
        description: "Insertion Sort complete! Array is fully sorted."
    });

    return steps;
}

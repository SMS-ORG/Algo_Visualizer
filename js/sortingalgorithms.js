//sorting algorithms 
let noofcomparisions = 0;

function bubblesort(arr) {
    noofcomparisions = 0;
    let queue = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let k = 0; k < arr.length - i - 1; k++) {
            queue.push([k, k + 1, false, noofcomparisions++]);
            if (arr[k] >= arr[k + 1]) {
                queue.push([k, k + 1, true, noofcomparisions]);
                [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]]; //destructure assignment
            }
        }
    }
    return queue;
}

//partitioner for quicksort
function partition(arr, low, high, queue) {
    let key = arr[high];
    let m = low;
    for (let i = low; i < high; i++) {
        if (m != i) {
            queue.push([m, i, false, noofcomparisions++]);
        }
        if (arr[i] <= key) {
            if (m != i) {
                queue.push([m, i, true, noofcomparisions]);
            }
            [arr[m], arr[i]] = [arr[i], arr[m]];
            m++;
        }
    }
    if (m != high) {
        queue.push([m, high, true, noofcomparisions]);
    }
    [arr[high], arr[m]] = [arr[m], arr[high]];
    return m;
}

//quicksort function end value pivot
function quicksort(arr, low, high, queue = null) {
    if (!queue) {
        noofcomparisions = 0;
        queue = [];
    }
    if (low >= high) {
        return;
    }
    else {
        const pivot = partition(arr, low, high, queue);
        quicksort(arr, low, pivot - 1, queue);
        quicksort(arr, pivot + 1, high, queue);
    }
    return queue;
}


//Creating Max Heap
function heapify(arr, n, i, queue) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
        if (l < largest) {
            queue.push([l, largest, false, noofcomparisions++]);
        } else {
            queue.push([largest, l, false, noofcomparisions++]);
        }
        if (arr[l] > arr[largest]) {
            largest = l;
        }
    }
    if (r < n) {
        if (r < largest) {
            queue.push([r, largest, false, noofcomparisions++]);
        } else {
            queue.push([largest, r, false, noofcomparisions++]);
        }
        if (arr[r] > arr[largest]) {
            largest = r;
        }
    }
    if (largest != i) {
        if (i > largest) {
            queue.push([largest, i, true, noofcomparisions]);
        } else {
            queue.push([i, largest, true, noofcomparisions]);
        }
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest, queue);
    }
}

//function heap sort
function heapsort(arr, n) {
    noofcomparisions = 0;
    let queue = [];
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, queue);
    }
    for (let i = n - 1; i >= 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        queue.push([0, i, true, noofcomparisions]);
        heapify(arr, i, 0, queue);
    }
    return queue;
}

//merge two divided array
function merge(arr, start, mid, end, queue) {
    let start2 = mid + 1;

    // If the direct merge is already sorted
    if (arr[mid] <= arr[start2]) {
        return;
    }

    // Two pointers to maintain start
    // of both arrays to merge
    while (start <= mid && start2 <= end) {
        queue.push([start, start2, false, noofcomparisions++]);
        // If element 1 is in right place
        if (arr[start] <= arr[start2]) {
            start++;
        }
        else {
            let index = start2;

            // Shift all the elements between element 1
            // element 2, right by 1.
            while (index != start) {
                [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
                queue.push([index - 1, index, true, noofcomparisions]);
                index--;
            }
            queue.push([start, index, true, noofcomparisions]);
            [arr[start], arr[index]] = [arr[index], arr[start]];

            // Update all the pointers
            start++;
            mid++;
            start2++;
        }
    }
}

//Mergesort Function
function mergesort(arr, l, r, queue = null) {
    if (!queue) {
        queue = [];
        noofcomparisions = 0;
    }
    if (l < r) {
        let m = Math.floor(l + (r - l) / 2);
        mergesort(arr, l, m, queue);
        mergesort(arr, m + 1, r, queue);
        merge(arr, l, m, r, queue);
        return queue;
    }
}

export { bubblesort, quicksort, heapsort, mergesort }
getMaxSequence = (arr, win) => {
    let sequence = []
    let count = 0

    for (let item of arr) {
        if (win) {
            if (item.win) {
                count++
            } else {
                sequence.push(count)
                count = 0
            } 
        } else {
            if (!item.win) {
                count++
            } else {
                sequence.push(count)
                count = 0
            } 
        } 
    }

    return Math.max(...sequence)
}

module.exports = getMaxSequence
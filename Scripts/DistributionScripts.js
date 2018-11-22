const lDistribute = (value) => {
    if (value > 0.001) {
        return (1/(value + iGoldenRatio)) - iGoldenRatio
    } else {
        return value
    }
}

const hDistribute = (value) => {
    if (value > 0.001) {
        return (1/(value - goldenRatio)) + goldenRatio
    } else {
        return value
    }
}

const lCDistribute = (value, power) => {
    if (value > 0.001) {
        return (1/(Math.pow(value, power) + iGoldenRatio)) - iGoldenRatio
    } else {
        return value
    }
}

const hCDistribute = (value, power) => {
    if (value > 0.001) {
        return (1/(Math.pow(value, power) - goldenRatio)) + goldenRatio
    } else {
        return value
    }
}

const linearDistribute = (value) => {
    return value
}


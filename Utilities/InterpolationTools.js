var biLerp = (a, b, c, d, x, y) => {
    return (
        a * (1 - x) * (1 - y)
    ) + (
        b * x * (1 - y)
    ) + (
        c * (x - 1) * y
    ) + (
        d * x * y
    )
}


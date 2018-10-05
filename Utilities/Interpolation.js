function interpolate1D(start, end, pos) {
    var fraction = pos/(end-start)
    return start*fraction
}

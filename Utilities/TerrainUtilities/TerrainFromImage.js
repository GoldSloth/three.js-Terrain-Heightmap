var rawImage

function terrainFromImage(imageURL) {
    rawImage = new MarvinImage()
    rawImage.load(imageURL, interpretImage)

}

function interpretImage() {
    console.log(rawImage)
    var conciseArray = []
    for (var i = 0; i<rawImage.imageData.data.length-4; i+=4) {
        conciseArray.push(((rawImage.imageData.data[i] + rawImage.imageData.data[i+1] + rawImage.imageData.data[i+2])/3))
    }
    console.log(conciseArray)
}

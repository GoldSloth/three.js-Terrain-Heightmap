class LoadingScreen {
    constructor(textToDisplay, elementID) {
        this.text = textToDisplay
        this.element = document.getElementById(elementID)
        this.blockerElement = document.createTextNode(this.text)
    }

    showText() {
        this.element.appendChild(this.blockerElement)
    }

    removeText() {
        this.element.removeChild(this.blockerElement)
    }
}
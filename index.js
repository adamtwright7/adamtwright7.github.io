const typerText = document.querySelector("#typeLine2")
const root = document.querySelector(":root")

// Need a function that changes the text typed out
const textLoad = () => {
    setTimeout(() => {
        typerText.textContent = "Software Engineer"
        root.style.setProperty("--numSteps","17")
    }, 0) // resets to "Software Engineer" at the beginning of each cycle
    setTimeout(() => {
        typerText.textContent = "Web Developer"
        // Change the number of steps to mimic typing a single letter
        root.style.setProperty("--numSteps","13")
    }, 4000)
}

textLoad()
setInterval(textLoad,8000); // makes it loop! 
// Select buttons
const randomFullButton = document.querySelector(".randomFullPoem")
const randomSonnetButton = document.querySelector(".randomSonnet")
const randomHaikuButton = document.querySelector(".randomHaiku")
const randomNumInput = document.querySelector("#randomNum")
const randomNumButton = document.querySelector(".randomNum")

// Select and make JS variables for the output area. 
const attribution = document.querySelector(".attribution")
const poemText = document.querySelector(".poemText")

// Define functions that can be used in the event listeners. 
// First, we'll do a function that just gets a random poem. This is made simple by PoetryDB's "/random" call.
const getRandPoem = async () => {

    // Clear the results from last poem.
    poemText.innerHTML = ""
    attribution.innerHTML = ""

    // Get the data from the API call.
    const RandPoemRawData = await fetch("https://poetrydb.org/random")
    let readableRandPoemData = await RandPoemRawData.json()
    readableRandPoemData = readableRandPoemData[0]
    // The 0 index is included because the object we need comes back in an array.

    // Display the data. We only need one h2 here, so we'll just do it in one line instead of a loop. 
    attribution.innerHTML = `<h2> ${readableRandPoemData.title} by ${readableRandPoemData.author} </h2>`

    // Need to loop through the lines and make a new line for each one. 
    for (let eachLine of readableRandPoemData.lines){
        let line = document.createElement("p")
        line.innerText = eachLine
        poemText.append(line)
    }
}

// Next, we'll do a random sonnet/haiku. 
// It uses the /random call combined with the /linecount call to get (some number -- say three for now) 3 random poems, each of which is 3 lines,
// then pulls a line each to make the full poem. This assumes that every 3-line poem in the database is a haiku (or each 14-line poem a sonnet)
// and the rhyme scheme is probably going to be very messed up. I think modern readers will tolerate messed up rhyme scheme/meter. 

const getRandomByNumLines = async (numLines) => {

    // Clear the results from last poem.
    poemText.innerHTML = ""
    attribution.innerHTML = ""

    // ignore inputs that are too high or too low 
    if ((numLines > 40) || (numLines < 2) || (!Number.isInteger(numLines))){
        let attributionLine = document.createElement("h3") 
        attributionLine.innerText = `Sorry, not enough poems of the linecount you've selected exist. Try a different line count -- most multiples of 4 between 4 and 40 work!`
        attribution.append(attributionLine)
        return
    }

    // Get data from the API.
    const randNumRawData = await fetch(`https://poetrydb.org/random,linecount/${numLines};${numLines}`)
    let readableRandNumData = await randNumRawData.json()

    // ignore inputs that are dynamically too high. This will ignore 39 for example. 
    if (numLines > readableRandNumData.length){
        let attributionLine = document.createElement("h3") 
        attributionLine.innerText = `Sorry, not enough poems of the linecount you've selected exist. Try a different line count -- most multiples of 4 between 4 and 40 work!`
        attribution.append(attributionLine)
        return
    }

    // Looping through each poem, 
    counter = 0
    for (let eachPoem of readableRandNumData){

        // Adding attribution for each poem 
        let attributionLine = document.createElement("h3") // Making these h3 because there's a lot of them 
        attributionLine.innerText = `Line ${counter+1} is ${eachPoem.title} by ${eachPoem.author}`
        attribution.append(attributionLine)

        // Adding the plaintext of each poem
        let line = document.createElement("p")
        line.innerText = eachPoem.lines[counter]
        poemText.append(line)

        // and increment the counter. 
        counter ++ 
    }
}

// Add event listeners 
randomFullButton.addEventListener("click",getRandPoem)
randomSonnetButton.addEventListener("click",() => getRandomByNumLines(14))
randomHaikuButton.addEventListener("click",() => getRandomByNumLines(3))
randomNumButton.addEventListener("click", () => getRandomByNumLines(parseInt(randomNumInput.value)))
randomNumInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter"){
        getRandomByNumLines(parseInt(randomNumInput.value))
    }
})

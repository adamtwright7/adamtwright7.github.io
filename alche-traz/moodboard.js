// Select buttons
const loveButton = document.querySelector("#love")
const deathButton = document.querySelector("#death")

// Select and make JS variables for the output area. 
const results = document.querySelector("#searchResults")

// A function that actually does all the searching:
const search = async (keyword) => { 

    // Clear the results from last poem.
    results.innerHTML = ""
    
    // Define the URL and fetch the data 
    url = `https://poetrydb.org/title,random/${keyword};1`
    const searchRawData = await fetch(url)
    let searchData = await searchRawData.json()
    searchData = searchData[0]

    // Adding attribution
    let attributionLine = document.createElement("h2") 
    attributionLine.innerText = `${searchData.title} by ${searchData.author}`
    results.append(attributionLine)

    // Adding the plaintext,
    for (let line of searchData.lines){
        let lineHolder = document.createElement("p")
        lineHolder.innerText = line
        results.append(lineHolder)
    }

    // Styling the board 
    if (keyword == 'love'){
        // removes the background color, creates a background picture, and resizes the background.
        results.className = "p-1 min-h-screen bg-heart bg-contain"
    }
    if (keyword == 'death'){
        results.className = "p-1 min-h-screen bg-skull bg-contain"
    }
}

// Add event listeners for every button.

loveButton.addEventListener("click",() => search('love'))
deathButton.addEventListener("click",() => search('death'))

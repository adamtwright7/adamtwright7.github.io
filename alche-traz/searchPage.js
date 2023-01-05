// Select buttons
const allByTitleInput = document.querySelector("#allByTitle")
const allByTitleButton = document.querySelector(".allByTitle")

const randByTitleInput = document.querySelector("#randByTitle")
const randByTitleButton = document.querySelector(".randByTitle")

const allByAuthorInput = document.querySelector("#allByAuthor")
const allByAuthorButton = document.querySelector(".allByAuthor")

const randByAuthorInput = document.querySelector("#randByAuthor")
const randByAuthorButton = document.querySelector(".randByAuthor")

// Select and make JS variables for the output area. 
const results = document.querySelector("#searchResults")

// A function that actually does all the searching:
const search = async (mode) => { 

    // Clear the results from last poem.
    results.innerHTML = ""
    
    // Get the data from the API call based on what's in the input field.
    // First, we need the right URL based on what search we're doing. 
    let url = "" // define the URL outside the if statements so it can be accessed outside too.
    if (mode == allByTitle){
        url =`https://poetrydb.org/title/${allByTitleInput.value}`
    }
    if (mode == randByTitle){
        url = `https://poetrydb.org/title,random/${randByTitleInput.value};1`
    }
    if (mode == allByAuthor){
        url = `https://poetrydb.org/author/${allByAuthorInput.value}`
    }
    if (mode == randByAuthor){
        url = `https://poetrydb.org/author,random/${randByAuthorInput.value};1`
    }
    const searchRawData = await fetch(url)
    let searchData = await searchRawData.json()
    
    // If searchData isn't an array, nothing matched the search and we need to tell the user and stop the code. 
    if (!Array.isArray(searchData)) {
        let attributionLine = document.createElement("h3") 
        attributionLine.innerText = "Sorry, nothing matched your search."
        results.append(attributionLine)
        return 
    }

    // We don't need a counter this time because no lines are referenced. 
    // Looping through each poem (if there is more than one), 
    for (let eachPoem of searchData){

        // Adding attribution for each poem, 
        let attributionLine = document.createElement("h3") // Making these h3 because there's a lot of them 
        attributionLine.innerText = `${eachPoem.title} by ${eachPoem.author}`
        results.append(attributionLine)

        // Adding the plaintext of each poem,
        for (let line of eachPoem.lines){
            let lineHolder = document.createElement("p")
            lineHolder.innerText = line
            results.append(lineHolder)
        }
    }    
}

// Add event listeners which capture user inputs.

// All by title 
allByTitleInput.addEventListener("keypress",(e) => {
    if (e.key === "Enter") {
        search(allByTitle)
    }
})
allByTitleButton.addEventListener("click",() => search(allByTitle))

// 1 random by title 
randByTitleInput.addEventListener("keypress",(e) => {
    if (e.key === "Enter") {
        search(randByTitle)
    }
})
randByTitleButton.addEventListener("click",() => search(randByTitle))

// All by author 
allByAuthorInput.addEventListener("keypress",(e) => {
    if (e.key === "Enter") {
        search(allByAuthor)
    }
})
allByAuthorButton.addEventListener("click",() => search(allByAuthor))

// 1 random by author 
randByAuthorInput.addEventListener("keypress",(e) => {
    if (e.key === "Enter") {
        search(randByAuthor)
    }
})
randByAuthorButton.addEventListener("click",() => search(randByAuthor))
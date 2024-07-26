//Todo: Remove timetest in chrome.scripting, replace testcounter, add confirmation for deleting notes, add google signin

const addButton = document.getElementById("addNote")
const notesContainer = document.getElementById("notesContainer")
let storeIdentifier = document.getElementById("storeIdentifier")
let storeName
let nameIdentifier = ""
let notes = {
    0: {
        type: "Software",
        body: "Testing delete button only showing up for user who created note and displaying global notes on all pages",
        user: "Rott Kitchell",
        time: "07/12/2024",
        store: "Global"
    },
    1: {
        type: "General",
        body: "Testing notes showing up on correct page",
        user: "Mason Clark",
        time: "07/15/2024",
        store: "Mason Clark Sandbox (11384)"
    }
}
const deploymentEngineers = ["Mason Clark", "Rott Kitchell", "Henry Yoon"]
const noteTypes = ["General", "Troubleshooting", "Hardware", "Software", "Location Details"]

//lines to change to replace testcounter: 32, 33, 115
testCounter = 2

//looks for the dom elements that store the location name & user name on manager dashboard.
const fetchData = () => {
    const storeName = document.querySelector(".text-wrap")
    const operatorName = document.querySelector(".text-muted")
    return [storeName.innerText, operatorName.innerText]
}

//Queries tabs on opened chrome page looking for the active tab and running fetchStoreId on that tab.

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: fetchData
    }, (result) => {
      const timetest = new Date()
      const time1 = timetest.getTime()
      console.log(time1)
      storeIdentifier.innerText = `Notes for: ${result[0].result[0]}`
      storeName = `${result[0].result[0]}`
      console.log(result[0].result[0])
      nameIdentifier = `${result[0].result[1]}`
      renderNotes()
    });
});

//Adds padding 0's to help with formatting numbers less than 0
function padDate(n) {
    return n<10 ? '0'+n : n;
}

//Creates note object from user input after clicking Post button and reactivates add new note button
const postNote = (type, body, global) => {
    if(body.value !== ""){
        const currentTime = new Date()
        const day = currentTime.getDate()
        const month = currentTime.getMonth()
        const year = currentTime.getFullYear()

        notes[testCounter] = {type: type.value, body: body.value, user: nameIdentifier, time: String(`${padDate(month+1)}/${padDate(day)}/${year}`), store: storeName}
        if(global === true){
            notes[testCounter].store = "Global"
        }
        testCounter += 1

        notesContainer.classList.remove("adding")
        document.getElementById("noteAddingDiv").remove()
        addButton.classList.remove("inactive")
        addButton.classList.add("active")
        renderNotes()
    }
    else{
        alert("Body MUST be filled out")
        notesContainer.classList.remove("adding")
        document.getElementById("noteAddingDiv").remove()
        addButton.classList.remove("inactive")
        addButton.classList.add("active")
        renderNotes()
    }
}

//New Feature: Delete Note and Cancel Note (have to change notescontainer class "adding" and addbutton classes "inactive" & "active")
const deleteNote = (arg) => {
    delete(notes[arg])
    renderNotes()
}

const cancelNote = (arg) => {
    notesContainer.classList.remove("adding")
    addButton.classList.remove("inactive")
    addButton.classList.add("active")
    arg.remove()
    renderNotes()
}
//New Feature: If the user is a deployment engineer allow posting to "global notes", otherwise post based on location. Currently handled inside createNote

//Creates form for creating a new note and removes add new note button
const createNote = () => {
    if(!notesContainer.classList.contains("adding")){
        addButton.classList.remove("active")
        addButton.classList.add("inactive")
        notesContainer.innerHTML = ""
        notesContainer.classList.add("adding")
        const newNoteDiv = document.createElement("div")
        const globalNoteDiv = document.createElement("div")
        globalNoteDiv.classList.add("globalNoteDiv")
        newNoteDiv.id = "noteAddingDiv"

        if(deploymentEngineers.includes(nameIdentifier)){
            const globalNoteToggle = document.createElement("input")
            globalNoteToggle.classList.add("globalNoteToggle")
            globalNoteToggle.type = "checkbox"
            globalNoteToggle.id = "globalToggle"

            const globalNoteLabel = document.createElement("label")
            globalNoteLabel.htmlFor = "globalNoteToggle"
            globalNoteLabel.innerText = "Create Globally:"
            globalNoteDiv.appendChild(globalNoteLabel)
            globalNoteDiv.appendChild(globalNoteToggle)
            newNoteDiv.appendChild(globalNoteDiv)
        }

        const type = document.createElement("select")
        type.classList.add("userInput")
        for(let i in noteTypes){
            const newOption = document.createElement("option")
            newOption.value = noteTypes[i]
            newOption.innerText = `${noteTypes[i]}`
            type.appendChild(newOption)
        }

        const body = document.createElement("input")
        body.classList.add("userInput")
        const post = document.createElement("button")
        const cancel = document.createElement("button")
        post.classList.add("buttonClass")
        cancel.classList.add("buttonClass")
        body.placeholder = "Body (300 Character Limit)"
        body.maxLength = 300
        post.innerText = "Post"
        cancel.innerText = "Cancel"
        cancel.addEventListener("click", (e)=>cancelNote(newNoteDiv))
        if(globalNoteDiv.innerHTML != ""){
            post.addEventListener("click", (e)=>postNote(type.selectedOptions[0], body, globalNoteDiv.querySelector(".globalNoteToggle").checked))
        }
        else{
            post.addEventListener("click", (e)=>postNote(type.selectedOptions[0], body, false))
        }

        const createNoteButtonDiv = document.createElement("div")
        createNoteButtonDiv.classList.add("createNoteButtonDivClass")
        createNoteButtonDiv.appendChild(post)
        createNoteButtonDiv.appendChild(cancel)
        newNoteDiv.appendChild(type)
        newNoteDiv.appendChild(body)
        newNoteDiv.appendChild(createNoteButtonDiv)
        notesContainer.appendChild(newNoteDiv)
    }
}
addButton.addEventListener("click", createNote)

//handles creating/refreshing the list of notes populated from the received object
const renderNotes = () => {
    notesContainer.innerHTML = ""
    for(let note in notes){
        if(notes[note].store === storeName || notes[note].store === "Global"){
            const noteDiv = document.createElement("div")
            const topDiv = document.createElement("div")
            noteDiv.classList.add("noteClass")
            topDiv.classList.add("noteTopClass")

            const noteType = document.createElement("h4")
            const noteBody = document.createElement("p")
            const author = document.createElement("p")
            const createdOn = document.createElement("p")
            noteType.textContent = notes[note].type
            noteBody.textContent = notes[note].body
            createdOn.textContent = notes[note].time
            
            if(notes[note].user !== ""){
                author.innerText = notes[note].user
            }
            else{
                author.innerText = "Unknown"
            }

            topDiv.appendChild(author)
            topDiv.appendChild(createdOn)
            if(notes[note].user === nameIdentifier){
                const deleteButton = document.createElement("button")
                deleteButton.innerText = "X"
                deleteButton.addEventListener("click", e=>deleteNote(note))
                topDiv.appendChild(deleteButton)
            }

            noteDiv.appendChild(topDiv)
            noteDiv.appendChild(noteType)
            noteDiv.appendChild(noteBody)

            notesContainer.appendChild(noteDiv)
        }
    }
}

window.onload = (e) => renderNotes()
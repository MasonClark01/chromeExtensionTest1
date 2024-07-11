const addButton = document.getElementById("addNote")
const notesContainer = document.getElementById("notesContainer")
let storeIdentifier = document.getElementById("storeIdentifier")
let nameIdentifier = ""
let notes = {

}
const noteTypes = ["General", "Troubleshooting", "Hardware", "Software", "Location Details"]
//lines to change to replace testcounter: 32, 33, 115
testCounter = 0

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
      storeIdentifier.innerText = `Notes for: ${result[0].result[0]}`
      nameIdentifier = `${result[0].result[1]}`
    });
});

//Creates note object from user input after clicking Post button and reactivates add new note button
const postNote = (type, body) => {
    if(type.value !== "" && body.value !== ""){
        notes[testCounter] = {type: type.value, body: body.value}
        testCounter += 1

        notesContainer.classList.remove("adding")
        document.getElementById("noteAddingDiv").remove()
        addButton.classList.remove("inactive")
        addButton.classList.add("active")
        console.log(notes)
        renderNotes()
    }
    else{
        alert("Title And Body MUST be filled out")
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
//New Feature: If the user is a deployment engineer allow posting to "global notes", otherwise post based on location.

//Creates form for creating a new note and removes add new note button
const createNote = () => {
    if(!notesContainer.classList.contains("adding")){
        addButton.classList.remove("active")
        addButton.classList.add("inactive")
        notesContainer.innerHTML = ""
        notesContainer.classList.add("adding")
        const newNoteDiv = document.createElement("div")
        newNoteDiv.id = "noteAddingDiv"

        const type = document.createElement("select")
        for(let i in noteTypes){
            const newOption = document.createElement("option")
            newOption.value = noteTypes[i]
            newOption.innerText = `${noteTypes[i]}`
            type.appendChild(newOption)
        }

        const body = document.createElement("input")
        const post = document.createElement("button")
        const cancel = document.createElement("button")
        post.classList.add("buttonClass")
        cancel.classList.add("buttonClass")
        body.placeholder = "Body (300 Character Limit)"
        body.maxLength = 300
        post.innerText = "Post"
        cancel.innerText = "Cancel"
        cancel.addEventListener("click", (e)=>cancelNote(newNoteDiv))
        post.addEventListener("click", (e)=>postNote(type.selectedOptions[0], body))

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
        const noteDiv = document.createElement("div")
        const topDiv = document.createElement("div")
        noteDiv.classList.add("noteClass")
        topDiv.classList.add("noteTopClass")

        const noteType = document.createElement("h4")
        const noteBody = document.createElement("p")
        const author = document.createElement("p")
        const deleteButton = document.createElement("button")
        deleteButton.addEventListener("click", e=>deleteNote(note))

        noteType.textContent = notes[note].type
        noteBody.textContent = notes[note].body
        deleteButton.innerText = "X"
        if(nameIdentifier !== ""){
            author.innerText = nameIdentifier
        }
        else{
            author.innerText = "Placeholder Name"
        }

        topDiv.appendChild(author)
        topDiv.appendChild(deleteButton)
        noteDiv.appendChild(topDiv)
        noteDiv.appendChild(noteType)
        noteDiv.appendChild(noteBody)

        notesContainer.appendChild(noteDiv)
    }
}

renderNotes()
const addButton = document.getElementById("addNote")
const notesContainer = document.getElementById("notesContainer")
let storeIdentifier = document.getElementById("storeIdentifier")
let nameIdentifier = ""
let notes = {

}

//looks for the dom element that stores the store name on manager dashboard.
const fetchData = () =>{
    const storeName = document.querySelector(".text-wrap")
    const operatorName = document.querySelector(".text-muted")
    return [storeName.innerText, operatorName.innerText]
}

//Queries tabs on opened chrome page looking for the active tab and running fetchStoreId on that tab.
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Execute Script");
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: fetchData
    }, (result) => {
      console.log(result[0].result[0]);
      storeIdentifier.innerText = `Notes for: ${result[0].result[0]}`
      nameIdentifier = `${result[0].result[1]}`
    });
});

//Creates note object from user input after clicking Post button and reactivates add new note button
const postNote = (title, body) => {
    if(title.value !== "" && body.value !== ""){
        const noteTitle = title.value
        notes[noteTitle] = body.value
        notesContainer.classList.remove("adding")
        document.getElementById("noteAddingDiv").remove()
        addButton.classList.remove("inactive")
        addButton.classList.add("active")
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

        const head = document.createElement("input")
        const body = document.createElement("input")
        const post = document.createElement("button")
        const cancel = document.createElement("button")

        head.placeholder = "Title"
        body.placeholder = "Body"
        post.innerText = "Post"
        cancel.innerText = "Cancel"
        post.addEventListener("click", (e)=>postNote(head, body))

        newNoteDiv.appendChild(cancel)
        newNoteDiv.appendChild(head)
        newNoteDiv.appendChild(body)
        newNoteDiv.appendChild(post)
        notesContainer.appendChild(newNoteDiv)
    }
}
addButton.addEventListener("click", createNote)

const deleteNote = (arg) =>{

}
//handles creating/refreshing the list of notes populated from the received object
const renderNotes = () =>{
    notesContainer.innerHTML = ""
    for(let note in notes){
        const noteDiv = document.createElement("div")
        noteDiv.classList.add("noteClass")

        const noteTitle = document.createElement("h4")
        const noteBody = document.createElement("p")
        const author = document.createElement("p")
        const deleteButton = document.createElement("button")
        deleteButton.addEventListener("click", e=>deleteNote(e))

        noteTitle.textContent = note
        noteBody.textContent = notes[note]
        deleteButton.innerText = "X"
        if(nameIdentifier !== ""){
            author.innerText = nameIdentifier
        }
        else{
            author.innerText = "Placeholder Name"
        }

        noteDiv.appendChild(noteTitle)
        noteDiv.appendChild(noteBody)
        noteDiv.appendChild(author)
        noteDiv.appendChild(deleteButton)

        notesContainer.appendChild(noteDiv)
    }
}

renderNotes()
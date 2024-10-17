document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
    const notesContainer = document.getElementById("notes-container");

    // Placeholder array for storing notes
    let notes = [];

    // Event listener for the upload form
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const subject = document.getElementById("subject").value;
        const tags = document.getElementById("tags").value;
        const fileInput = document.getElementById("file").files[0];
        const textInput = document.getElementById("text").value;

        // Create a note object
        const note = {
            subject: subject,
            tags: tags.split(',').map(tag => tag.trim()),  // Splits tags by comma
            file: fileInput ? fileInput.name : null,
            text: textInput,
            rating: 0
        };

        // Add the note to the array
        notes.push(note);
        displayNotes();

        // Reset form
        uploadForm.reset();
    });

    // Function to display notes in the notes container
    function displayNotes() {
        notesContainer.innerHTML = "";

        notes.forEach((note, index) => {
            const noteDiv = document.createElement("div");
            noteDiv.classList.add("note-item");

            noteDiv.innerHTML = `
                <h3>${note.subject}</h3>
                <p><strong>Tags:</strong> ${note.tags.join(", ")}</p>
                ${note.file ? `<p><strong>Bestand:</strong> ${note.file}</p>` : ""}
                ${note.text ? `<p><strong>Notities:</strong> ${note.text}</p>` : ""}
                <p><strong>Rating:</strong> <span class="rating">${'★'.repeat(note.rating)}</span></p>
                <button onclick="rateNote(${index}, 1)">👍</button>
                <button onclick="rateNote(${index}, -1)">👎</button>
            `;

            notesContainer.appendChild(noteDiv);
        });
    }

    // Function to rate notes
    window.rateNote = function(index, value) {
        notes[index].rating += value;
        if (notes[index].rating < 0) {
            notes[index].rating = 0;
        }
        displayNotes();
    };
});

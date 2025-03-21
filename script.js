let recognition;
        let currentNote = null;
        let isRecognizing = false;
        let isA4Mode = false;

        function startListening() {
            if (!('webkitSpeechRecognition' in window)) {
                alert("Your browser doesn't support speech recognition.");
                return;
            }

            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = function () {
                isRecognizing = true;
                console.log("Listening...");
            };

            recognition.onresult = function (event) {
                let transcript = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript = event.results[i][0].transcript.trim();
                        console.log("Heard: ", transcript);

                        if (isA4Mode) {
                            document.getElementById("a4-textarea").value += " " + transcript;
                        } else {
                            if (transcript.toLowerCase() === "done") {
                                createNewNote();
                            } else {
                                if (!currentNote) createNewNote();
                                currentNote.querySelector(".note-text").textContent += " " + transcript;
                            }
                        }
                    }
                }
            };

            recognition.onerror = function (event) {
                console.error("Speech Recognition Error:", event.error);
            };

            recognition.onend = function () {
                isRecognizing = false;
                console.log("Stopped listening.");
            };

            recognition.start();
        }

        function createNewNote() {
            const note = document.createElement("div");
            note.classList.add("note");
            note.style.backgroundColor = getRandomColor();
            note.style.color = getRandomTextColor();
            note.style.fontFamily = getRandomFont();

            const noteText = document.createElement("span");
            noteText.classList.add("note-text");
            noteText.textContent = ""; 

            const editBtn = document.createElement("button");
            editBtn.textContent = "✏ Edit";
            editBtn.classList.add("edit-btn");
            editBtn.onclick = () => editNote(noteText);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑 Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.onclick = () => note.remove();

            note.appendChild(noteText);
            note.appendChild(editBtn);
            note.appendChild(deleteBtn);
            document.getElementById("notes-container").appendChild(note);

            currentNote = note;
        }

        function getRandomFont() {
            const fonts = ["Arial, sans-serif", "Verdana, sans-serif", "Courier New, monospace", "Georgia, serif", "Tahoma, sans-serif"];
            return fonts[Math.floor(Math.random() * fonts.length)];
        }

        function getRandomTextColor() {
            const textColor = ["#fff", "#111"];
            return textColor[Math.floor(Math.random() * textColor.length)];
        }
        function getRandomColor() {
            const colors = ["#FFD700", "#FFA07A", "#98FB98", "#87CEFA", "#FF69B4", "#DDA0DD"];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function editNote(noteText) {
            const newText = prompt("Edit your note:", noteText.textContent);
            if (newText !== null) noteText.textContent = newText;
        }

        function addNewPage() {
            document.getElementById("notes-container").innerHTML = "";
            document.getElementById("a4-textarea").value = "";
        }

        function clearAll() {
            document.getElementById("notes-container").innerHTML = "";
            document.getElementById("a4-textarea").value = "";
        }

        function toggleA4Mode() {
            isA4Mode = !isA4Mode;
            document.getElementById("notes-container").style.display = isA4Mode ? "none" : "flex";
            document.getElementById("a4-container").style.display = isA4Mode ? "block" : "none";
        }
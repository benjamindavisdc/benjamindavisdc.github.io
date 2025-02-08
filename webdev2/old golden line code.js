
        // JavaScript to fetch the text from story.txt and load it into the div
        fetch('travel.txt')
            .then(response => response.text())
            .then(data => {
                const game = document.getElementById('content');

                game.innerText = data;
                
                //make the last line of the text output able to be targeted by css.
                const lines = data.split('\n');
                const lastLine = lines[lines.length-1];
                //splitting and modifying data streams is brain melting work
                game.innerHTML = game.innerHTML.replace(lastLine, `<span class="last-line">${lastLine}</span>`);
                //YOU HAVE TO USE `BACK TICKS` when using replace!!
                game.scrollTop = game.scrollHeight; 
            })
            .catch(error => console.error('Error loading the adventure:', error));

            
        

            //appends text entries
            document.getElementById('theForm').addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent form submission (if applicable)
            
                const textInput = document.getElementById('thePrompt'); // Get the input value
                const existingText = document.getElementById('content'); // Assuming game is the element holding the existing text
            
                // Concatenate the new text to the existing text
                const newText = existingText.innerHTML + ' ' + textInput.value;
            
                // Update the element with the new text
                existingText.innerHTML = newText;
            });
            
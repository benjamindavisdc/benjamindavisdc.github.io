
let outPutText = '';

        // JavaScript to fetch the text from story.txt and load it into the div
        fetch('travel.txt')
            .then(response => response.text())
            .then(data => {
                const game = document.getElementById('content');

                outPutText = data;
                game.innerText = data;

                //outPutText will be the master data source displayed at different points

                //game.innerText = data;

                //
                
                //make the last line of the text output able to be targeted by css.
                
                //YOU HAVE TO USE `BACK TICKS` when using replace!!
                game.scrollTop = game.scrollHeight; 
            })
            .catch(error => console.error('Error loading the adventure:', error));

            
        

            //appends text entries
            document.getElementById('theForm').addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent form submission (if applicable)
            
                const textInput = document.getElementById('thePrompt'); // Get the input value
                const game = document.getElementById('content'); // Assuming game is the element holding the existing text
            
                // Concatenate the new text to the existing text
                const newText = textInput.value;
            
                outPutText += `\n\n${newText}`;


           
                game.innerText = outPutText;                // Update the element with the new text
                game.scrollTop = game.scrollHeight;

                textInput.value = '';
            });
            
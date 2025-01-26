let outPutText=""

//HP System
        
//Intital HP
let currentHP = 205
let totalHP = "/205"
document.getElementById("currentHP").innerText=`${currentHP}`;
document.getElementById("totalHP").innerText=`${totalHP}`;


function takeDamage(damage){
    currentHP=Math.max(0, currentHP-damage);
    document.getElementById("currentHP").innerText=`${currentHP}`

    if (currentHP === 0) {
        document.getElementById("currentHP").innerText=`Dead`
        document.getElementById("totalHP").innerText=``;
        modal_background_d.style.display = "block";  //death screen!
    }
    else{
        document.getElementById("currentHP").innerText=`${currentHP}`
    }
}

function burnToDeath(newText){
    outPutText += `\n\n${newText}\n\nYou rush into the building, searching each room for the sounds of the innocent little puppy. You leap through the flames and cough as the smoke penetrates your lungs and makes your head spin. At the top of the stairs you find the tiny puppy, and heroically leap out of the second floor window while gently nestling him in your arms. Your pants and hair are on fire, and you feel like you are being cooked!\n\nYou are now burning. \n\nYou take 20 damage.`
    takeDamage(20);
}

function climbingTheTree(newText){
    if (youreBurning === true){
    outPutText += `\n\n${newText}\n\nYou begin climbing up the tree, but the fire quickly spreads. Soon you find yourself in the middle of a raging inferno. You see the cat leap to safety as the burning tree collapses around you. You hit the ground like a falling star, praying that it's not your end.\n\nYou take 100 damage.`
    takeDamage(100);}
    else{
    outPutText += `\n\n${newText}\n\nYou climb up and get clawed and fall down.\n\nYou take 30 damage.`
    takeDamage(30);
}}
                        

// JavaScript to fetch the text from story.txt and load it into the div

        fetch('travel.txt')
            .then(response => response.text())
            .then(data => {
                const game = document.getElementById('content');

                outPutText = data;
                game.innerText = data;

                game.scrollTop = game.scrollHeight; 
            })
            .catch(error => console.error('Error loading the adventure:', error));

            
        
let youreBurning = null;

            //appends text entries
            document.getElementById('theForm').addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent form submission (if applicable)
            
                const textInput = document.getElementById('thePrompt'); // Get the input value
                const game = document.getElementById('content'); // Assuming game is the element holding the existing text
            
                // Concatenate the new text to the existing text
                const newText = textInput.value.trim();
                //switch to provide different responses based on text inputs
                switch (newText){
                    case "I climb up the tree to try and rescue the cat.":
                        climbingTheTree(newText);
                        break;
                    
                    case "I run into the burning building to save an innocent puppy.":
                        burnToDeath(newText);
                        youreBurning = true;
                        break;


                    default:
                        outPutText += `\n\n${newText}`; //output text = (outputtext+newtext)
                        break;
            }

           
                game.innerText = outPutText;             
                // Update the element with the new text
                game.scrollTop = game.scrollHeight;

                textInput.value = '';
            });
            
            //TOP SCREEN MODAL MENUS

            const modal_background = document.getElementById("modal-background");
            const modal_background2 = document.getElementById("modal-background2");
            const modal_background3 = document.getElementById("modal-background3");
            const modal_background4 = document.getElementById("modal-background4");
            const modal_background5 = document.getElementById("modal-background5");
            const modal_background6 = document.getElementById("modal-background6");
            const modal_background7 = document.getElementById("modal-background7");
            const modal_background_d = document.getElementById("modal-background-d");

            const buttons = [
                document.getElementById("button_challenge_1"),
                document.getElementById("button_challenge_2"),
                document.getElementById("button_challenge_3"),
                document.getElementById("button_challenge_4"),
                document.getElementById("button_challenge_5"),
                document.getElementById("button_challenge_6"),
                document.getElementById("button_challenge_7")
            ];

            /*
            Above is a replacement for: open modal button 1
            const button_challenge_1 = document.getElementById("button_challenge_1");
            const button_challenge_2 = document.getElementById("button_challenge_2");
            const button_challenge_3 = document.getElementById("button_challenge_3");
            const button_challenge_4 = document.getElementById("button_challenge_4");
            const button_challenge_5 = document.getElementById("button_challenge_5");
            const button_challenge_6 = document.getElementById("button_challenge_6");
            const button_challenge_7 = document.getElementById("button_challenge_7");
            */
            const modal_close = document.getElementById("close");
            const modal_close2 = document.getElementById("close2");
            const modal_close3 = document.getElementById("close3");
            const modal_close4 = document.getElementById("close4");
            const modal_close5 = document.getElementById("close5");
            const modal_close6 = document.getElementById("close6");
            const modal_close7 = document.getElementById("close7");
            const modal_closed = document.getElementById("closed");
            
                /*Try adding a loop here later to reduce redundancy */

                //click the buttons to open Modal
            button_challenge_1.addEventListener("click",() => {
                modal_background.style.display = "block";
            });
            button_challenge_2.addEventListener("click",() => {
                modal_background2.style.display = "block";
            });
            button_challenge_3.addEventListener("click",() => {
                modal_background3.style.display = "block";
            });
            button_challenge_4.addEventListener("click",() => {
                modal_background4.style.display = "block";
            });
            button_challenge_5.addEventListener("click",() => {
                modal_background5.style.display = "block";
            });
            button_challenge_6.addEventListener("click",() => {
                modal_background6.style.display = "block";
            });
            button_challenge_7.addEventListener("click",() => {
                modal_background7.style.display = "block";
            });
                
            modal_close.addEventListener("click",() => {
                modal_background.style.display = "none";
            });
            modal_close2.addEventListener("click",() => {
                modal_background2.style.display = "none";
            });
            modal_close3.addEventListener("click",() => {
                modal_background3.style.display = "none";
            });
            modal_close4.addEventListener("click",() => {
                modal_background4.style.display = "none";
            });
            modal_close5.addEventListener("click",() => {
                modal_background5.style.display = "none";
            });
            modal_close6.addEventListener("click",() => {
                modal_background6.style.display = "none";
            });
            modal_close7.addEventListener("click",() => {
                modal_background7.style.display = "none";
            });
            modal_closed.addEventListener("click",() => {
                modal_background_d.style.display = "none";
            });


            window.addEventListener("click", (event) => {
                if (event.target === modal_background) {
                    modal_background.style.display = "none";
                }});

            window.addEventListener("click", (event) => {
                if (event.target === modal_background2) {
                    modal_background2.style.display = "none";
                }});

            window.addEventListener("click", (event) => {
                if (event.target === modal_background3) {
                    modal_background3.style.display = "none";
                }});

            window.addEventListener("click", (event) => {
                if (event.target === modal_background4) {
                    modal_background4.style.display = "none";
                }});

            window.addEventListener("click", (event) => {
                if (event.target === modal_background5) {
                    modal_background5.style.display = "none";
                }});

            window.addEventListener("click", (event) => {
                if (event.target === modal_background6) {
                    modal_background6.style.display = "none";
                }});

            window.addEventListener("click", (event) => {
                if (event.target === modal_background7) {
                    modal_background7.style.display = "none";
                }});
            
                window.addEventListener("click", (event) => {
                if (event.target === modal_background_d) {
                    modal_background_d.style.display = "none";
                }});


            //Challenge 1 Modal Text Input
            fetch('challenge1.txt')
                .then(response => response.text())
                .then(data => {
                    const game1 = document.getElementById('modal-text-1');

                    game1.innerText = data;
            })

            //Challenge 2 Modal Text Input
            fetch('challenge2.txt')
                .then(response => response.text())
                .then(data => {
                    const game2 = document.getElementById('modal-text-2');

                    game2.innerText = data;
            })

            //Challenge 3 Modal Text Input
            fetch('challenge3.txt')
                .then(response => response.text())
                .then(data => {
                    const game3 = document.getElementById('modal-text-3');

                    game3.innerText = data;
            })

            //Challenge 4 Modal Text Input
            fetch('challenge4.txt')
                .then(response => response.text())
                .then(data => {
                    const game4 = document.getElementById('modal-text-4');

                    game4.innerHTML = data;
            })

            //Challenge 5 Modal Text Input
            fetch('challenge5.txt')
                .then(response => response.text())
                .then(data => {
                    const game5 = document.getElementById('modal-text-5');

                    game5.innerText = data;
            })

            //Challenge 6 Modal Text Input
            fetch('challenge6.txt')
                .then(response => response.text())
                .then(data => {
                    const game6 = document.getElementById('modal-text-6');

                    game6.innerHTML = data;
            })

            //Challenge 7 Modal Text Input
            fetch('challenge7.txt')
                .then(response => response.text())
                .then(data => {
                    const game7 = document.getElementById('modal-text-7');

                    game7.innerText = data;
            })

            //Death Modal Text Input
            fetch('death.txt')
                .then(response => response.text())
                .then(data => {
                    const game_d = document.getElementById('modal-text-d');

                    game_d.innerHTML = data;
            })


                //get the value of the prompt initialized, then set the value to your message.
            document.getElementById("fight_button_1").addEventListener("click", () =>{
                const treeButton = document.getElementById("thePrompt")
                treeButton.value = "I climb up the tree to try and rescue the cat.";
            })
            
            document.getElementById("fight_button_2").addEventListener("click", () =>{
                const treeButton = document.getElementById("thePrompt")
                treeButton.value = "I run into the burning building to save an innocent puppy.";
            })

            document.getElementById("fight_button_3").addEventListener("click", () =>{
                const treeButton = document.getElementById("thePrompt")
                treeButton.value = "I challenge the black knight to a duel!";
            })


           

    //             currentHP.innerText = CurrentHP;
    //             totalHP.innerHTML = TotalHP;
    //     }

    //     function updateHP(newHP){
    //         const totalHP = document.getElementById("totalHP");
    //         const currentHP = document.getElementById("currentHP");

    // // Update current HP
    //         currentHP = newHP; 
            
    //         if(currentHP <=0){            
    //             totalHP.innerText="Dead";}
    //             else{
    //                 currentHP.innerText = currentHP;
    //         }
    //     }
            //This comes at the end of an IF ELSE**************
           
            



            // modal_close.addEventListener("click", () => {
            //     // Loop through all modals and hide the ones that are visible
            //     modal_backgrounds.forEach(modal => {
            //         modal.style.display = "none";
            //     });
            // });

            /* black knight loop. 
            send text to prompt window
            if text is entered (prompt has search upon enter)
            start switch statement
            black knight counter = 0
            if counter =0, the knight chops off your left arm
            The black knight always trumphs!
            black knight counter +1
            you lose 50 hp
            if pressed again, repeats for all limbs
            and head.*/

            /*fire rescue loop.
            text sent to prompt window.
            if entered, you take 20 damage and become burning.
            for ALL prompt entries, do a check if burning.*/

            /*PROMPT BURINNG CHECK.
            If prompt is submitted, return message, you are burning,
            deal 20 damage*/

            /*Cat rescue log.
            when text entered in prompt, attempt to rescue cat.
            Rescue log = 0
            if burning, you burn down the tree while climbing,
            take 100 damage,
            rescule log =1
            else, you get scratched and the cat runs away,
            you take 30 damage
            rescue log =1
            if text entered again when log >0,
            return, cat is gone.*/
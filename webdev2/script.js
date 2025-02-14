let outPutText=""
let dismembermentCounter = 0;        
let youreBurning = null;


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
        setTimeout(()=>{
            modal_background_d.style.display = "block";  //death screen!
    }, 2000);}
    else{
        document.getElementById("currentHP").innerText=`${currentHP}`
    }
}


// Function to send message to backend
// async function sendMessageToBackend(userMessage) {
//     try {
//         const response = await fetch('https://together-aibackend-one.vercel.app/api/chat.js', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ message: userMessage }),
//         });

//         const data = await response.json();
//         console.log("Response from backend:", data);  // Add a log here to see the response

//         if (data.response) {
//             outPutText += `\t<p><strong>AI:</strong> ${data.response}</p>`;
//             updateChatWindow();
//         } else {
//             console.error('Error:', data.error);
//         }
//     } catch (error) {
//         console.error('Error sending message:', error);
//     }
// }

async function startGame() {
    const response = await fetch("https://together-aibackend.vercel.app/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    outPutText += `<p> ${result.start}</p>`;
    
    updateChatWindow();
    //document.getElementById("content").innerText = result.start;
}

async function sendMessage(userMessage) {
    const message = document.getElementById("theForm").value;
    const response = await fetch("https://together-aibackend.vercel.app/api/chat/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message:userMessage, history: [] }),
    });

    const result = await response.json();
    outPutText += `<p><strong>AI:</strong> ${result.result}</p>`;
    updateChatWindow()
    //document.getElementById("content").innerText = result.result;
}

// Function to update the chat window
function updateChatWindow() {
    const game = document.getElementById('content');
    game.innerHTML = outPutText;
    game.scrollTop = game.scrollHeight; // Scroll to the bottom of the chat window
}

//Appends text entries
document.getElementById('theForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const textInput = document.getElementById('thePrompt'); // Get the input value
    const game = document.getElementById('content'); // Chat window

    const newText = textInput.value.trim();
    if (newText) {
        outPutText += `<p><strong>You:</strong> ${newText}</p>`; // Append user message
        updateChatWindow(); // Update the chat window with the new message

        // Send user message to the backend
        sendMessage(newText);
        
        textInput.value = ''; // Clear the input field
    }
});

// document.getElementById('theForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     sendMessage() // Prevent form submission
//   })



            //TOP SCREEN MODAL MENUS

            // const modal_background = document.getElementById("modal-background");
            // const modal_background2 = document.getElementById("modal-background2");
            // const modal_background3 = document.getElementById("modal-background3");
            // const modal_background4 = document.getElementById("modal-background4");
            // const modal_background5 = document.getElementById("modal-background5");
            // const modal_background6 = document.getElementById("modal-background6");
            const modal_background7 = document.getElementById("modal-background7");
            // const modal_background_d = document.getElementById("modal-background-d");

            const buttons = [
                // document.getElementById("button_challenge_1"),
                // document.getElementById("button_challenge_2"),
                // document.getElementById("button_challenge_3"),
                // document.getElementById("button_challenge_4"),
                // document.getElementById("button_challenge_5"),
                // document.getElementById("button_challenge_6"),
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
            // const modal_close = document.getElementById("close");
            // const modal_close2 = document.getElementById("close2");
            // const modal_close3 = document.getElementById("close3");
            // const modal_close4 = document.getElementById("close4");
            // const modal_close5 = document.getElementById("close5");
            // const modal_close6 = document.getElementById("close6");
            const modal_close7 = document.getElementById("close7");
            // const modal_closed = document.getElementById("closed");
            
                /*Try adding a loop here later to reduce redundancy */

                //click the buttons to open Modal
            // button_challenge_1.addEventListener("click",() => {
            //     modal_background.style.display = "block";
            // });
            // button_challenge_2.addEventListener("click",() => {
            //     modal_background2.style.display = "block";
            // });
            // button_challenge_3.addEventListener("click",() => {
            //     modal_background3.style.display = "block";
            // });
            // button_challenge_4.addEventListener("click",() => {
            //     modal_background4.style.display = "block";
            // });
            // button_challenge_5.addEventListener("click",() => {
            //     modal_background5.style.display = "block";
            // });
            // button_challenge_6.addEventListener("click",() => {
            //     modal_background6.style.display = "block";
            // });
            button_challenge_7.addEventListener("click",() => {
                modal_background7.style.display = "block";
            });
                
            // modal_close.addEventListener("click",() => {
            //     modal_background.style.display = "none";
            // });
            // modal_close2.addEventListener("click",() => {
            //     modal_background2.style.display = "none";
            // });
            // modal_close3.addEventListener("click",() => {
            //     modal_background3.style.display = "none";
            // });
            // modal_close4.addEventListener("click",() => {
            //     modal_background4.style.display = "none";
            // });
            // modal_close5.addEventListener("click",() => {
            //     modal_background5.style.display = "none";
            // });
            // modal_close6.addEventListener("click",() => {
            //     modal_background6.style.display = "none";
            // });
            modal_close7.addEventListener("click",() => {
                modal_background7.style.display = "none";
            });
            // modal_closed.addEventListener("click",() => {
            //     modal_background_d.style.display = "none";
            // });


            // window.addEventListener("click", (event) => {
            //     if (event.target === modal_background) {
            //         modal_background.style.display = "none";
            //     }});

            // window.addEventListener("click", (event) => {
            //     if (event.target === modal_background2) {
            //         modal_background2.style.display = "none";
            //     }});

            // window.addEventListener("click", (event) => {
            //     if (event.target === modal_background3) {
            //         modal_background3.style.display = "none";
            //     }});

            // window.addEventListener("click", (event) => {
            //     if (event.target === modal_background4) {
            //         modal_background4.style.display = "none";
            //     }});

            // window.addEventListener("click", (event) => {
            //     if (event.target === modal_background5) {
            //         modal_background5.style.display = "none";
            //     }});

            // window.addEventListener("click", (event) => {
            //     if (event.target === modal_background6) {
            //         modal_background6.style.display = "none";
            //     }});

            window.addEventListener("click", (event) => {
                if (event.target === modal_background7) {
                    modal_background7.style.display = "none";
                }});
            
                // window.addEventListener("click", (event) => {
                // if (event.target === modal_background_d) {
                //     modal_background_d.style.display = "none";
                // }});




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
            fetch('challenge7.html')
                .then(response => response.text())
                .then(data => {
                    const game7 = document.getElementById('modal-text-7');

                    game7.innerHTML = data;
            })

            //Death Modal Text Input
            fetch('death.txt')
                .then(response => response.text())
                .then(data => {
                    const game_d = document.getElementById('modal-text-d');

                    game_d.innerHTML = data;
            })



            //Listeners for the Site description page


            const descLink = document.getElementById('Desc_link');
            descLink.addEventListener("click", (e) => {
                e.preventDefault();
            
                fetch('challenge7.html')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not OK");
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById('modal-text-7').innerHTML = data;
                    })
                    .catch(error => {
                        console.error("Error fetching content:", error);
                    });
                    document.getElementById('modal-text-7').classList.remove('codeon')
            });

            const htmlLink = document.getElementById('HTML_link');
            htmlLink.addEventListener("click", (e) => {
                e.preventDefault();
            
                fetch('https://raw.githubusercontent.com/benjamindavisdc/benjamindavisdc.github.io/refs/heads/main/webdev/webdev2.html')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not OK");
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById('modal-text-7').innerText = data;
                    })
                    .catch(error => {
                        console.error("Error fetching content:", error);
                    });
                    document.getElementById('modal-text-7').classList.add('codeon')
            });

            const cssLink = document.getElementById('CSS_link');
            cssLink.addEventListener("click", (e) => {
                e.preventDefault();
            
                fetch('https://raw.githubusercontent.com/benjamindavisdc/benjamindavisdc.github.io/refs/heads/main/webdev/css/style.css')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not OK");
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById('modal-text-7').innerText = data;
                    })
                    .catch(error => {
                        console.error("Error fetching content:", error);
                    });
                    document.getElementById('modal-text-7').classList.add('codeon')
            });

            const jsLink = document.getElementById('JS_link');
            jsLink.addEventListener("click", (e) => {
                e.preventDefault();
            
                fetch('https://raw.githubusercontent.com/benjamindavisdc/benjamindavisdc.github.io/refs/heads/main/webdev/script.js')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not OK");
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById('modal-text-7').innerText = data;
                    })
                    .catch(error => {
                        console.error("Error fetching content:", error);
                    });
                    document.getElementById('modal-text-7').classList.add('codeon')
            });

            // document.getElementById("submit_button").addEventListener("click", () =>{
            // sendMessage();
            // })

                //get the value of the prompt initialized, then set the value to your message.
            document.getElementById("fight_button_1").addEventListener("click", () =>{
            startGame();
            })
            
            document.getElementById("fight_button_2").addEventListener("click", () =>{
                const treeButton = document.getElementById("thePrompt")
                treeButton.value = "";
            })

            document.getElementById("fight_button_3").addEventListener("click", () =>{
                const treeButton = document.getElementById("thePrompt")
                treeButton.value = "";
            })
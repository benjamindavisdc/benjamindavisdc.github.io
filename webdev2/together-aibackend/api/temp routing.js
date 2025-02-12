app.post("/api/chat", async (req, res) => {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Setup game state and generate start
        await setupGameState();
        await generateStart();

        // Retrieve message and history from the request body
        const { message, history } = req.body;

        // Run the action and get the result
        const result = await runAction(message, history);

        // Respond with 200 OK and the start and result
        res.status(200).json({ start: gameState.start, result });
    } catch (error) {
        console.error('Error processing the request:', error);
        // Send a 500 status in case of any error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post("/api/chat", async (req, res) => {
    await setupGameState();
    await generateStart();
    res.json({ message: "Game started", start: gameState.start });
  });
  
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    const result = await runAction(message, history);
    res.json({ result });
  });
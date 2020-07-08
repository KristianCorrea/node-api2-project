const express = require('express');
const server = express();

const postsRouter = require("./routers/posts-router.js")

server.use(express.json()); //Make post requests work
server.use("/api/posts", postsRouter);


let PORT = 8000;
server.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}.`)
})

server.get('/', (req, res) => {
    res.status(200).json({ status: `Server is up and running!`})
})
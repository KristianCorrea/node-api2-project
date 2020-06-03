const express = require(`express`);

const postsRouter=require('./posts/posts-router');

const server=express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get('/', (req, res)=>{
    res.send(`<h1>api2-project</h1>`)
});

const port=3000;
server.listen(port, ()=>{
    console.log(`/n == Server running on port ${port} == /n`);
});


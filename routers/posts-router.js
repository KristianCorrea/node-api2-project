const express = require("express");

const router = express.Router();

const posts = require("../data/db"); //Database Model

module.exports = router;

router.get("/", (req, res) => {
    posts.find()
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((error) => {
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})

router.get("/:id", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            console.log(post)
            if(post.length===0){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }else{
                res.status(200).json(post);
            }
        })
        .catch((error) => {
            res.status(500).json(error)
        })
})

router.post("/", (req, res) => { //Add new post
    let newPost = req.body;
    console.log(newPost)
    if(typeof newPost.title !== 'undefined' && typeof newPost.contents !== 'undefined'){
        posts.insert(newPost)
            .then((newPost) => {
                res.status(201).json(newPost)
            })
            .catch((error) => {
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }else{
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
    
})

router.delete("/:id", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            console.log(post)
            if(post.length===0){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }else{
                res.status(200).json(post);
            }
        })
        .catch((error) => {
            res.status(500).json(error)
        })
    posts.remove(req.params.id)
        .then((deletedPost) => {
            console.log(deletedPost)
        })
        .catch((error) => {
            res.status(500).json(error)
        })
})

router.put("/:id", (req, res) => {
    let edittedPost = req.body;
    posts.findById(req.params.id)
        .then((post) => {
            console.log(post)
            if(post.length===0){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch((error) => {
            res.status(500).json(error)
        })
    if(typeof edittedPost.title !== 'undefined' || typeof edittedPost.contents !== 'undefined'){
        posts.update(req.params.id, edittedPost)
            .then((updatedPost) => {
                console.log(updatedPost, "Updated Post")
            })
            .catch((error) => {
                res.status(500).json(error)
            })
        posts.findById(req.params.id)
            .then((updatedPost) => {
                res.status(200).json(updatedPost)
            })
            .catch((error) => {
                console.log(error)
            })
    }else{
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

router.get("/:id/comments", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            console.log(post)
            if(post.length===0){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch((error) => {
            res.status(500).json(error)
        })
    posts.findPostComments(req.params.id)
        .then((postComments) => {
            res.status(200).json(postComments)
        })
        .catch((error) => {
            res.status(500).json(error)
        })
})

router.post("/:id/comments", (req, res) => { //Adds new comment to a specific post
    const post_id = req.params.id;
    const newComment = {
        ...req.body,
        post_id: post_id
    }
    console.log(newComment)
    posts.findById(newComment.post_id)
        .then((post)=>{
            console.log(`Verify post id`, post)
            if(post.length === 0){
                res.status(404).json({message: "The post with the specified ID does not exist."})
                console.log(`Post not found.`)
            }else{
                console.log(`Post verified. Ready to continue.`)
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    console.log(newComment.text, `TEST BEFORE`)
    if(typeof newComment.text === 'undefined' || newComment.text === ''){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }else{
        posts.insertComment(newComment)
        .then((newCommentID) => { //I need to capture the newCommentID! It's the only way I can figure out the ID of the new comment that was created. Then use that ID within posts.findCommentById() function.
            console.log(`New comment created with the ID of ${newCommentID}`)
            console.log(`Verifying creation of new comment.`, newCommentID)
            posts.findCommentById(newCommentID) //needed to output new comment. INSTEAD OUTPUTS EMPTY ARRAY. Meaning the new comment hasn't been added at this point.
                .then((newComment)=>{
                    res.status(201).json(newComment)
                })
                .catch((commentNotFound)=>{
                    res.status(500).json(commentNotFound)
                })
        })
        .catch((error) => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
    }
})


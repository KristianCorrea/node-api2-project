const express = require('express');

const router = express.Router();

const Posts = require('../data/db');

// GET request to posts
router.get('/', (req,res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
});

// POST request to posts
router.post('/', (req,res) => {
  let item = req.body;
  if(item.title === '' || item.content === '') {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
    Posts.insert(item)
      .then(post => {
        res.status(201).json(item);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "There was an error while saving the post to the database" });
      })
  }
});

// GET request to post by id
router.get('/:id', (req,res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if(post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The post information could not be retrieved." });
    })
});

// PUT request to post by id
router.put('/:id', (req,res) => {
  console.log(req.body);
  const edit = req.body;
  if(!req.params.id) {
    res.status(404).json({ message: "The post with the specified ID does not exist." });
  } else if(edit.title === '' || edit.content === '') {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
    Posts.update(req.params.id, edit)
      .then(post => {
        res.status(200).json(edit);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "The post information could not be modified." });
      })
  }
});

// DELETE request to post by id
router.delete('/:id', (req,res) => {
  Posts.remove(req.params.id)
    .then(post => {
      if(post < 1) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed" });
    })
});

// GET request for comments of a post
router.get('/:id/comments', (req,res) => {
  Posts.findPostComments(req.params.id)
    .then(post => {
      if(post.find(i => i.post_id !== req.params.id)) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The comments information could not be retrieved." });
    })
});

//POST request for commenting on a post
router.post('/:id/comments', (req,res) => {
  if(!req.params.id) {
    res.status(404).json({ message: "The post with the specified ID does not exist." });
  } else if(req.body === '') {
    res.status(400).json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.insertComment(req.body)
      .then(post => {
        res.status(201).json(req.body);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "There was an error while saving the comment to the database" });
      })
  }
});

module.exports = router;
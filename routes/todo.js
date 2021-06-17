/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const ToDoItem = require('../models/ToDoItem')


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

// We're only allow this if people are logged in
isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}


// get the value associated to the key
// user._id is the unique id for that user 
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.items = await ToDoItem.find({userId:req.user._id})
      res.render('toDoList');
});

/* add the value in the body to the list associated to the key */
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const todo = new ToDoItem(
        {item:req.body.item,
         createdAt: new Date(),
         completed: false,
         userId: req.user._id
        })
      await todo.save();
      res.redirect('/todo')
});


router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /todo/remove/:itemId")
      await ToDoItem.remove({_id:req.params.itemId});
      res.redirect('/todo')
});

// makeComplete Route
router.get('/makeComplete/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /todo/makeComplete/:itemId")
      const todo = await ToDoItem.findOne({_id:req.params.itemId});
      todo.completed = true;
      await todo.save();
      res.locals.todoOne = todo;
      res.render('completionConfirm');
      //res.redirect('/todo')
});


// switchComplete Route
router.get('/switchComplete/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /todo/switchComplete/:itemId")
      const todo = await ToDoItem.findOne({_id:req.params.itemId});
      todo.completed = !todo.completed;
      await todo.save();
      res.locals.todoOne = todo;
      res.render('switchComplete');
      //res.render('completionConfirm');
      //res.redirect('/todo')
});




module.exports = router;

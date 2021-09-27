import express from 'express';
const auth = require('../../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ToDo = require('../../models/ToDo');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/todos
// @desc     Create a todo
// @access   Private

router.post(
  '/',
  auth,
  check('content', 'Content is required').notEmpty(),
  async (req: any, res: any) => {
    console.log('In Post!');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newToDo = new ToDo({
        content: req.body.content,
        user: req.user.id,
      });

      console.log('New ToDo: ', newToDo);
      const post = await newToDo.save();

      res.json(post);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/todos
// @desc     Get all todos
// @access   Private

router.get('/', auth, async (req, res) => {
  try {
    const todos = await ToDo.find().sort({ date: -1 });
    res.json(todos);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/todos/:id
// @desc     Get post by ID
// @access   Private

router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const todo = await ToDo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: 'ToDo not found' });
    }
    res.json(todo);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/todos/:id
// @desc     Delete a todo
// @access   Private

router.delete(
  '/:id',
  [auth, checkObjectId('id')],
  async (req: any, res: any) => {
    try {
      const todo = await ToDo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ msg: 'ToDo not found' });
      }

      // Check user
      if (todo.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      await todo.remove();
      res.json({ msg: 'ToDo removed' });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/todos/:id
// @desc     Update a todo
// @access   Private

router.put(
  '/:id',
  [
    auth,
    checkObjectId('id'),
    [check('content', 'Content is required').not().isEmpty()],
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const body = req.body;
      const id = req.params.id;
      const todo = await ToDo.findById(req.params.id);
      if (todo) {
        todo.content = body.content;
      } else {
        return res.status(404).json({ msg: 'ToDo not found' });
      }
      await todo.save();
      return res.json(todo);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.get('/', auth, getTasks);

router.get('/:id', auth, getTask);

router.post('/', auth, createTask);

router.put('/:id', auth, updateTask);

router.delete('/:id', auth, deleteTask);

module.exports = router;
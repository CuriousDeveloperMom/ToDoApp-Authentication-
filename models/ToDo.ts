import mongoose from 'mongoose';

//Create Mongoose Model
const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('todo', TodoSchema);

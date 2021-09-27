const mongoose = require('mongoose');
// middleware to check for a valid object id
const checkObjectId = (idToCheck: any) => (req: any, res: any, next: any) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    return res.status(400).json({ msg: 'Invalid ID' });
  next();
};

module.exports = checkObjectId;

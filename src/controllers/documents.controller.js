const axios = require('axios');

const getDocument = async (req, res) => {
  try {
    res.json({ message:'found'});
  } catch (error) {
    res.status(500).send(error.message);
  }
};
module.exports = { getDocument }

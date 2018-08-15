const path = require('path');

exports.getAllEndpoints = (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
};


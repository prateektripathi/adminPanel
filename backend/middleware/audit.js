const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {
  // minimal: you can expand to save into Audit collection
  console.log(`[AUDIT] ${req.method} ${req.originalUrl} by ${req.user?.email || 'anon'}`);
  next();
});

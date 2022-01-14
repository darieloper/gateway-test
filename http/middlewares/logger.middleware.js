module.exports = (req, resp, next) => {
  console.log(`[${req.method}] ${req.path}\t${new Date()}`);
  next();
}
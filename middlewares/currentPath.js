// suraish add this currentPath middleware:

const currentPath = (req, res, next) => {
  res.locals.currentPath = req.path;
  next();
};

export default currentPath;

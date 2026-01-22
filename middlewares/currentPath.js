// suraish add this currentPath middleware:

const currentPath = (req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.params = req.params; // This grabs the dynamic ID like :id
  next();
};

export default currentPath;

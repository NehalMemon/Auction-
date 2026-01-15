
const adminController = {};

adminController.renderDashboard = async (req, res) => {
   const currentAdmin = req.user;
   res.render('adminDashboard', { 
   admin: currentAdmin
});
}

export default adminController;
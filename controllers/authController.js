import Admin from '../models/adminModel.js'
const authController = {}



authController.registerPost = async (req, res) => {
   try {
      const { name, email, password } = req.validatedData;

      const existingAdmin = Admin.findOne({ where: { email } });

      if (existingAdmin) {
         return res.status(400).json({ message: "Admin already exists" });
      }

      const newAdmin = new Admin({ name, email, password });
      await newAdmin.save();
      res.status(201).json({ message: "Admin created successfully" });
   }
   catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
authController.registerGet = (req, res) => {
   res.send("Register get endpoint working fine!");
}

authController.signinPost = (req, res) => {
   res.send("Signin post endpoint working fine!");
}
authController.signinGet = (req, res) => {
   res.send("Signin get endpoint working fine!");
}

authController.forgetPasswordPost = (req, res) => {
   res.send("forget post endpoint working fine!");
}
authController.forgetPasswordGet = (req, res) => {
   res.send("forget get endpoint working fine!");
}

authController.resetPasswordPost = (req, res) => {
   res.send("reset post endpoint working fine!");
}
authController.resetPasswordGet = (req, res) => {
   res.send("reset get endpoint working fine!");
}

authController.signuotPost = (req, res) => {
   res.send("Signout post endpoint working fine!");
}

authController.updatePatch = (req, res) => {
   const { id } = req.params;
   res.send(`update patch endpoint for id ${id} is working fine!`);
}

authController.updateGet = (req, res) => {
   res.send("update Get endpoint working fine!");
}

authController.deleteDelete = (req, res) => {
   const { id } = req.params;
   res.send("delete delete endpoint for id ${id} is working fine!");
}

export default authController;
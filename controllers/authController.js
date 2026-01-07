
const authController= {}


authController.greet = (req,res)=>{
   res.send("Hello, welcome to the owner controller API!");
}

authController.signupPost = (req,res)=>{
   res.send("Signup post endpoint working fine!");
}
authController.signupGet = (req,res)=>{
   res.send("Signup get endpoint working fine!");
}

authController.signinPost = (req,res)=>{
   res.send("Signin post endpoint working fine!");
}
authController.signinGet = (req,res)=>{
   res.send("Signin get endpoint working fine!");
}

authController.forgetPost = (req,res)=>{
   res.send("forget post endpoint working fine!");
}
authController.forgetGet = (req,res)=>{
   res.send("forget get endpoint working fine!");
}
authController.signuotPost = (req,res)=>{
   res.send("Signout post endpoint working fine!");
}
authController.updatePatch = (req,res)=>{
   const {id}=req.params;   
   res.send(`update patch endpoint for id ${id} is working fine!`);
}
authController.updateGet = (req,res)=>{
   res.send("update Get endpoint working fine!");
}
authController.deleteDelete = (req,res)=>{
   const {id}=req.params; 
   res.send("delete delete endpoint for id ${id} is working fine!");
}

export default authController;
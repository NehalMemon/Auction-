
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
   res.send("Signin endpoint working fine!");
}
authController.signinGet = (req,res)=>{
   res.send("Signin endpoint working fine!");
}

authController.forgetPost = (req,res)=>{
   res.send("Signin endpoint working fine!");
}
authController.forgetGet = (req,res)=>{
   res.send("Signin endpoint working fine!");
}

export default authController;
const playerController= {}


playerController.greet = (req,res)=>{
   res.send("Hello, welcome to the player controller API!");
}

export default playerController;
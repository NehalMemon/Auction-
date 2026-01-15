import Admin from '../models/adminModel.js'
// import Owner from '../models/ownerModel.js'
import bcrypt from 'bcrypt';
import Owner from '../models/ownerModel.js'
import RefreshToken from '../models/refreshTokenModel.js';
import tokenHash from '../utils/tokenHasher.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

const playerController= {}


playerController.renderRegister = async (req, res) => {
   try {
      res.render('createPlayer', { title: 'Register New Player' });
   }
   catch (error) {
      console.error("Error in GET /register:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
playerController.handleRegister = async (req, res) => {
   try {

      const { name, email, password } = req.validatedData;


      const existingPlayer = await Owner.findOne({ where: { email } });

      if (existingPlayer) {
         return res.render('createPlayer', {
            title: 'Register New Player',
            error_msg: 'Email already exists!',
            oldInput: {
               name: req.body.name,
               email: req.body.email
            }
         });
      }


      const hash = await bcrypt.hash(password, 10);
      await Owner.create({ name, email, password: hash });


      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/auth/admin/dashboard');
   } catch (error) {
      console.error("Error creating owner:", error);


      return res.render('createOwner', {
         title: 'Register New Owner',
         error_msg: 'Something went wrong. Please try again.',
         oldInput: req.body
      });
   }
}

playerController.renderAllPlayers = async (req, res) => {
   try {
      const players = await Owner.findAll();  
      res.render('players', { title: 'All Players', players });
   } catch (error) {
      console.error("Error fetching owners:", error);
      res.status(500).json({ message: "Internal server error" });
   }  
}

export default playerController;
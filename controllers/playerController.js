import bcrypt from 'bcrypt';
import Player from '../models/playerModel.js'
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

      const { name, email, phoneNumber,playingStyle, category,battingOrder,bowlingType  } = req.validatedData;


      const existingPlayer = await Player.findOne({ where: { email } });

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
      await Player.create({ name, email, phoneNumber,playingStyle, category,battingOrder,bowlingType });


      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/admin/dashboard');
   } catch (error) {
      console.error("Error creating player:", error);


      return res.render('createPlayer', {
         title: 'Register New Player',
         error_msg: 'Something went wrong. Please try again.',
         oldInput: req.body
      });
   }
}

playerController.renderAllPlayers = async (req, res) => {
   try {
      const players = await Player.findAll();  
      res.render('players', { title: 'All Players', players });
   } catch (error) {
      console.error("Error fetching owners:", error);
      res.status(500).json({ message: "Internal server error" });
   }  
}

export default playerController;
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
      const { name, email, phoneNumber } = req.validatedData;
      console.log(req.validationData);
    
      let { playingStyle, category, battingOrder, bowlingType, auctionCategory } = req.body; 
      console.log(req.body);
      console.log(req.file);
     
      if (bowlingType === "") {
          bowlingType = null;
      }

      const imageUrl = req.file ? req.file.path : null;

      await Player.create({ 
          name, 
          email, 
          phoneNumber, 
          playingStyle, 
          category, 
          battingOrder, 
          bowlingType,
          auctionCategory,
          playerImage: imageUrl 
      });

      req.flash('success', 'Player registered successfully.');
      return res.redirect('/admin/dashboard');

   } catch (error) {
    
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


playerController.renderPlayerProfile = async (req, res) => {
   try {
      const playerId = req.params.id;
      const player = await Player.findByPk(playerId);  
      
      res.render('playerProfile', { title: 'Player Profile', player });
   } catch (error) {
      console.error("Error fetching owners:", error);
      res.status(500).json({ message: "Internal server error" });
   }  
}

export default playerController;
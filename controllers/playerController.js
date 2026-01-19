import bcrypt from 'bcrypt';
import Player from '../models/playerModel.js'
import RefreshToken from '../models/refreshTokenModel.js';
import tokenHash from '../utils/tokenHasher.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { encodeId, decodeId } from '../utils/idHasher.js';

const playerController = {}


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
      const securePlayers = players.map(player => {
         const p = player.get({ plain: true });
         p.hashedId = encodeId(p.id);
         // console.log(p.hashedId)
         return p
      })
      res.render('players', { title: 'All Players', players: securePlayers });


   } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

playerController.renderPlayerProfile = async (req, res) => {
   try {

      const Id = req.params.id;
      console.log(Id)
      const playerId = decodeId(Id);
      // console.log(playerId)
      if (!playerId) {
         return res.status(400).json({ message: "invalid id" })
      }
      const player = await Player.findByPk(playerId);
      if (!player) {
         return res.status(404).json({ message: "Player not found" });
      }

      const playerData = player.get({ plain: true });
      playerData.id = playerId;
      playerData.hashedId = playerId;

      res.render('playerProfile', { player: playerData });


   } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

playerController.renderEdit = async (req, res) => {
   try {
      const Id = req.params.id;
      console.log(Id)
      const playerId = decodeId(Id);
      
      if (!playerId) {
         return res.status(400).json({ message: "invalid id" })
      }
      const player = await Player.findByPk(playerId);
      if (!player) {
         return res.status(404).json({ message: "Player not found" });
      }

      const playerData = player.get({ plain: true });
      playerData.id = playerId;
      playerData.hashedId = playerId;
      res.render('createPlayer',{ player: playerData }, { title: 'edit  Player' });
   }
   catch (error) {
      console.error("Error in GET /edit:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

playerController.handleEdit = async (req, res) => {
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


export default playerController;
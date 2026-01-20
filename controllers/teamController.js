import db from '../models/index.js';
const { Team, Owner } = db;
import bcrypt from 'bcrypt';
import RefreshToken from '../models/refreshTokenModel.js';
import tokenHash from '../utils/tokenHasher.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { encodeId, decodeId } from '../utils/idHasher.js';
import { Op } from 'sequelize';

const teamController = {}


teamController.renderRegister = async (req, res) => {
   try {
      const assignedTeams = await Team.findAll({
         attributes: ['ownerId'],
         where: {
            ownerId: { [Op.ne]: null }
         }
      });


      const assignedOwnerIds = assignedTeams.map(team => team.ownerId);


      const availableOwners = await Owner.findAll({
         where: {
            id: {
               [Op.notIn]: assignedOwnerIds
            }
         }
      });
      res.render('createTeam', { owners: availableOwners, title: 'Register New Team' });
   }
   catch (error) {
      console.error("Error rendering create team page:", error);
      req.flash('error', error);
      res.redirect('/admin/dashboard');
   }
}

teamController.handleRegister = async (req, res) => {
   try {
      const {Name} = req.validatedData;
      // console.log(req.validationData);

      let { ownerId } = req.body;
      // console.log(req.body);
      // console.log(req.file);

      const imageUrl = req.file ? req.file.path : null;

      await Team.create({
         name:Name,
         ownerId,
         teamLogo:imageUrl
      }
      )

      req.flash('success', 'working successfully successfully.');
      return res.redirect('/admin/dashboard');

   } catch (error) {
      console.error("Error in creating team /POST:", error);
      req.flash('error', 'Unable to load owner list');
      res.redirect('/auth/team/register')
   }
}

teamController.renderAllTeams = async (req, res) => {
   try {
      const teams = await Team.findAll(
         { include: [{ model: Owner,
              as: 'owner'
             }] }
      );
      const secureTeams = teams.map(team => {
         const t = team.get({ plain: true });
         t.hashedId = encodeId(t.id);
         // console.log(p.hashedId)
         return t
      })
      res.render('teams', { title: 'All team', teams: secureTeams });


   } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

teamController.renderPlayerProfile = async (req, res) => {
   try {

      const Id = req.params.id;

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
      playerData.hashedId = Id;

      res.render('playerProfile', { player: playerData });


   } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

teamController.renderEdit = async (req, res) => {
   try {
      const Id = req.params.id;

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
      playerData.hashedId = Id;
      res.render('editPlayer', { player: playerData, title: 'edit  Player' });
   }
   catch (error) {
      console.error("Error in GET /edit:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

teamController.handleEdit = async (req, res) => {
   try {
      const Id = req.params.id;
      const playerId = decodeId(Id);

      if (!playerId) {
         req.flash('error', 'Invalid ID');
         return res.redirect('/admin/players');
      }

      // 1. Find the Player Instance
      const player = await Player.findByPk(playerId);
      if (!player) {
         req.flash('error', 'Player not found');
         return res.redirect('/admin/players');
      }

      const { name, email, phoneNumber } = req.validatedData;
      console.log(req.validationData);

      let { playingStyle, category, battingOrder, bowlingType, auctionCategory, campus, basePrice } = req.body;
      console.log(req.body);
      console.log(req.file);

      if (bowlingType === "") {
         bowlingType = null;
      }


      const imageUrl = req.file ? req.file.path : player.playerImage;


      await player.update({
         name,
         email,
         phoneNumber,
         campus,
         playingStyle,
         category,
         battingOrder,
         bowlingType,
         auctionCategory,
         basePrice,
         playerImage: imageUrl
      });

      req.flash('success', 'Player updated successfully!');
      return res.redirect('/admin/dashboard');

   } catch (error) {
      console.error("Error updating player:", error);
      req.flash('error', 'Failed to update player');
      return res.redirect(`/admin/players/edit/${req.params.id}`);
   }
}


export default teamController;
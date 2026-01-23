import express from 'express';
import auctionApiController from '../controllers/auctionApiController.js';

const router = express.Router();

// Get current auction state (for polling)
router.get('/state', auctionApiController.getState);

// Session control (Admin only)
router.post('/session/start', auctionApiController.startSession);
router.post('/session/end', auctionApiController.endSession);

// Player auction control (Admin only)
router.post('/player/call', auctionApiController.callPlayer);
router.post('/sold', auctionApiController.markSold);
router.post('/unsold', auctionApiController.markUnsold);

// Bidding (Owner only)
router.post('/bid', auctionApiController.placeBid);

// Bid history
router.get('/bid-history/:playerId', auctionApiController.getBidHistory);

export default router;

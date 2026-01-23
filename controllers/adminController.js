
const adminController = {};

adminController.renderDashboard = async (req, res) => {
   const currentAdmin = req.user;
   res.render('adminDashboard', { 
   admin: currentAdmin
});
}

adminController.renderAuction = async (req, res) => {
 const currentSession = await Auction.findOne({ where: { status: 'active' }, include: ['currentPlayer'] });
    
    // 2. Fetch all players who are still 'available'
    const availablePlayers = await Player.findAll({ where: { status: 'available' } });

    res.render('adminAuction', {
        players: availablePlayers,
        isSessionActive: global.auctionActive, // Use the global toggle we discussed
        activeAuction: currentSession, // Will be null if no player is called
        title: 'Admin Auction'
    });

}

export default adminController;
import Admin from '../models/adminModel.js'
// import Owner from '../models/ownerModel.js'
import bcrypt from 'bcrypt';
import Owner from '../models/ownerModel.js'
import RefreshToken from '../models/refreshTokenModel.js';
import tokenHash from '../utils/tokenHasher.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

const ownerController= {}


ownerController.renderRegister = async (req, res) => {
   try {
      res.render('createOwner', { title: 'Register New Owner' });
   }
   catch (error) {
      console.error("Error in GET /register:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
ownerController.handleRegister = async (req, res) => {
   try {

      const { name, email, password } = req.validatedData;


      const existingOwner = await Owner.findOne({ where: { email } });

      if (existingOwner) {
         return res.render('createOwner', {
            title: 'Register New Owner',
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

ownerController.renderSignin = (req, res) => {
   try {
      res.render('ownerSignin', { title: 'Sign In Owner' });
   }
   catch (error) {
      console.error("Error in GET /register:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
ownerController.handleSignin = async (req, res) => {
   try {
      const { email, password } = req.validatedData;

      const owner = await Owner.findOne({ where: { email } });

      if (!owner) {
         req.flash('error', 'Invalid email or password.');
         return res.status(400).redirect('/auth/owner/signin');
      }
      // console.log(owner.id)
      const validPassword = await bcrypt.compare(password, owner.password);
      if (!validPassword) {
         // console.log("Password did not match");
         req.flash('error', 'Invalid email or password.');
         return res.status(400).redirect('/auth/owner/signin');
      }
      // console.log("Password matched");

      const accessToken = generateAccessToken(owner);
      // console.log("Access token generated");
      // console.log(accessToken.slice(0,10)+"...");
      const oldRefreshToken = RefreshToken.findOne({ where: { userId: owner.id } });
      if (oldRefreshToken) {
         await RefreshToken.destroy({where:{userId: owner.id}});
      }
      const refreshToken = generateRefreshToken(owner);
      const hashedToken = tokenHash(refreshToken);
      const expiryDate = new Date().getDate() + parseInt(process.env.REFRESH_TOKEN_LIFE);

      await RefreshToken.create({
         token: hashedToken,
         userId: owner.id,
         expiryDate: expiryDate
      })


      res.cookie("accessToken", accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: process.env.ACCESS_TOKEN_LIFE
      });

      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: process.env.REFRESH_TOKEN_LIFE
      });


      req.flash('success', 'Signed in successfully!');
      return res.status(200).redirect('/admin/dashboard');

   }
   catch (error) {
      console.error("Error in POST /signin:", error);
      req.flash('error', 'An error occurred during sign in. Please try again.');
      return res.status(500).redirect('/auth/admin/signin');
   }
}

ownerController.renderDashboard = async (req, res) => {
   const currentOwner = req.owner;
   res.render('ownerDashboard', { 
   owner: currentOwner
});
}

ownerController.renderAllOwners = async (req, res) => {
   try {
      const owners = await Owner.findAll();  
      res.render('owners', { title: 'All Owners', owners });
   } catch (error) {
      console.error("Error fetching owners:", error);
      res.status(500).json({ message: "Internal server error" });
   }  
}

ownerController.refreshToken = async (req, res, originalUrl) => {
   const refreshTokenFromCookie = req.cookies.refreshToken;

   if (!refreshTokenFromCookie) {
      req.flash('error', 'Invalid refresh token. Please login again.');
         return res.status(403).redirect('/auth/owner/signin');
   }
   try {
      const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
      const storedToken = await RefreshToken.findOne({ where: { userId: decoded.id } });

      if (!storedToken) {
         req.flash('error', 'Invalid refresh token. Please login again.');
         return res.status(403).redirect('/auth/owner/signin');
      }

      if (storedToken.token !== tokenHash(refreshTokenFromCookie)) {
         req.flash('error', 'Invalid refresh token. Please login again.');
         return res.status(403).redirect('/auth/owner/signin');
      }

      if (storedToken.expiryDate < new Date()) {
            req.flash('error', 'Refresh token expired. Please login again.');
            return res.status(403).redirect('/auth/owner/signin');
      }

      const newAccessToken = generateAccessToken({ id: decoded.id });
      const newRefreshToken = generateRefreshToken({ id: decoded.id });

      storedToken.token = tokenHash(newRefreshToken);
      storedToken.expiryDate = new Date().getDate() + parseInt(process.env.REFRESH_TOKEN_LIFE);
      await storedToken.save();

       res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });
      req.flash('success', 'User verified!');
       return res.redirect(`/auth/owner/signin?redirect=${encodeURIComponent(originalUrl || "/")}`)
   }
   catch (error) {
      console.error("Error in refreshing token:", error);
      req.flash('error', 'An error occurred while verifying user. Please login again.');
      }

}

export default ownerController;
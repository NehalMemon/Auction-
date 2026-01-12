import Admin from '../models/adminModel.js'
import bcrypt from 'bcrypt';
import RefreshToken from '../models/refreshTokenModel.js';
import tokenHash from '../utils/tokenHasher.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
const authController = {}


authController.renderRegister = async (req, res) => {
   try {
      res.render('adminRegister', { title: 'Register New Admin' });
   }
   catch (error) {
      console.error("Error in GET /register:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
authController.handleRegister = async (req, res) => {
   try {

      const { name, email, password } = req.validatedData;


      const existingAdmin = await Admin.findOne({ where: { email } });

      if (existingAdmin) {
         return res.render('adminRegister', {
            title: 'Register New Admin',
            error_msg: 'Email already exists!',
            oldInput: {
               name: req.body.name,
               email: req.body.email
            }
         });
      }


      const hash = await bcrypt.hash(password, 10);
      await Admin.create({ name, email, password: hash });


      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/api/auth/admin/signin');

   } catch (error) {
      console.error("Error creating admin:", error);


      return res.render('/api/auth/admin/signin', {
         title: 'Register New Admin',
         error_msg: 'Something went wrong. Please try again.',
         oldInput: req.body
      });
   }
}


authController.renderSignin = (req, res) => {
   try {
      res.render('adminSignin', { title: 'Sign In Admin' });
   }
   catch (error) {
      console.error("Error in GET /register:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
authController.handleSignin = async (req, res) => {
   try {
      const { email, password } = req.validatedData;

      const admin = await Admin.findOne({ where: { email } });

      if (!admin) {
         req.flash('error', 'Invalid email or password.');
         return res.status(400).redirect('/api/auth/admin/signin');
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
         req.flash('error', 'Invalid email or password.');
         return res.status(400).redirect('/api/auth/admin/signin');
      }

      const accessToken = generateAccessToken(admin);
      const oldRefreshToken = RefreshToken.findOne({ where: { userId: admin.id } });
      if (oldRefreshToken) {
         await oldRefreshToken.destroy();
      }
      const refreshToken = generateRefreshToken(admin);
      const hashedToken = tokenHash(refreshToken);
      const expiryDate = new Date().getDate() + parseInt(process.env.REFRESH_TOKEN_LIFE);

      await RefreshToken.create({
         token: hashedToken,
         userId: admin.id,
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
      return res.status(200).redirect('/api/auth/admin/dashboard');

   }
   catch (error) {
      console.error("Error in POST /signin:", error);
      req.flash('error', 'An error occurred during sign in. Please try again.');
      return res.status(500).redirect('/api/auth/admin/signin');
   }
}


authController.renderForgetPassword = (req, res) => {
   res.send("forget get endpoint working fine!");
}
authController.handleForgetPassword = (req, res) => {
   res.send("forget post endpoint working fine!");
}


authController.renderResetPassword = (req, res) => {
   res.send("reset get endpoint working fine!");
}
authController.handleResetPassword = (req, res) => {
   res.send("reset post endpoint working fine!");
}


authController.handleSignout = (req, res) => {
   res.clearCookie("accessToken");
   res.clearCookie("refreshToken");
   req.flash('success', 'You have been signed out successfully.');
   return res.status(200).redirected('/api/auth/admin/signin');

}


authController.handleUpdateProfile = (req, res) => {
   const { id } = req.params;
   res.send(`update patch endpoint for id ${id} is working fine!`);
}

authController.renderUpdateProfile = (req, res) => {
   res.send("update Get endpoint working fine!");
}

authController.handleDeleteProfile = (req, res) => {
   const { id } = req.params;
   res.send("delete delete endpoint for id ${id} is working fine!");
}

authController.renderDashboard = (req, res) => {
   const { id } = req.params;
   res.send(`dashboard get endpoint for id ${id} is working fine!`);
}

authController.refreshToken = async (req, res, originalUrl) => {
   const refreshTokenFromCookie = req.cookies.refreshToken;

   if (!refreshTokenFromCookie) {
      return res.status(401).json({ message: "Refresh token not provided" });
   }
   try {
      const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
      const storedToken = await RefreshToken.findOne({ where: { userId: decoded.id } });

      if (!storedToken) {
         req.flash('error', 'Invalid refresh token. Please login again.');
         return res.status(403).redirect('/api/auth/admin/signin');
      }

      if (storedToken.token !== tokenHash(refreshTokenFromCookie)) {
         req.flash('error', 'Invalid refresh token. Please login again.');
         return res.status(403).redirect('/api/auth/admin/signin');
      }

      if (storedToken.expiryDate < new Date()) {
            req.flash('error', 'Refresh token expired. Please login again.');
            return res.status(403).redirect('/api/auth/admin/signin');
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
       return res.redirect(`/api/auth/admin/signin?redirect=${encodeURIComponent(originalUrl || "/")}`)
   }
   catch (error) {
      console.error("Error in refreshing token:", error);
      req.flash('error', 'An error occurred while verifying user. Please login again.');
      }

}

export default authController;
import db from "../models/index.js";
const { Owner, Team } = db;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshTokenModel.js";
import tokenHash from "../utils/tokenHasher.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { encodeId, decodeId } from "../utils/idHasher.js";

const ownerController = {};

ownerController.renderRegister = async (req, res) => {
  try {
    res.render("createOwner", { title: "Register New Owner" });
  } catch (error) {
    console.error("Error in GET /register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ownerController.handleRegister = async (req, res) => {
//   try {
//     const { name, email, password } = req.validatedData;

//     const imageURL = req.file ? req.file.path : null;

//     //   console.log("Data:", req.validatedData);
//     //   console.log("File:", req.file);
//     const existingOwner = await Owner.findOne({ where: { email } });

//     if (existingOwner) {
//       req.flash("error", "Email already exists!");
//       return res.status(400).render("createOwner", {
//         title: "Create New Owner",
//         error_msg: "Email already exists!",
//         oldInput: { name, email },
//         csrfToken: req.csrfToken ? req.csrfToken() : "",
//       });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     await Owner.create({
//       name,
//       email,
//       password: hash,
//       image: imageURL,
//     });

//     req.flash("success", "Owner registered successfully!");
//     return res.redirect("/admin/dashboard");
//   } catch (error) {
//     console.error("Error creating owner:", error);
//     req.flash("error", "Registration failed. Please try again.");
//     return res.status(500).redirect("/auth/owner/register");
//   }
// };

// suraish add below "handleRegister" function:
ownerController.handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.validatedData;

    const imageURL = req.file ? req.file.path : null;

    const existingOwner = await Owner.findOne({
      where: { email },
      paranoid: false,
    });

    if (existingOwner) {
      if (!existingOwner.deletedAt) {
        req.flash("error", "Email already exists!");
        return res.status(400).render("createOwner", {
          title: "Create New Owner",
          oldInput: { name, email },
          error_msg: "Email already exists!",
          csrfToken: req.csrfToken ? req.csrfToken() : "",
        });
      }

      // mask email of soft-deleted user
      await existingOwner.update({
        email: `${existingOwner.email}__deleted__${Date.now()}`,
      });
    }
    const hash = await bcrypt.hash(password, 10);

    await Owner.create({
      name,
      email,
      password: hash,
      image: imageURL,
    });

    req.flash("success", "Owner registered successfully!");
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error creating owner:", error);
    req.flash("error", "Registration failed. Please try again.");
    return res.status(500).redirect("/auth/owner/register");
  }
};

ownerController.renderSignin = (req, res) => {
  try {
    res.render("ownerSignin", { title: "Sign In Owner" });
  } catch (error) {
    console.error("Error in GET /register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
ownerController.handleSignin = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    const owner = await Owner.findOne({
      where: { email },
      attributes: ["id", "name", "email", "password"],
    });

    if (!owner) {
      req.flash("error", "Invalid email or password.");
      return res.status(400).redirect("/auth/owner/signin");
    }

    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      req.flash("error", "Invalid email or password.");
      return res.status(400).redirect("/auth/owner/signin");
    }
    const accessToken = generateAccessToken(owner, "owner");

    const oldRefreshToken = RefreshToken.findOne({
      where: { userId: owner.id },
    });
    if (oldRefreshToken) {
      await RefreshToken.destroy({ where: { userId: owner.id } });
    }
    const refreshToken = generateRefreshToken(owner, "owner");
    const hashedToken = tokenHash(refreshToken);
    const expiryDate = new Date(
      Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFE),
    );

    await RefreshToken.create({
      token: hashedToken,
      userId: owner.id,
      expiryDate: expiryDate,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: process.env.ACCESS_TOKEN_LIFE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: process.env.REFRESH_TOKEN_LIFE,
    });

    const hashedId = encodeId(owner.id);

    req.flash("success", "Signed in successfully!");
    return res.status(200).redirect(`/owner/profile/${hashedId}`);
  } catch (error) {
    console.error("Error in POST /signin:", error);
    req.flash("error", "An error occurred during sign in. Please try again.");
    return res.status(500).redirect("/auth/owner/signin");
  }
};

ownerController.renderDashboard = async (req, res) => {
  const currentOwner = req.owner;
  res.render("ownerDashboard", {
    owner: currentOwner,
  });
};

ownerController.renderAllOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll({
      include: [
        {
          model: Team,
          as: "team",
        },
      ],
    });
    const secureOwners = owners.map((owner) => {
      const t = owner.get({ plain: true });
      t.hashedId = encodeId(t.id);
      // console.log(p.hashedId)
      return t;
    });
    res.render("owners", { title: "All Owners", owners: secureOwners });
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

ownerController.renderOwnerProfile = async (req, res) => {
  try {
    const Id = req.params.id;
    const ownerId = decodeId(Id);

    if (!ownerId) {
      return res.status(400).json({ message: "invalid id" });
    }

    const owner = await Owner.findByPk(ownerId, {
      include: [
        {
          model: Team,
          as: "team",
        },
      ],
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const ownerData = owner.get({ plain: true });
    ownerData.id = ownerId;
    ownerData.hashedId = Id;

    // FIXED: Only try to encode teamId if owner.team is NOT null
    if (owner.team) {
      ownerData.teamId = encodeId(owner.team.id);
    } else {
      ownerData.teamId = null;
    }

    res.render("ownerProfile", { owner: ownerData });
  } catch (error) {
    console.error("Error fetching powner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

ownerController.renderEdit = async (req, res) => {
  try {
    const Id = req.params.id;

    const ownerId = decodeId(Id);

    if (!ownerId) {
      return res.status(400).json({ message: "invalid id" });
    }
    const owner = await Owner.findByPk(ownerId, {
      include: [
        {
          model: Team,
          as: "team",
        },
      ],
    });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const ownerData = owner.get({ plain: true });
    ownerData.id = ownerId;
    ownerData.hashedId = Id;
    res.render("editOwner", { owner: ownerData, title: "edit  Owner" });
  } catch (error) {
    console.error("Error in GET /edit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
ownerController.handleEdit = async (req, res) => {
  try {
    const Id = req.params.id;
    const ownerId = decodeId(Id);

    if (!ownerId) {
      req.flash("error", "Invalid ID");
      return res.redirect("/owner/ownerslist");
    }

    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      req.flash("error", "owner not found");
      return res.redirect("/admin/owner");
    }

    const { name, email, password } = req.validatedData;

    const imageUrl = req.file ? req.file.path : owner.image;

    await owner.update({
      name,
      email,
      password,
      image: imageUrl,
    });

    req.flash("success", "Owner updated successfully!");
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating owner:", error);
    req.flash("error", "Failed to update owner");
    return res.redirect(`/owner/profile/edit/${req.params.id}`);
  }
};

ownerController.handleDelete = async (req, res) => {
  try {
    const Id = req.params.id;
    const ownerId = decodeId(Id);

    if (!ownerId) {
      req.flash("error", "Invalid ID");
      return res.redirect("/owner/ownerslist");
    }

    // Delete player
    await Owner.destroy({
      where: { Id: ownerId }, // or hashedId if you store it in db
    });

    req.flash("success", "Owner deleted successfully!");
    return res.redirect("/owner/ownerslist");
  } catch (error) {
    console.error("Error deleting owner:", error);
    req.flash("error", "Failed to delete owner");
    return res.redirect(`/owner/ownerslist${req.params.id}`);
  }
};

ownerController.refreshToken = async (req, res, originalUrl) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;

  if (!refreshTokenFromCookie) {
    req.flash("error", "Invalid refresh token. Please login again.");
    return res.status(403).redirect("/auth/owner/signin");
  }
  try {
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const storedToken = await RefreshToken.findOne({
      where: { userId: decoded.id },
    });

    if (!storedToken) {
      req.flash("error", "Invalid refresh token. Please login again.");
      return res.status(403).redirect("/auth/owner/signin");
    }

    if (storedToken.token !== tokenHash(refreshTokenFromCookie)) {
      req.flash("error", "Invalid refresh token. Please login again.");
      return res.status(403).redirect("/auth/owner/signin");
    }

    if (storedToken.expiryDate < new Date()) {
      req.flash("error", "Refresh token expired. Please login again.");
      return res.status(403).redirect("/auth/owner/signin");
    }

    const newAccessToken = generateAccessToken({ id: decoded.id });
    const newRefreshToken = generateRefreshToken({ id: decoded.id });

    storedToken.token = tokenHash(newRefreshToken);
    storedToken.expiryDate =
      new Date().getDate() + parseInt(process.env.REFRESH_TOKEN_LIFE);
    await storedToken.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    req.flash("success", "User verified!");
    return res.redirect(
      `/auth/owner/signin?redirect=${encodeURIComponent(originalUrl || "/")}`,
    );
  } catch (error) {
    console.error("Error in refreshing token:", error);
    req.flash(
      "error",
      "An error occurred while verifying user. Please login again.",
    );
  }
};

export default ownerController;

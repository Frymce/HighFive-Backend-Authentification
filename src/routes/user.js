const express = require("express");
const router = express.Router();

const userManagement = require("../utils/managementUser");
const tokenManagement = require("../utils/managementToken");

const options = {
  httpOnly: true,
  sameSite: "strict",
  secure: false,
  maxAge: 3 * 60 * 1000,
};

let refreshTokenDB = [];

router.post("/login", (req, res) => {
  const data = ({ email, motDePasse } = req.body);

  const user = userManagement.searchUser(data.email);

  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
  if (user.motDePasse !== data.motDePasse) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  //on, veux generer un token
  const payload = {
    email: user.email,
    id: user.id,
    role: user.role,
  };
  const token = tokenManagement.generateToken(payload);
  const refreshToken = tokenManagement.genrateRefreshToken(payload);

  res.cookie("token", token, options);
  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 15 * 60 * 1000,
  });

  // const op = localStorage.setItem('token', options)

  refreshTokenDB.push(refreshToken);

  res.status(200).json({
    message: "Connexion réussir 🈯🈯",
    token,
    refreshToken,
  });
});

router.get("/home", (req, res) => {
  const token = req.cookies["token"];

//   if (!token) {
//     return res.status(401).json({ message: "Token manquant" });
//   }
  try {
    const payload = tokenManagement.decodeToken(
      token,
      process.env.ACCESS_TOKEN_KEY
    );
    // console.log(payload);
    res.status(201).json({messsage: "Connexion réussie !", payload})
  } catch (error) {
    switch (error.name) {
      case "JsonWebTokenError":
        res.status(401).json({ message: "Token invalid" });
        break;
      case "TokenExpireError":
        res.status(401).json({ message: "Token Expire" });
        break;
      default:
        res.status(500).json({ message: "une erreur inatendue est produit" });
        break;
    }
  }
});

router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).json({ message: "RefreshToken manquant" });
  }
  if (!refreshTokenDB) {
    return res.status(401).json({ message: "RefreshToken invalid" });
  }
  try {
    const payload = tokenManagement.decodeToken(
      token,
      process.env.REFRESH_TOKE_KEY
    );

    const newPayload = {
      email: payload.email,
      id: payload.id,
      role: payload.role,
    };

    const newToken = tokenManagement.generateToken(newPayload);
    res.cookie("newToken", newToken, options);
    res.status(200).json({
        message: 'Connexion réussie 📶🈯',
        newToken,
        refreshToken,
    });

  } catch (error) {
    switch (error.name) {
      case "JsonWebTokenError":
        res.status(401).json({ message: "Token invalid" });
        break;
      case "TokenExpireError":
        res.status(401).json({ message: "Token Expire" });
        break;
      default:
        res.status(500).json({ message: "une erreur innatendue " });
        break;
    }
  }
});

router.post("/logout", (req, res) => {
  const refreshToken = req.cookies["refresh"];
  refreshTokenDB = refreshTokenDB.filter((token) => token !== refreshToken);

  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Deconnexion réussie !" });
});
module.exports = router;

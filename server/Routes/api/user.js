const userModel = require("../../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYAPI";
const Otp = require("../../Models/Otp");
var randomstring = require("randomstring");
let auth = require("../auth");
let router = require("express").Router();

router.post("/signup", async (req, res) => {
  try {
    console.log("------------------------", req.body);
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let otpCode = Math.floor(Math.random() * 10000) + 1;

    var result = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      otp: otpCode,
      expireIn: new Date().getTime() + 300 * 1000,
    });

    // const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);

    mailer(email, otpCode);

    res.status(201).json({ user: result }); // Send success response here
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" }); // Send error response here
  }
});

router.post("/signin", async (req, res) => {
  console.log("------------------------", req.body);
  const { email, password } = req.body;
  try {
    var existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }
    const matchPassword = bcrypt.compareSync(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!existingUser.isVerified) {
      return res.status(400).json({ message: "User not Verified" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    console.log("token is ", token);

    existingUser.token = token;
    await existingUser.save();
    res.status(200).json({ user: existingUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// router.post("/change-user-password", async (req, res) => {
//   try {
//     console.log("--------------------------", req.body);

//     const { email, oldpassword, newpassword } = req.body;

//     const response = {};

//     let user = await userModel.findOne({ email });

//     if (user) {
//       const isOldPasswordValid = await bcrypt.compare(
//         oldpassword,
//         user.password
//       );

//       if (isOldPasswordValid) {
//         const hashedPassword = await bcrypt.hash(newpassword, 10);
//         user.password = hashedPassword;
//         await user.save();
//         response.message = "Password Changed Successfully";
//         response.statusText = "success";
//         console.log("Password changed successfully");
//         return res.status(200).json(response);
//       } else {
//         response.message = "Old password is Incorrect";
//         response.statusText = "error";
//         console.log("Old password is incorrect");
//         return res.status(401).json(response);
//       }
//     } else {
//       response.message = "User not found";
//       response.statusText = "error";
//       console.log("User not found");
//       return res.status(404).json(response);
//     }
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ message: "An error occurred" });
//   }
// });

router.post("/emailsend", async (req, res) => {
  try {
    let data = await userModel.findOne({ email: req.body.email });

    console.log("data find", data);
    const responseType = {};
    if (data) {
      let otpCode = Math.floor(Math.random() * 10000) + 1;
      // Update the user document with the new OTP code and expiration time
      const updatedUser = await userModel.findOneAndUpdate(
        { email: req.body.email },
        {
          otp: otpCode,
          expireIn: new Date().getTime() + 300 * 1000, // Set the expiration time
        },
        { new: true } // To return the updated user document
      );

      let otpResponse = await updatedUser.save();
      responseType.statusText = "Success";
      mailer(req.body.email, otpCode);
      responseType.message = "Please Check your email id";
      res.status(200).json(responseType);
    } else {
      console.log("error exists");
      responseType.statusText = "Error";
      responseType.message = "Email Id does not exist !!!!";
      res.status(400).json(responseType);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusText: "Error",
      message: "Internal Server Error",
    });
  }
});

router.post("/signup-verification", async (req, res) => {
  try {
    console.log("Received OTP verification request:", req.body);
    const data = await userModel.find({
      email: req.body.email,
      otp: req.body.otpCode,
    });
    const response = {};

    console.log("Found OTP data:", data);

    if (data && data.length > 0) {
      const currentTime = new Date().getTime();
      const diff = data[0].expireIn - currentTime;

      if (diff < 0) {
        response.message = "Token has expired";
        response.statusText = "error";
        res.status(200).json(response);
      } else {
        const user = await userModel.findOne({ email: req.body.email });
        if (user) {
          user.isVerified = true;
          await user.save();
          response.message = "Email verification completed successfully";
          response.statusText = "Success";
          res.status(200).json(response);
        } else {
          response.message = "User not found";
          response.statusText = "error";
          res.status(404).json(response);
        }
      }
    } else {
      response.message = "Invalid OTP";
      response.statusText = "error";
      res.status(400).json(response);
      console.log(
        "Invalid OTP for email:",
        req.body.email,
        "and code:",
        req.body.otpCode
      );
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusText: "error",
      message: "Internal Server Error",
    });
  }
});

router.post("/otpCheck/:type", async (req, res) => {
  try {
    console.log("--------------------------", req.body, req.params.type);
    const response = {}; // Create a response object
    const otp = req.body;
    console.log(otp, "otppppppppppp");
    // Find the user by email and OTP code
    const data = await userModel.findOne({
      email: req.body.email,
      code: req.body.otp,
    });

    console.log("DATA:", data);

    if (data) {
      const currentTime = new Date().getTime();
      const diff = data.expireIn - currentTime;

      if (diff < 0) {
        response.message = "Token error";
        response.statusText = "error";
        return res.status(400).json(response); // Return early
      }
      console.log("Result", req.body.otp !== data.otp, data.otp, req.body.otp);
      if (req.body.otpCode !== data.otp) {
        // The OTPs do not match, return an error response
        response.message = "Invalid OTP";
        response.statusText = "error";
        console.log("Invalid OTP for email:", req.body.email);
        return res.status(400).json(response); // Return early
      }

      if (req.params.type === "1") {
        // Compare with string "1"
        data.isVerified = true;
        await data.save(); // Save changes to the user
        response.message = "Email verification completed successfully";
        response.statusText = "success";
        return res.status(200).json(response); // Return early
      } else {
        data.passwordResetToken = randomstring.generate(7);
        await data.save(); // Save changes to the user

        // Send the passwordResetToken in the response
        response.message = "Token updated successfully";
        response.statusText = "success";
        response.passwordResetToken = data.passwordResetToken; // Include the token in the response
        return res.status(200).json(response); // Return early
      }
    } else {
      response.message = "Invalid OTP";
      response.statusText = "error";
      console.log("Invalid OTP for email:", req.body.email);
      return res.status(400).json(response); // Return early
    }
  } catch (e) {
    console.log("Error occurred:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/change-password/newPassword/:email/:token1", async (req, res) => {
  try {
    const email = req.params.email;
    const token1 = req.params.token1;
    console.log("TOKEN1", token1);
    console.log("--------------------------", req.body);

    // Find the user by email
    let user = await userModel.findOne({
      email: email,
    });

    const response = {};

    console.log("DATA:", req.body);
    console.log("TOKEN2", user ? user.passwordResetToken : null);

    if (user && token1 === user.passwordResetToken) {
      // Check if the token matches the user's passwordResetToken
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
      await user.save();
      response.message = "Password Changed Successfully";
      response.statusText = "Success";
      return res.status(200).json(response);
    } else {
      response.message = "User not found or invalid token";
      response.statusText = "error";
      return res.status(404).json(response);
    }
  } catch (e) {
    console.error("Error occurred:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const mailer = (email, otp) => {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "akrajian1@gmail.com", // Replace with your Gmail email
      pass: "lnscntvyhggycrgx", // Replace with your Gmail app-specific password or use a secure method
    },
  });

  var mailOptions = {
    from: "akrajian1@gmail.com", // Replace with your Gmail email
    to: email, // Use the recipient email passed as an argument
    subject: "OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

router.get("/context-handling", auth, async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming userId is the ObjectId string
    const user = await userModel.findOne({ _id: userId }); // Query using _id field
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

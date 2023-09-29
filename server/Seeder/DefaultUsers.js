const User = require("../Models/User");

const defaultUsers = async () => {
  // Seed Admin
  {
    let admin = new User();
    admin.name = "admin";
    admin.email = "admin@gmail.com";
    // admin.password = "12345";
    admin.isVerified = true;
    admin.status = "active";

    await admin.save();
  }

  console.log("Default Users Seeded");
};

module.exports = defaultUsers;

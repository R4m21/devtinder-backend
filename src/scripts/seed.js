if (process.env.NODE_ENV === "production") {
  console.log("❌ Not allowed in production");
  process.exit(1);
}


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const seed = async () => {
  try {
    // 1. Dynamic Require (Sirf seed chalne par load honge)
    const { fakerEN_IN: faker } = require("@faker-js/faker");
    const User = require("../models/user");
    const ConnectionRequest = require("../models/connectionRequest");
    const TARGET_USER_COUNT = 100;
    const TARGET_CONNECTION_COUNT = TARGET_USER_COUNT * 2;

    // 2. Database Connection
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/testdb";
    await mongoose.connect(MONGO_URI);
    console.log("🚀 Connected to Database...");

    // 3. Purana data saaf karo
    await User.deleteMany({});
    await ConnectionRequest.deleteMany({});
    console.log("🧹 Old data cleared.");

    // 4. Users generate karo
    const hashedPassword = await bcrypt.hash("Test@123", 10);
    const users = [];
    const skillOptions = [
      "react",
      "node",
      "angular",
      "python",
      "java",
      "cpp",
      "aws",
      "docker",
      "sql",
      "git",
      "tailwind",
      "express",
    ];
    const genderOptions = ["male", "female", "other"];

    for (let i = 0; i < TARGET_USER_COUNT; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      // Index 'i' use kiya hai taaki email hamesha unique rahe
      const emailId = faker.internet
        .email({
          firstName,
          lastName,
        })
        .toLowerCase()
        .replace("@", `${i}@`);

      users.push({
        firstName,
        lastName,
        emailId,
        password: hashedPassword,
        age: faker.number.int({ min: 18, max: 45 }),
        gender: faker.helpers.arrayElement(genderOptions),
        photoUrl: faker.image.avatar(),
        about: faker.lorem.sentence(20).substring(0, 250),
        skills: faker.helpers.arrayElements(skillOptions, { min: 1, max: 10 }),
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} Users created.`);

    // 5. Connection Requests generate karo
    const connections = [];
    const statuses = ["ignored", "interested", "rejected", "accepted"];
    const seenPairs = new Set(); // Unique pairs track karne ke liye
    const MAX_ATTEMPTS = TARGET_CONNECTION_COUNT * 2;
    let attempts = 0;

    while (
      connections.length < TARGET_CONNECTION_COUNT &&
      attempts < MAX_ATTEMPTS
    ) {
      attempts++;
      const fromUser = faker.helpers.arrayElement(createdUsers);
      const toUser = faker.helpers.arrayElement(createdUsers);

      const fromId = fromUser._id.toString();
      const userId = toUser._id.toString();

      // Ek unique key banaiye dono IDs ko jod kar
      const pairKey = `${fromId}-${userId}`;
      const reversePairKey = `${userId}-${fromId}`; // Taki A -> B aur B -> A dono na ban jayein (optional)

      // 1. Check: Khud ko request na bheje
      // 2. Check: Ye pair pehle se exist na karta ho
      if (fromId !== userId && !seenPairs.has(pairKey)) {
        connections.push({
          fromUserId: fromUser._id,
          toUserId: toUser._id,
          status: faker.helpers.arrayElement(statuses),
        });

        seenPairs.add(pairKey);
        seenPairs.add(reversePairKey); // A-B hai toh B-A na bane
      }

      // Infinite loop se bachne ke liye (agar users kam hain aur connection target zyada)
      if (seenPairs.size >= connections.length * (connections.length - 1)) {
      }
    }

    await ConnectionRequest.insertMany(connections);
    console.log(`✅ ${connections.length} Connection Requests created.`);
  } catch (error) {
    console.error("❌ Seed Error:", error.message);
  } finally {
    // 6. Connection band karo
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    process.exit();
  }
};

seed();

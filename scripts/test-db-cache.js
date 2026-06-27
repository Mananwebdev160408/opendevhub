const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes("<username>")) {
  console.log("==========================================================================");
  console.log("WARNING: MONGODB_URI is not configured with credentials in .env.local yet.");
  console.log("Please update your .env.local with a valid Atlas connection string to run live tests.");
  console.log("==========================================================================");
  process.exit(0);
}

async function runTest() {
  console.log("Testing Mongoose Connection and Caching schemas...");
  console.log(`Connecting to: ${MONGODB_URI.replace(/:([^@]+)@/, ":****@")}`); // Hide credentials in logs
  
  await mongoose.connect(MONGODB_URI);
  console.log("Database connection successful.");

  const CacheSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
  });
  const Cache = mongoose.models.Cache || mongoose.model('Cache', CacheSchema);

  const testKey = "test-cache-key-verification";
  const testValue = {
    testMessage: "OpenDev Hub Cache Verified",
    timestamp: Date.now()
  };

  console.log("Performing write test...");
  await Cache.findOneAndUpdate(
    { key: testKey },
    { value: testValue, updatedAt: new Date() },
    { upsert: true, new: true }
  );
  console.log("Write operation completed.");

  console.log("Performing read test...");
  const record = await Cache.findOne({ key: testKey }).lean();
  console.log("Record found:", record);

  if (record && record.value.testMessage === testValue.testMessage) {
    console.log("Data verification MATCHED.");
  } else {
    throw new Error("Data verification MISMATCHED.");
  }

  console.log("Cleaning up test entry...");
  await Cache.deleteOne({ key: testKey });
  console.log("Cleanup complete.");

  await mongoose.disconnect();
  console.log("MongoDB connection disconnected.");
  console.log("SUCCESS: All cache verification tests passed!");
}

runTest().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

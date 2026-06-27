const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from .env.local manually if running locally
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

if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI environment variable is missing.");
  process.exit(1);
}

// Define the Event schema in Mongoose (node script compatible)
const ImportantDateSchema = new mongoose.Schema({
  event: { type: String, required: true },
  date: { type: String, required: true }
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  timeline: { type: String, required: true },
  eligibility: { type: String, required: true },
  website: { type: String, required: true },
  description: { type: String, required: true },
  importantDates: [ImportantDateSchema],
  updatedAt: { type: Date, default: Date.now }
});

const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema);

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim().replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') : "";
}

function cleanHtml(html) {
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

async function scrapeDevpostHackathons() {
  const hackathons = [];
  try {
    console.log("Fetching Devpost Hackathons RSS feed...");
    const res = await fetch("https://devpost.com/hackathons.xml", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/xml, text/xml, */*"
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch Devpost feed: ${res.status} ${res.statusText}`);
    }
    const xmlText = await res.text();
    
    // Split XML by <item> tags
    const items = xmlText.split("<item>");
    // Skip the first element as it contains the channel header
    for (let i = 1; i < items.length; i++) {
      const itemXml = items[i];
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const rawDescription = extractTag(itemXml, "description");
      const pubDate = extractTag(itemXml, "pubDate");

      if (title && link) {
        const description = cleanHtml(rawDescription);
        
        // Extract a clean date string from pubDate
        let formattedPubDate = "Recently Published";
        if (pubDate) {
          try {
            formattedPubDate = new Date(pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          } catch (e) {
            formattedPubDate = pubDate;
          }
        }

        hackathons.push({
          name: `${title} (Hackathon)`,
          timeline: "Active Hackathon Opportunities",
          eligibility: "Open globally, check hackathon rules on Devpost.",
          website: link,
          description: description.length > 300 ? description.substring(0, 300) + "..." : description,
          importantDates: [
            { event: "Published On", date: formattedPubDate },
            { event: "Submission Deadline", date: "Check details on website" }
          ]
        });
      }
    }
    console.log(`Successfully scraped ${hackathons.length} hackathons from Devpost.`);
  } catch (err) {
    console.error("Failed to scrape Devpost hackathons:", err);
  }
  return hackathons;
}

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB Atlas connection active.");

  // 1. Read base events from local JSON file
  const localEventsPath = path.join(__dirname, '..', 'data', 'events.json');
  let baseEvents = [];
  if (fs.existsSync(localEventsPath)) {
    try {
      baseEvents = JSON.parse(fs.readFileSync(localEventsPath, 'utf-8'));
      console.log(`Loaded ${baseEvents.length} baseline events from data/events.json.`);
    } catch (e) {
      console.error("Failed to parse local base events file:", e);
    }
  }

  // 2. Scrape dynamic hackathons from Devpost RSS
  const scrapedEvents = await scrapeDevpostHackathons();

  // Combine baseline and scraped hackathons
  const allEvents = [...baseEvents, ...scrapedEvents];

  console.log(`Upserting a total of ${allEvents.length} events into MongoDB database...`);
  
  for (const event of allEvents) {
    try {
      await EventModel.findOneAndUpdate(
        { name: event.name },
        { 
          ...event,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error(`Failed to upsert event: ${event.name}`, err);
    }
  }

  console.log("Synchronizations finished successfully.");
  await mongoose.disconnect();
  console.log("MongoDB Atlas connection released.");
}

run().catch(err => {
  console.error("Fatal error running synchronization:", err);
  process.exit(1);
});

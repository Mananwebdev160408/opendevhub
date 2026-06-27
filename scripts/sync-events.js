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
  category: { type: String, required: true, default: "Open Source" },
  region: { type: String, required: true, default: "Online" },
  source: { type: String, required: true, default: "Local Curation" },
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

function parseRegion(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("india") || t.includes("mumbai") || t.includes("ghaziabad") || t.includes("delhi") || t.includes("bengaluru")) {
    return "India";
  }
  if (t.includes("usa") || t.includes("san francisco") || t.includes("austin") || t.includes("united states") || t.includes("america")) {
    return "USA";
  }
  if (t.includes("germany") || t.includes("hungary") || t.includes("zurich") || t.includes("switzerland") || t.includes("europe") || t.includes("munich") || t.includes("mannheim") || t.includes("budapest")) {
    return "Europe";
  }
  return "Online";
}

async function fetchTechConferences() {
  const events = [];
  try {
    console.log("Fetching developers.events API for active events...");
    const res = await fetch("https://developers.events/all-events.json");
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.statusText}`);
    }
    const data = await res.json();
    
    // Filter to future/upcoming events
    const now = Date.now();
    const futureEvents = data
      .filter(item => item.date && item.date[0] && item.date[0] > now)
      .sort((a, b) => a.date[0] - b.date[0])
      .slice(0, 30); // Fetch top 30 upcoming events

    console.log(`Successfully retrieved ${futureEvents.length} upcoming developer events.`);

    for (const item of futureEvents) {
      const startDate = new Date(item.date[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const endDate = item.date[1] ? new Date(item.date[1]).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
      
      const timeline = endDate ? `${startDate} - ${endDate}` : startDate;
      
      const importantDates = [
        { event: "Conference Starts", date: startDate }
      ];
      if (endDate) {
        importantDates.push({ event: "Conference Ends", date: endDate });
      }
      if (item.cfp && item.cfp.until) {
        importantDates.push({ event: "CFP Deadline", date: item.cfp.until });
      }

      let description = `Join the developer community in ${item.location} for ${item.name}.`;
      if (item.cfp && item.cfp.link) {
        description += ` Call for Papers is active until ${item.cfp.until}. Submit proposal: ${item.cfp.link}`;
      }

      const region = parseRegion(item.location || "");

      events.push({
        name: item.name,
        timeline: timeline,
        eligibility: item.location ? `Open to developers (Location: ${item.location})` : "Open globally",
        website: item.hyperlink,
        description: description,
        importantDates: importantDates,
        category: "Conference",
        region: region,
        source: "Conference Radar"
      });
    }
  } catch (err) {
    console.error("Failed to fetch tech conferences:", err);
  }
  return events;
}

async function fetchDevfolioHackathons() {
  const events = [];
  try {
    console.log("Fetching Devfolio hackathons from HackRadar repository...");
    const res = await fetch("https://raw.githubusercontent.com/Venky1209/HackRadar/main/seed-hackathons-apr-jun-2026.json");
    if (!res.ok) {
      throw new Error(`Failed to fetch HackRadar list: ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`Successfully retrieved ${data.length} hackathons from HackRadar.`);
    
    // Slice to top 30 events
    const limited = data.slice(0, 30);
    
    for (const item of limited) {
      const eligibility = item.mode === "In-person" 
        ? `In-person (Location: ${item.location || 'Unknown'})` 
        : `Open globally (${item.mode || 'Online'})`;

      const region = parseRegion(item.mode === "In-person" ? item.location : item.mode);

      events.push({
        name: `${item.title} (Hackathon)`,
        timeline: item.dates || "Upcoming",
        eligibility: eligibility,
        website: item.registrationLink || "https://devfolio.co",
        description: `${item.shortDescription || 'No description provided.'} Prize Pool: ${item.prizePool || 'N/A'}. PPI/PPO Possibility: ${item.ppoPpiPossible || 'No'}.`,
        importantDates: [
          { event: "Hackathon Timeline", date: item.dates || "TBD" }
        ],
        category: "Hackathon",
        region: region,
        source: "Devfolio"
      });
    }
  } catch (err) {
    console.error("Failed to fetch Devfolio hackathons:", err);
  }
  return events;
}

async function fetchConfsTechConferences() {
  const topics = ['javascript', 'typescript', 'python', 'rust', 'android', 'ios', 'devops', 'security', 'ux', 'css', 'general'];
  const events = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  console.log("Fetching conferences from Confs.tech (tech-conferences/conference-data)...");

  for (const topic of topics) {
    try {
      console.log(`Fetching Confs.tech topic: ${topic}...`);
      const url = `https://raw.githubusercontent.com/tech-conferences/conference-data/main/conferences/2026/${topic}.json`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[Confs.tech Warning] Failed to fetch topic ${topic}: ${res.statusText}`);
        continue;
      }
      const data = await res.json();
      
      let addedForTopic = 0;
      for (const item of data) {
        if (!item.startDate) continue;
        
        // Filter out past events
        const eventStart = new Date(item.startDate);
        if (eventStart < now) continue;

        const startStr = new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const endStr = item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
        const timeline = (endStr && endStr !== startStr) ? `${startStr} - ${endStr}` : startStr;

        const importantDates = [
          { event: "Conference Starts", date: startStr }
        ];
        if (endStr && endStr !== startStr) {
          importantDates.push({ event: "Conference Ends", date: endStr });
        }
        if (item.cfpEndDate) {
          const cfpStr = new Date(item.cfpEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          importantDates.push({ event: "CFP Deadline", date: cfpStr });
        }

        let description = `Join the developer community for ${item.name}`;
        if (item.online) {
          description += ` online.`;
        } else {
          description += ` in ${item.city || 'TBD'}, ${item.country || 'TBD'}.`;
        }
        
        if (item.cfpUrl && item.cfpEndDate) {
          description += ` Call for Papers (CFP) is active until ${item.cfpEndDate}. Submit proposal: ${item.cfpUrl}`;
        }

        const eligibility = item.online 
          ? "Open globally (Online / Virtual)" 
          : `In-person (Location: ${item.city || 'TBD'}, ${item.country || 'TBD'})`;

        const region = item.online ? "Online" : parseRegion(`${item.city} ${item.country}`);

        events.push({
          name: item.name,
          timeline: timeline,
          eligibility: eligibility,
          website: item.url || "https://confs.tech",
          description: description,
          importantDates: importantDates,
          category: "Conference",
          region: region,
          source: "Confs.tech"
        });
        addedForTopic++;
      }
      console.log(`Added ${addedForTopic} upcoming conferences for topic: ${topic}`);
    } catch (err) {
      console.error(`Failed to fetch Confs.tech conferences for topic ${topic}:`, err);
    }
  }

  return events;
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
      const rawBase = JSON.parse(fs.readFileSync(localEventsPath, 'utf-8'));
      baseEvents = rawBase.map(item => ({
        ...item,
        category: "Open Source",
        region: "Online",
        source: "Local Curation"
      }));
      console.log(`Loaded ${baseEvents.length} baseline events from data/events.json.`);
    } catch (e) {
      console.error("Failed to parse local base events file:", e);
    }
  }

  // 2. Fetch dynamic hackathons & tech conferences
  const conferences = await fetchTechConferences();
  const hackathons = await fetchDevfolioHackathons();
  const confsTechConferences = await fetchConfsTechConferences();

  // Combine baseline, conferences, hackathons, and Confs.tech conferences
  const allEvents = [...baseEvents, ...conferences, ...hackathons, ...confsTechConferences];

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

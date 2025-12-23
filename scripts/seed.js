// Seed script for party games
// Run with: node scripts/seed.js

const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Read .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
    }
});

const MONGODB_URI = envVars.MONGODB_URI;

const gameSchema = new mongoose.Schema({
    number: String,
    name: String,
    subtitle: String,
    tags: [String],
    playerCount: { min: Number, max: Number },
    duration: { min: Number, max: Number },
    energy: String,
    energyColor: String,
    tagline: String,
    setup: [String],
    rules: [String],
    tips: [String],
    isPremium: Boolean,
}, { timestamps: true });

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

const games = [
    {
        number: "#001",
        name: "Marshmallow Solo Cup Toss",
        subtitle: "Classic Aim Game",
        tags: ["Family", "Chill"],
        playerCount: { min: 2, max: 10 },
        duration: { min: 5, max: 5 },
        energy: "Medium",
        energyColor: "yellow",
        tagline: "Simple, inclusive, works for all ages.",
        setup: [
            "Red solo cups",
            "Marshmallows",
            "Line on floor (tape works great)"
        ],
        rules: [
            "Players stand behind the line",
            "Each player gets 5 marshmallows per round",
            "Toss marshmallows into the cups",
            "Most marshmallows in cups wins!"
        ],
        tips: [
            "Increase distance for harder difficulty",
            "Use different sized marshmallows for variety"
        ],
        isPremium: false,
    },
    {
        number: "#002",
        name: "Blind Box Relay",
        subtitle: "Unwrap & Find",
        tags: ["Chaotic", "Competitive"],
        playerCount: { min: 4, max: 10 },
        duration: { min: 5, max: 8 },
        energy: "High",
        energyColor: "red",
        tagline: "Chaos + speed + surprises.",
        setup: [
            "Wrapped boxes with items inside",
            "Blindfolds for each team",
            "Timer"
        ],
        rules: [
            "Split into teams",
            "One blindfolded player unwraps a box",
            "Guess what's inside by touch only",
            "Pass to next player when guessed correctly",
            "Fastest team wins!"
        ],
        tips: [
            "Use common household items",
            "Add silly items for extra laughs"
        ],
        isPremium: false,
    },
    {
        number: "#003",
        name: "Toilet Paper Roll Cup Push",
        subtitle: "Slow & Steady Cup Slide",
        tags: ["Chill", "Family"],
        playerCount: { min: 2, max: 6 },
        duration: { min: 3, max: 5 },
        energy: "Low",
        energyColor: "blue",
        tagline: "Tension, patience, hilarious failures.",
        setup: [
            "Empty toilet paper rolls",
            "Plastic cups",
            "Long table"
        ],
        rules: [
            "Place cup at one end of table",
            "Use toilet paper roll to blow air at cup",
            "Push cup to the other end without falling off",
            "Fastest time wins"
        ],
        tips: [
            "Practice your breathing technique",
            "Add obstacles for advanced play"
        ],
        isPremium: false,
    },
    {
        number: "#004",
        name: "Hammer the Nail",
        subtitle: "Classic Festa / Carnival Game",
        tags: ["Competitive", "Chaotic"],
        playerCount: { min: 2, max: 8 },
        duration: { min: 5, max: 10 },
        energy: "High",
        energyColor: "red",
        tagline: "Physical, primal, crowd-pleasing.",
        setup: [
            "Wooden stump or thick board",
            "Hammer (one per player or shared)",
            "Nails (one per player)"
        ],
        rules: [
            "Each player gets one nail in the stump",
            "Take turns hitting your nail",
            "One-handed swings only!",
            "First to fully sink their nail wins"
        ],
        tips: [
            "Adult supervision required",
            "Start nails at same height for fairness"
        ],
        isPremium: false,
    },
    {
        number: "#005",
        name: "Gift Wrap Speed Challenge",
        subtitle: "Holiday Hustle",
        tags: ["Competitive", "Family"],
        playerCount: { min: 2, max: 8 },
        duration: { min: 5, max: 10 },
        energy: "Medium",
        energyColor: "yellow",
        tagline: "Festive frenzy for the whole family.",
        setup: [
            "Wrapping paper rolls",
            "Tape dispensers",
            "Scissors",
            "Various sized boxes"
        ],
        rules: [
            "Each player gets a box to wrap",
            "Timer starts - 2 minutes!",
            "Wrap as neatly as possible",
            "Judge picks the best wrapped gift"
        ],
        tips: [
            "Pre-cut tape strips for faster wrapping",
            "Add bow-tying as bonus round"
        ],
        isPremium: false,
    },
    {
        number: "#006",
        name: "Cookie Face",
        subtitle: "No Hands Allowed",
        tags: ["Chill", "Family"],
        playerCount: { min: 2, max: 12 },
        duration: { min: 3, max: 5 },
        energy: "Low",
        energyColor: "blue",
        tagline: "Hilarious expressions guaranteed.",
        setup: [
            "Cookies (Oreos work great)",
            "Timer"
        ],
        rules: [
            "Place cookie on forehead",
            "Using only facial muscles, move cookie to mouth",
            "No hands allowed!",
            "First to eat their cookie wins"
        ],
        tips: [
            "Tilt head back slightly",
            "Raise eyebrows to create movement"
        ],
        isPremium: false,
    },
    {
        number: "#007",
        name: "Jingle Bell Shake",
        subtitle: "Shake It Off",
        tags: ["Chaotic", "Competitive"],
        playerCount: { min: 2, max: 10 },
        duration: { min: 2, max: 3 },
        energy: "High",
        energyColor: "red",
        tagline: "Dance, shake, repeat!",
        setup: [
            "Empty tissue boxes",
            "Jingle bells or ping pong balls",
            "Belt or ribbon to attach box"
        ],
        rules: [
            "Attach tissue box with bells to waist",
            "Timer starts - 60 seconds!",
            "Shake your body to get all bells out",
            "First to empty their box wins"
        ],
        tips: [
            "Hip movements work best",
            "Add festive music for atmosphere"
        ],
        isPremium: true,
    },
    {
        number: "#008",
        name: "Snowball Stacking",
        subtitle: "Steady Hands Required",
        tags: ["Chill", "Family"],
        playerCount: { min: 2, max: 6 },
        duration: { min: 5, max: 8 },
        energy: "Low",
        energyColor: "blue",
        tagline: "Patience is key.",
        setup: [
            "White pompoms or cotton balls (snowballs)",
            "Chopsticks",
            "Small bowls"
        ],
        rules: [
            "Use chopsticks to stack snowballs",
            "Build the tallest tower possible",
            "Timer: 2 minutes",
            "Tallest standing tower wins"
        ],
        tips: [
            "Start with bigger pompoms at base",
            "Steady hands beat speed"
        ],
        isPremium: true,
    },
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing games
        await Game.deleteMany({});
        console.log("Cleared existing games");

        // Insert new games
        await Game.insertMany(games);
        console.log(`Seeded ${games.length} games successfully!`);

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();

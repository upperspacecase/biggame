import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const collectionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        emoji: {
            type: String,
            default: "🎮",
        },
        color: {
            type: String,
            default: "#E74C3C",
        },
        gameIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
        }],
        isPremium: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// Add plugin to convert mongoose to JSON
collectionSchema.plugin(toJSON);

export default mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

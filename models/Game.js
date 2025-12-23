import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const gameSchema = mongoose.Schema(
    {
        number: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        tags: [{
            type: String,
            trim: true,
        }],
        playerCount: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
        },
        duration: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
            },
        },
        energy: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        energyColor: {
            type: String,
            enum: ["yellow", "blue", "red"],
            default: "yellow",
        },
        tagline: {
            type: String,
            trim: true,
        },
        setup: [{
            type: String,
        }],
        rules: [{
            type: String,
        }],
        tips: [{
            type: String,
        }],
        videoUrl: {
            type: String,
            trim: true,
        },
        propsNeeded: {
            type: Boolean,
            default: true,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// Add plugin to convert mongoose to JSON
gameSchema.plugin(toJSON);

export default mongoose.models.Game || mongoose.model("Game", gameSchema);

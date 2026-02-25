import mongoose from "mongoose";

const personaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    personalityTraits: [{
        type: String,
        trim: true
    }],
    speakingStyle: {
        type: String,
        required: true,
        trim: true
    },
    rules: [{
        type: String,
        trim: true
    }],
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    },
    openingMessage: {
        type: String,
        trim: true
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        trim: true,
        default: ""
    },
    background: {
        type: String,
        trim: true,
        default: ""
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

// Indexes for faster lookups
personaSchema.index({ visibility: 1 });
personaSchema.index({ createdBy: 1 });

const PersonaModel = mongoose.model("persona", personaSchema);

export default PersonaModel;

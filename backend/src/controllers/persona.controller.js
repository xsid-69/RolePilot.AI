import PersonaModel from "../models/persona.model.js";

/**
 * Create a new persona.
 * Authenticated users only.
 */
export const createPersona = async (req, res) => {
    try {
        const { name, role, personalityTraits, speakingStyle, rules, visibility, openingMessage, avatar, background } = req.body;

        if (!name || !role || !speakingStyle) {
            return res.status(400).json({
                success: false,
                message: "Name, role, and speaking style are required."
            });
        }

        const newPersona = await PersonaModel.create({
            name,
            role,
            personalityTraits: personalityTraits || [],
            speakingStyle,
            rules: rules || [],
            visibility: visibility || "private",
            openingMessage: openingMessage || "",
            avatar: avatar || "",
            background: background || "",
            isSystem: false, // Regular users cannot create system personas
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            persona: newPersona
        });
    } catch (error) {
        console.error("Create Persona Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

/**
 * Get all available personas for the user.
 * Returns public personas + user's own private personas.
 */
export const getPersonas = async (req, res) => {
    try {
        const query = req.user 
            ? { $or: [{ visibility: "public" }, { createdBy: req.user._id }] }
            : { visibility: "public" };

        const personas = await PersonaModel.find(query).sort({ createdAt: -1 });
        console.log(`Backend: Found ${personas.length} personas for ${req.user ? "user " + req.user._id : "anonymous guest"}`);

        res.status(200).json({
            success: true,
            personas
        });
    } catch (error) {
        console.error("Get Personas Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

/**
 * Update an existing persona.
 * Owners only.
 */
export const updatePersona = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, personalityTraits, speakingStyle, rules, visibility, openingMessage, avatar, background } = req.body;

        const persona = await PersonaModel.findById(id);

        if (!persona) {
            return res.status(404).json({
                success: false,
                message: "Persona not found."
            });
        }

        // Protection for system personas
        if (persona.isSystem) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: System personas cannot be modified."
            });
        }

        // Ownership validation
        if (persona.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You do not own this persona."
            });
        }

        const updatedPersona = await PersonaModel.findByIdAndUpdate(
            id,
            {
                name: name || persona.name,
                role: role || persona.role,
                personalityTraits: personalityTraits || persona.personalityTraits,
                speakingStyle: speakingStyle || persona.speakingStyle,
                rules: rules || persona.rules,
                visibility: visibility || persona.visibility,
                openingMessage: openingMessage !== undefined ? openingMessage : persona.openingMessage,
                avatar: avatar !== undefined ? avatar : persona.avatar,
                background: background !== undefined ? background : persona.background
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            persona: updatedPersona
        });
    } catch (error) {
        console.error("Update Persona Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

/**
 * Delete a persona.
 * Owners only.
 */
export const deletePersona = async (req, res) => {
    try {
        const { id } = req.params;

        const persona = await PersonaModel.findById(id);

        if (!persona) {
            return res.status(404).json({
                success: false,
                message: "Persona not found."
            });
        }

        // Protection for system personas
        if (persona.isSystem) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: System personas cannot be deleted."
            });
        }

        // Ownership validation
        if (persona.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You do not own this persona."
            });
        }

        await PersonaModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Persona deleted successfully."
        });
    } catch (error) {
        console.error("Delete Persona Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const Housing = require("../models/housing");

// Get all housing or filter by type
const Index = async (req, res) => {
    try {
        const { type } = req.query;
        
        // Build query object
        let query = {};
        if (type) {
            // Filter by type if query parameter exists
            query.type = type;
        }
        
        const housing = await Housing.find(query);
        
        if (!housing || housing.length === 0) {
            return res.status(404).json({ 
                message: "No housing found",
                data: []
            });
        }
        
        res.status(200).json(housing);
    } catch (error) {
        res.status(500).json({ 
            message: "Error retrieving housing", 
            error: error.message 
        });
    }
};

// Get housing by ID
const GetById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find housing by ID
        const housing = await Housing.findOne({ id: id });
        
        if (!housing) {
            return res.status(404).json({ 
                message: "Housing not found",
                id: id
            });
        }
        
        res.status(200).json(housing);
    } catch (error) {
        // Handle invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ 
                message: "Invalid housing ID format",
                id: req.params.id
            });
        }
        
        res.status(500).json({ 
            message: "Error retrieving housing", 
            error: error.message 
        });
    }
};

// Create new housing
const Create = async (req, res) => {
    try {
        const { title, location, price, bedrooms, bathrooms, area, image, rating, status, type, description } = req.body;
        
        // Validasi field required
        if (!title || !location || !price || !bedrooms || !bathrooms || !area || !image || !status) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib harus diisi"
            });
        }

        // Generate ID otomatis (ambil ID tertinggi + 1)
        const lastHousing = await Housing.findOne().sort({ id: -1 });
        const newId = lastHousing ? lastHousing.id + 1 : 1;

        // Get userId from JWT token (set by verifyToken middleware)
        const userId = req.user ? req.user.id : null;

        // Buat housing baru
        const newHousing = new Housing({
            id: newId,
            userId: userId,
            title: title.trim(),
            location: location.trim(),
            price: Number(price),
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            area: Number(area),
            image: image.trim(),
            rating: rating ? Number(rating) : 0,
            status: status,
            type: type || 'rumah',
            description: description || '',
            postedDays: 0
        });

        // Simpan ke database
        await newHousing.save();

        res.status(201).json({
            success: true,
            message: "Properti berhasil ditambahkan",
            data: newHousing
        });

    } catch (error) {
        console.error("Create Housing Error:", error);
        
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", ")
            });
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

// Update housing
const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Cari dan update housing
        
        const housing = await Housing.findOneAndUpdate(
            { id: id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!housing) {
            return res.status(404).json({
                success: false,
                message: "Properti tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Properti berhasil diupdate",
            data: housing
        });

    } catch (error) {
        console.error("Update Housing Error:", error);
        
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid housing ID format"
            });
        }

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", ")
            });
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

// Delete housing
const Delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Cari dan hapus housing
        const housing = await Housing.findOneAndDelete({ id: id });

        if (!housing) {
            return res.status(404).json({
                success: false,
                message: "Properti tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Properti berhasil dihapus",
            data: housing
        });

    } catch (error) {
        console.error("Delete Housing Error:", error);
        
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid housing ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

// Get My Housing (properties owned by current user)
const GetMyHousing = async (req, res) => {
    try {
        // Get userId from JWT token (set by verifyToken middleware)
        const userId = req.user.id;
        console.log("GetMyHousing - User ID:", userId);

        // Find all housing owned by this user
        const myHousing = await Housing.find({ userId: userId });

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data properti",
            data: myHousing
        });

    } catch (error) {
        console.error("Get My Housing Error:", error);
        
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

module.exports = { Index, GetById, Create, Update, Delete, GetMyHousing };
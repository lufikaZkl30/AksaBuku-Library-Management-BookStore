const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const Profil = require('../../models/profil');
const { isAdmin } = require('../../config/auth');

//ADMIN - VIEW
router.get('/view', isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.render('userList', { users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pengguna' });
    }
});

//ADMIN - DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUsers = await User.findByIdAndDelete(id);
        const deletedProfile = await Profil.findOneAndDelete({ user: id });
        if (!deletedUsers) {
            if (!deletedProfile) {
                return res.status(404).json({ message: 'Profil tidak ditemukan.' });
            }
            return res.status(404).json({ message: 'User tidak ditemukan.' });  
        }
        res.status(200).json({});
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});

//ADMIN - EDIT ROLE
router.post('adedit/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.redirect('/admin/userlists');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Edit Profil POST
router.post("/edit", async (req, res) => {
    try {
        const { bio, birthday, country, company, website, twitter, facebook, googlePlus, instagram, linkedin} = req.body;

        const updatedProfil = await Profil.findOneAndUpdate(
        { user: req.user.id },
        { bio, birthday, country, company, website, twitter, facebook, googlePlus, instagram, linkedin},
        { new: true }
        );

        if (!updatedProfil) {
        return res.status(404).json({ message: 'Profil tidak ditemukan' });
        }

        res.redirect('/profil');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui profil' });
    }
}); 

module.exports = router;

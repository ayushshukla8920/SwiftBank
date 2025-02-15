const { deleteSession } = require('../middlewares/sessions');
async function handleClientLogout(req, res){
    try {
        const sessionCookie = req.body.sessionId;
        deleteSession(sessionCookie);
        return res.json({msg:"Logout Successful"});
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).send('Logout failed');
    }
}

async function handleAdminLogout(req, res){
    try {
        const sessionCookie = req.cookies.adminId;
        deleteSession(sessionCookie);
        res.clearCookie('adminId').redirect('/admin');
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).send('Logout failed');
    }
}

module.exports = {
    handleAdminLogout,
    handleClientLogout,
}
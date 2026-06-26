const express = require('express');

const router = express.Router();

const passport = require('passport');

const adminCtl = require('../controllers/adminController');

const Admin = require('../models/adminModel');

const auth = require('../middleware/authMiddleware');

console.log(Admin.uploadImage);

router.get('/login', auth.checkLogin, adminCtl.signInPage);

router.get('/register', auth.checkLogin, adminCtl.signUpPage);

router.post('/login-user',

    passport.authenticate('local', {
        failureRedirect: '/login'
    }),

    adminCtl.loginUser
);

router.post('/register-user', adminCtl.registerUser);

router.get('/logout', adminCtl.logoutUser);

router.get('/', auth.checkAuthentication, adminCtl.dashboardPage);

router.get('/addAdmin',
    auth.checkAuthentication,
    adminCtl.addAdminPage
);

router.get('/viewAdmin',
    auth.checkAuthentication,
    adminCtl.viewAdminPage
);

router.post('/insertAdmin',
    auth.checkAuthentication,
    Admin.uploadImage,
    adminCtl.insertAdminData
);

router.get('/editAdmin/:id',
    auth.checkAuthentication,
    adminCtl.editAdminPage
);

router.post('/updateAdmin/:id',
    auth.checkAuthentication,
    Admin.uploadImage,
    adminCtl.updateAdminData
);

router.get('/deleteAdmin/:id',
    auth.checkAuthentication,
    adminCtl.deleteAdmin
);

router.get('/myProfile',
    auth.checkAuthentication,
    adminCtl.myProfilePage
);

router.post('/updateProfile',
    auth.checkAuthentication,
    Admin.uploadImage,
    adminCtl.updateProfile
);

router.post('/changePassword',
    auth.checkAuthentication,
    adminCtl.changePassword
);

router.get('/checkEmail', adminCtl.checkEmailPage);
router.post('/verifyEmail', adminCtl.verifyEmail);

router.get('/verifyOtp', adminCtl.verifyOtpPage);
router.post('/checkOtp', adminCtl.checkOtp);

router.get('/resetPassword', adminCtl.resetPasswordPage);
router.post('/updatePassword', adminCtl.updatePassword);

module.exports = router;
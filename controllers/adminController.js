const express = require('express');

const path = require('path');

const bcrypt = require('bcrypt');

const Admin = require('../models/adminModel');

const auth = require('../middleware/authMiddleware');

const transporter = require('../config/mailer');

exports.signInPage = (req, res) => {

    res.render('login');

}

exports.signUpPage = (req, res) => {

    res.render('register');

}

exports.loginUser = async (req, res) => {

    try {

        req.flash('success', 'Login Successfully');

        return res.redirect('/');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Login Failed');

        return res.redirect('/login');

    }

}

exports.registerUser = async (req, res) => {

    try {

        const hashPassword = await bcrypt.hash(req.body.pwd, 10);

        req.body.pwd = hashPassword;

        req.body.name = req.body.fname + ' ' + req.body.lname;

        await Admin.create(req.body);

        req.flash('success', 'Registration Successfully');

        return res.redirect('/login');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Registration Failed');

        return res.redirect('back');

    }

}

exports.logoutUser = (req, res) => {

    req.logout((err) => {

        if (err) {

            console.log(err);

            req.flash('error', 'Logout Failed');

            return res.redirect('back');

        }

        req.flash('success', 'Logout Successfully');

        return res.redirect('/login');

    });

}

exports.dashboardPage = async (req, res) => {

    try {

        res.render('index');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Dashboard Not Open');

        return res.redirect('/login');

    }

}

exports.addAdminPage = (req, res) => {

    res.render('addAdmin');

}

exports.insertAdminData = async (req, res) => {

    try {

        const hashPassword = await bcrypt.hash(req.body.pwd, 10);

        req.body.pwd = hashPassword;

        req.body.name = req.body.fname + ' ' + req.body.lname;

        if (req.file) {

            req.body.avtar = Admin.imagePath + '/' + req.file.filename;

        }

        await Admin.create(req.body);

        req.flash('success', 'Admin Added Successfully');

        return res.redirect('/');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Admin Not Added');

        return res.redirect('back');

    }

}

exports.viewAdminPage = async (req, res) => {

    try {

        const admins = await Admin.find();

        return res.render('viewAdmin', { admins });

    } catch (err) {

        console.log(err);

        req.flash('error', 'Admins Not Found');

        return res.redirect('back');

    }

}

exports.editAdminPage = async (req, res) => {

    try {

        const admin = await Admin.findById(req.params.id);

        if (!admin) {

            req.flash('error', 'Admin Not Found');

            return res.redirect('/viewAdmin');

        }

        res.render('editAdmin', { admin });

    } catch (err) {

        console.log(err);

        req.flash('error', 'Something Went Wrong');

        return res.redirect('/viewAdmin');

    }

}

exports.updateAdminData = async (req, res) => {

    try {

        const adminId = req.params.id;

        const existingAdmin = await Admin.findById(adminId);

        req.body.name = req.body.fname + ' ' + req.body.lname;

        if (req.body.pwd && req.body.pwd.trim() !== "") {

            const hashPassword = await bcrypt.hash(req.body.pwd, 10);

            req.body.pwd = hashPassword;

        } else {

            req.body.pwd = existingAdmin.pwd;

        }

        if (req.file) {

            req.body.avtar = Admin.imagePath + '/' + req.file.filename;

        } else {

            req.body.avtar = existingAdmin.avtar;

        }

        await Admin.findByIdAndUpdate(adminId, req.body);

        req.flash('success', 'Admin Updated Successfully');

        return res.redirect('/viewAdmin');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Admin Not Updated');

        return res.redirect('/viewAdmin');

    }

}

exports.deleteAdmin = async (req, res) => {

    try {

        await Admin.findByIdAndDelete(req.params.id);

        req.flash('success', 'Admin Deleted Successfully');

        return res.redirect('/viewAdmin');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Admin Not Deleted');

        return res.redirect('/viewAdmin');

    }

}

exports.myProfilePage = async (req, res) => {

    try {

        return res.render('myProfile');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Profile Page Not Open');

        return res.redirect('back');

    }

}

exports.updateProfile = async (req, res) => {

    try {

        const adminData = await Admin.findById(req.user.id);

        req.body.name = req.body.fname + ' ' + req.body.lname;

        if (req.file) {

            req.body.avtar = Admin.imagePath + '/' + req.file.filename;

        } else {

            req.body.avtar = adminData.avtar;

        }

        req.body.pwd = adminData.pwd;

        req.body.role = adminData.role;

        await Admin.findByIdAndUpdate(req.user.id, req.body);

        req.flash('success', 'Profile Updated Successfully');

        return res.redirect('/myProfile');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Profile Not Updated');

        return res.redirect('back');

    }

}

exports.changePassword = async (req, res) => {

    try {

        const adminData = await Admin.findById(req.user.id);

        const checkOldPassword = await bcrypt.compare(
            req.body.oldPassword,
            adminData.pwd
        );

        if (!checkOldPassword) {

            req.flash('error', 'Old Password Wrong');

            return res.redirect('back');

        }

        if (req.body.oldPassword == req.body.newPassword) {

            req.flash('error', 'Old & New Password Same');

            return res.redirect('back');

        }

        if (req.body.newPassword != req.body.confirmPassword) {

            req.flash('error', 'Confirm Password Not Match');

            return res.redirect('back');

        }

        const hashPassword = await bcrypt.hash(req.body.newPassword, 10);

        await Admin.findByIdAndUpdate(req.user.id, {
            pwd: hashPassword
        });

        req.flash('success', 'Password Updated Successfully');

        return res.redirect('/logout');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Password Not Changed');

        return res.redirect('back');

    }

}




exports.checkEmailPage = (req, res) => {
    return res.render('checkEmail');
};

exports.verifyEmail = async (req, res) => {
    try {
        let admin = await Admin.findOne({ email: req.body.email });
        
        if (admin) {
            // 1. Generate the OTP
            let otp = Math.floor(1000 + Math.random() * 9000); 
            
            console.log("===================================");
            console.log("🔔 THE OTP IS:", otp);
            console.log("===================================");
            
            // 2. Set up the email options
            const mailOptions = {
                from: '7913hiyashah@gmail.com', // Your email
                to: admin.email,                // The admin's email
                subject: 'Password Reset OTP - Purple Admin',
                text: `Your OTP for password reset is: ${otp}. It is valid for a short time.`
            };
            
            req.session.adminEmail = admin.email;
            req.session.adminOtp = otp;

            req.flash('success', 'OTP sent to your email');
            return res.redirect('/verifyOtp');
        } else {
            req.flash('error', 'Email not registered!');
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

exports.verifyOtpPage = (req, res) => {
    return res.render('verifyOtp');
};

exports.checkOtp = (req, res) => {
    if (req.body.otp == req.session.adminOtp) {
        req.flash('success', 'OTP Verified Successfully');
        return res.redirect('/resetPassword');
    } else {
        req.flash('error', 'Invalid OTP. Try again.');
        return res.redirect('back');
    }
};

exports.resetPasswordPage = (req, res) => {
    return res.render('resetPassword');
};

exports.updatePassword = async (req, res) => {
    try {
        if (req.body.newPassword === req.body.confirmPassword) {
            let admin = await Admin.findOne({ email: req.session.adminEmail });
            
            if (admin) {
                // 1. Hash the new password before saving!
                const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
                
                // 2. Use 'pwd' to match your database schema
                await Admin.findByIdAndUpdate(admin._id, { pwd: hashPassword });
                
                delete req.session.adminEmail;
                delete req.session.adminOtp;

                req.flash('success', 'Password reset successfully. You can now login.');
                return res.redirect('/'); 
            }
        } else {
            req.flash('error', 'Passwords do not match!');
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};
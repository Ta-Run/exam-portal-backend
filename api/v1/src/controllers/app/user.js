const appModel = require("../../models/app.model")
const ClientModel = require("../../models/client.model")
const manageCandidate = require("../../models/manageCandidate")
const loginModel = require("../../models/accessCode")


const moment = require("moment-timezone")


const ulpoadDocument = async (req, res) => {
    try {
   
        const { yourPhoto, yourDocument,accessCode } = req.body
        const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
        if (!isClient) {
            return res.json({
                res: false,
                msg: 'clientEmail is not found!',
            });
        }

        const isCandidate = await manageCandidate.findOne({ EnrollmentNumber: accessCode });
        if (!isCandidate) {
            return res.json({
                res: false,
                msg: 'Candidate not found!',
            });
        }
        if (yourPhoto == "" || yourDocument == "") {
            return res.json({
                res: false,
                msg: 'All fields required.',
            });
        }
        if (!req.files) {
            return res.status(400).json({ error: 'File is missing..' });
        }
        await appModel.create({
            accessCode: isCandidate.EnrollmentNumber,
            yourPhoto: `/upload/${req.files.yourPhoto[0].filename}`,
            yourDocument: `/upload/${req.files.yourDocument[0].filename}`,
            clientId: isClient._id,
            clientName: isClient.clientName,
            createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            createdById: isClient._id,
            createdByName: isClient.clientName,
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isClient.clientName,
            lastUpdatedById: isClient._id,
            status: "Active"
        })
        return res.json({
            res: true,
            msg: 'document upload Successfully.',
        });
    } catch (error) {
        console.error('error in upload document ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}
const login = async (req, res) => {
    try {
        const { accessCode } = req.body;
        const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
        if (!isClient) {
            return res.json({
                res: false,
                msg: 'clientEmail is not found!',
            });
        }
        if (!accessCode) {
            return res.json({
                res: false,
                msg: 'Access code is required.',
            });
        }
        const isCandidate = await manageCandidate.findOne({ EnrollmentNumber: accessCode });
        if (!isCandidate) {
            return res.json({
                res: false,
                msg: 'Candidate not found!',
            });
        }
        const loginData = await loginModel.create({
            accessCode: isCandidate.EnrollmentNumber,
            clientId: isClient._id,
            clientName: isClient.clientName,
            createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            createdById: isClient._id,
            createdByName: isClient.clientName,
            lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedByName: isClient.clientName,
            lastUpdatedById: isClient._id,
            status: "Active"
        });
        return res.json({
            res: true,
            msg: 'Login Successfully.',
            data:loginData
        });
    } catch (error) {
        console.error('Error in login:', error);
        return res.json({
            res: false,
            msg: 'Something went wrong!'
        });
    }
}
module.exports = {
    ulpoadDocument,
    login
}
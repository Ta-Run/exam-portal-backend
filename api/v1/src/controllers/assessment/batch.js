const AdminModel = require("../../models/admin.model")
const ClientModel = require("../../models/client.model")
const SectorModel = require("../../models/sector.model")
const BatchModel = require("../../models/manage-Batch")
const JobRoleModel = require("../../models/job-role.model")
const batchUploadModel = require("../../models/batchUpload")
const ManageBatchModel = require('../../models/manage-Batch')
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model")

const mongoose = require('mongoose');

const fs = require('fs');
const xlsx = require('xlsx');
const moment = require('moment-timezone');

//manage bulkData Upload  

const batch_bulkupload = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'clientEmail is not found!',
                });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'File is missing.' });
            }
            const filePath = req.file.path;
            const file = fs.readFileSync(filePath);
            const workbook = xlsx.read(file, { type: 'buffer' });
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                return res.status(400).json({ error: 'No sheets found in the Excel file.' });
            }

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            if (!sheet) {
                return res.status(400).json({ error: `Sheet ${sheetName} not found in the Excel file.` });
            }
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            if (!data || data.length === 0) {
                return res.status(400).json({ error: 'No data found in the Excel sheet.' });
            }
            const headers = data[0];

            // Define required fields
            const requiredFields = [
                'state', 'district', 'sectorName', 'jobRoleName',
                'TrainingCenterName', 'TrainingPartnerEmail', 'startTime',
                'endTime', 'startDate', 'endDate', 'batchName', 'TotalCandidate',
                'photo', 'video'
            ];

            // Check for missing fields
            const missingFields = requiredFields.filter(field => !headers.includes(field));
            if (missingFields.length > 0) {
                return res.status(400).json({ res: false, msg: `Missing required fields in Excel: ${missingFields.join(', ')}` });
            }

            // Convert sheet to JSON
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            const addBatchData = jsonData.map(batchData => ({
                state: batchData.state,
                district: batchData.district,
                sectorName: batchData.sectorName,
                jobRoleName: batchData.jobRoleName,
                TrainingCenterName: batchData.TrainingCenterName,
                TrainingPartnerEmail: batchData.TrainingPartnerEmail,
                startTime: batchData.startTime,
                endTime: batchData.endTime,
                startDate: batchData.startDate,
                endDate: batchData.endDate,
                batchName: batchData.batchName,
                TotalCandidate: batchData.TotalCandidate,
                photo: batchData.photo,
                video: batchData.video,

                clientId: isClient._id,
                clientName: isClient.clientName,
                createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                createdById: isClient._id,
                createdByName: isClient.clientName,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isClient.clientName,
                lastUpdatedById: isClient._id,
                status: "Active"
            }));

            console.log(addBatchData);
            const createdBatch = await batchUploadModel.create(addBatchData);
            return res.status(200).json({ res: true, message: 'Bulk upload successful', createdBatch });
        }
        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'File is missing.' });
            }
            const filePath = req.file.path;
            const file = fs.readFileSync(filePath);
            const workbook = xlsx.read(file, { type: 'buffer' });
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                return res.status(400).json({ error: 'No sheets found in the Excel file.' });
            }

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            if (!sheet) {
                return res.status(400).json({ error: `Sheet ${sheetName} not found in the Excel file.` });
            }
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            if (!data || data.length === 0) {
                return res.status(400).json({ error: 'No data found in the Excel sheet.' });
            }
            const headers = data[0];

            // Define required fields
            const requiredFields = [
                'state', 'district', 'sectorName', 'jobRoleName',
                'TrainingCenterName', 'TrainingPartnerEmail', 'startTime',
                'endTime', 'startDate', 'endDate', 'batchName', 'TotalCandidate',
                'photo', 'video'
            ];

            // Check for missing fields
            const missingFields = requiredFields.filter(field => !headers.includes(field));
            if (missingFields.length > 0) {
                return res.status(400).json({ res: false, msg: `Missing required fields in Excel: ${missingFields.join(', ')}` });
            }

            // Convert sheet to JSON
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            console.log('jsonData',jsonData)
            const addBatchData = jsonData.map(batchData => ({
                state: batchData.state,
                district: batchData.district,
                sectorName: batchData.sectorName,
                jobRoleName: batchData.jobRoleName,
                TrainingCenterName: batchData.TrainingCenterName,
                TrainingPartnerEmail: batchData.TrainingPartnerEmail,
                startTime: batchData.startTime,
                endTime: batchData.endTime,
                startDate: batchData.startDate,
                endDate: batchData.endDate,
                batchName: batchData.BatchName,
                TotalCandidate: batchData.TotalCandidate,
                photo: batchData.photo,
                video: batchData.video,

                clientId: isClient._id,
                clientName: isClient.clientName,
                createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                createdById: isClient._id,
                createdByName: isClient.clientName,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isClient.clientName,
                lastUpdatedById: isClient._id,
                status: "Active",
                spocCreatedById: isSpocPerson._id,
                spocCreatedByName: isSpocPerson.spocPersonName
            }));

            const createdBatch = await batchUploadModel.create(addBatchData);
            return res.status(200).json({ res: true, message: 'Bulk upload successful', createdBatch });
        }

        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'File is missing.' });
            }
            const filePath = req.file.path;
            const file = fs.readFileSync(filePath);
            const workbook = xlsx.read(file, { type: 'buffer' });
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                return res.status(400).json({ error: 'No sheets found in the Excel file.' });
            }

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            if (!sheet) {
                return res.status(400).json({ error: `Sheet ${sheetName} not found in the Excel file.` });
            }
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            if (!data || data.length === 0) {
                return res.status(400).json({ error: 'No data found in the Excel sheet.' });
            }
            const headers = data[0];

            // Define required fields
            const requiredFields = [
                'state', 'district', 'assginedSectorsId', 'jobRoleId',
                'TrainingCenterName', 'TrainingPartnerEmail', 'startTime',
                'endTime', 'startDate', 'endDate', 'BatchCode', 'TotalCandidate',
                'photo', 'video'
            ];

            // Check for missing fields
            const missingFields = requiredFields.filter(field => !headers.includes(field));
            if (missingFields.length > 0) {
                return res.status(400).json({ res: false, msg: `Missing required fields in Excel: ${missingFields.join(', ')}` });
            }

            // Convert sheet to JSON
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            const addBatchData = jsonData.map(batchData => ({
                state: batchData.state,
                district: batchData.district,
                assginedSectorsId: batchData.assginedSectorsId,
                jobRoleId: batchData.jobRoleId,
                TrainingCenterName: batchData.TrainingCenterName,
                TrainingPartnerEmail: batchData.TrainingPartnerEmail,
                startTime: batchData.startTime,
                endTime: batchData.endTime,
                startDate: batchData.startDate,
                endDate: batchData.endDate,
                BatchCode: batchData.BatchCode,
                TotalCandidate: batchData.TotalCandidate,
                photo: batchData.photo,
                video: batchData.video,

                clientId: isClient._id,
                clientName: isClient.clientName,
                createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                createdById: isClient._id,
                createdByName: isClient.clientName,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isClient.clientName,
                lastUpdatedById: isClient._id,
                status: "Active",
                childUserCreatedById: isChildUser._id,
                childUserCreatedByName: isChildUser.childUserName
            }));

            const createdBatch = await batchUploadModel.create(addBatchData);
            return res.status(200).json({ res: true, message: 'Bulk upload successful', createdBatch });

        }
    } catch (error) {
        console.error('Error in bulk upload', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const moveBatch = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'clientEmail is not found!',
                });
            }
            const batchIds = req.body.ids;
            if (!Array.isArray(batchIds) || batchIds.length === 0) {
                return res.status(400).json({
                    res: false,
                    msg: 'No candidate IDs provided!'
                });
            }

            for (const batchId of batchIds) {
                const batchData = await batchUploadModel.findById(batchId);
                if (!batchData) {
                    continue;
                }
                const manageBatch = new BatchModel({
                    state: batchData.state,
                    district: batchData.district,
                    batch: batchData.batch,
                    sector: batchData.sector,
                    assginedSectorsId: batchData.id,
                    jobRole: batchData.jobRole,
                    jobRoleId: batchData.id,
                    TrainingPartnerName: batchData.TrainingPartnerName,
                    TrainingCenterName: batchData.TrainingCenterName,
                    TrainingPartnerEmail: batchData.TrainingPartnerEmail,
                    TrainingCenterEmail: batchData.TrainingCenterEmail,
                    StartDate: batchData.startDate,
                    StartTime: batchData.startTime,
                    EndDate: batchData.endDate,
                    EndTime: batchData.endTime,
                    BatchCode: batchData.BatchCode,
                    TotalCandidate: batchData.TotalCandidate,
                    photo: batchData.photo,
                    video: batchData.video,
                    PhotoCaptureMinute: batchData.PhotoCaptureMinute,
                    videoCaptureMinute: batchData.videoCaptureMinute,

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

                await manageBatch.save();

                await batchUploadModel.findByIdAndDelete(batchId);
            }
            return res.json({
                res: true,
                msg: 'manageBatch moved successfully!'
            });
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const batchIds = req.body.ids;
            if (!Array.isArray(batchIds) || batchIds.length === 0) {
                return res.status(400).json({
                    res: false,
                    msg: 'No candidate IDs provided!'
                });
            }

            for (const batchId of batchIds) {
                const batchData = await batchUploadModel.findById(batchId);
                if (!batchData) {
                    continue;
                }
                const manageBatch = new BatchModel({
                    state: batchData.state,
                    district: batchData.district,
                    batch: batchData.batch,
                    sector: batchData.sector,
                    assginedSectorsId: batchData.id,
                    jobRole: batchData.jobRole,
                    jobRoleId: batchData.id,
                    TrainingPartnerName: batchData.TrainingPartnerName,
                    TrainingCenterName: batchData.TrainingCenterName,
                    TrainingPartnerEmail: batchData.TrainingPartnerEmail,
                    TrainingCenterEmail: batchData.TrainingCenterEmail,
                    StartDate: batchData.startDate,
                    StartTime: batchData.startTime,
                    EndDate: batchData.endDate,
                    EndTime: batchData.endTime,
                    BatchCode: batchData.BatchCode,
                    TotalCandidate: batchData.TotalCandidate,
                    photo: batchData.photo,
                    video: batchData.video,
                    PhotoCaptureMinute: batchData.PhotoCaptureMinute,
                    videoCaptureMinute: batchData.videoCaptureMinute,

                    clientId: isClient._id,
                    clientName: isClient.clientName,
                    createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    createdById: isClient._id,
                    createdByName: isClient.clientName,
                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isClient.clientName,
                    lastUpdatedById: isClient._id,
                    status: "Active",
                    spocCreatedById: isSpocPerson._id,
                    spocCreatedByName: isSpocPerson.spocPersonName
                });

                await manageBatch.save();

                await batchUploadModel.findByIdAndDelete(batchId);
            }
            return res.json({
                res: true,
                msg: 'manageBatch moved successfully!'
            });
        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const batchIds = req.body.ids;
            if (!Array.isArray(batchIds) || batchIds.length === 0) {
                return res.status(400).json({
                    res: false,
                    msg: 'No candidate IDs provided!'
                });
            }

            for (const batchId of batchIds) {
                const batchData = await batchUploadModel.findById(batchId);
                if (!batchData) {
                    continue;
                }
                const manageBatch = new BatchModel({
                    state: batchData.state,
                    district: batchData.district,
                    batch: batchData.batch,
                    sector: batchData.sector,
                    assginedSectorsId: batchData.id,
                    jobRole: batchData.jobRole,
                    jobRoleId: batchData.id,
                    TrainingPartnerName: batchData.TrainingPartnerName,
                    TrainingCenterName: batchData.TrainingCenterName,
                    TrainingPartnerEmail: batchData.TrainingPartnerEmail,
                    TrainingCenterEmail: batchData.TrainingCenterEmail,
                    StartDate: batchData.startDate,
                    StartTime: batchData.startTime,
                    EndDate: batchData.endDate,
                    EndTime: batchData.endTime,
                    BatchCode: batchData.BatchCode,
                    TotalCandidate: batchData.TotalCandidate,
                    photo: batchData.photo,
                    video: batchData.video,
                    PhotoCaptureMinute: batchData.PhotoCaptureMinute,
                    videoCaptureMinute: batchData.videoCaptureMinute,

                    clientId: isClient._id,
                    clientName: isClient.clientName,
                    createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    createdById: isClient._id,
                    createdByName: isClient.clientName,
                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isClient.clientName,
                    lastUpdatedById: isClient._id,
                    status: "Active",
                    childUserCreatedById: isChildUser._id,
                    childUserCreatedByName: isChildUser.childUserName
                });

                await manageBatch.save();

                await batchUploadModel.findByIdAndDelete(batchId);
            }
            return res.json({
                res: true,
                msg: 'manageBatch moved successfully!'
            });
        }

    } catch (error) {
        console.error('Error in manageBatch move: ', error);
        return res.status(500).json({
            res: false,
            msg: 'Something went wrong!'
        });
    }
}

const deleteBatch = async (req, res) => {
    try {

        const batchIds = req.body.ids;

        if (!Array.isArray(batchIds) || batchIds.length === 0) {
            return res.status(400).json({
                res: false,
                msg: 'No candidate IDs provided!'
            });
        }
        // Delete bulkData by IDs
        await batchUploadModel.deleteMany({ _id: { $in: batchIds } });
        return res.json({
            res: true,
            msg: 'BtachData deleted successfully!'
        });

    } catch (error) {
        console.error('Error in delete BtachData: ', error);
        return res.status(500).json({
            res: false,
            msg: 'Something went wrong!'
        });
    }
}

const bulkDataList = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = { createdById: isClient._id };
            // let query = { }

            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            if (req.query.district) {
                query = { ...query, district: req.query.district }
            }

            const bulkData = await batchUploadModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved bulkData List ",
                data: bulkData.docs,
                paginate: {
                    totalDocs: bulkData.totalDocs,
                    limit: bulkData.limit,
                    totalPages: bulkData.totalPages,
                    page: bulkData.page,
                    pagingCounter: bulkData.pagingCounter,
                    hasPrevPage: bulkData.hasPrevPage,
                    hasNextPage: bulkData.hasNextPage,
                    prevPage: bulkData.prevPage,
                    nextPage: bulkData.nextPage
                }
            });
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = { createdById: isClient._id, spocCreatedById: isSpocPerson._id };
            // let query = { }

            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            if (req.query.district) {
                query = { ...query, district: req.query.district }
            }

            const bulkData = await batchUploadModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved bulkData List ",
                data: bulkData.docs,
                paginate: {
                    totalDocs: bulkData.totalDocs,
                    limit: bulkData.limit,
                    totalPages: bulkData.totalPages,
                    page: bulkData.page,
                    pagingCounter: bulkData.pagingCounter,
                    hasPrevPage: bulkData.hasPrevPage,
                    hasNextPage: bulkData.hasNextPage,
                    prevPage: bulkData.prevPage,
                    nextPage: bulkData.nextPage
                }
            });

        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = { createdById: isClient._id, childUserCreatedById: isChildUser._id };
            // let query = { }

            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            if (req.query.district) {
                query = { ...query, district: req.query.district }
            }

            const bulkData = await batchUploadModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved bulkData List ",
                data: bulkData.docs,
                paginate: {
                    totalDocs: bulkData.totalDocs,
                    limit: bulkData.limit,
                    totalPages: bulkData.totalPages,
                    page: bulkData.page,
                    pagingCounter: bulkData.pagingCounter,
                    hasPrevPage: bulkData.hasPrevPage,
                    hasNextPage: bulkData.hasNextPage,
                    prevPage: bulkData.prevPage,
                    nextPage: bulkData.nextPage
                }
            });
        }

    } catch (error) {
        console.error('error in bulkDataList ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}

//manage BatchData  */


const add_batch = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'clientEmail is not found!',
                });
            }

            //required field
            const { assginedSectorsId, state, district, jobRoleId, TrainingPartnerName,
                TrainingCenterName, StartDate, StartTime,
                EndDate, EndTime, BatchCode, TotalCandidate, photo, video, PhotoCaptureMinute, videoCaptureMinute } = req.body
            const TrainingPartnerEmail = req.body.TrainingPartnerEmail.toLowerCase();
            const TrainingCenterEmail = req.body.TrainingCenterEmail.toLowerCase();

            if (state == "" || district == "" || jobRoleId == "" || TrainingPartnerName == "" || TrainingCenterName == ""
                || TrainingPartnerEmail == "" || TrainingCenterEmail == "" || StartDate == "" || StartTime == "" || EndDate == "" || EndTime == ""
                || BatchCode == "" || TotalCandidate == "" || photo == "" || video == "" || PhotoCaptureMinute == "" || videoCaptureMinute == "") {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }
            const isSector = await SectorModel.findOne({ _id: assginedSectorsId });

            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }
            const isJobRole = await JobRoleModel.findOne({ _id: jobRoleId });

            if (!isJobRole) {
                return res.json({
                    res: false,
                    msg: 'Job Role is not found!',
                });
            }
            await BatchModel.create({
                state: req.body.state,
                district: req.body.district,
                batch: req.body.batch,
                sector: req.body.sector,
                assginedSectorsId: isSector.id,
                jobRole: req.body.jobRole,
                jobRoleId: isJobRole.id,
                TrainingPartnerName: req.body.TrainingPartnerName,
                TrainingCenterName: req.body.TrainingCenterName,
                TrainingPartnerEmail,
                TrainingCenterEmail,
                StartDate: req.body.StartDate,
                StartTime: req.body.StartTime,
                EndDate: req.body.EndDate,
                EndTime: req.body.EndTime,
                BatchCode: req.body.BatchCode,
                TotalCandidate: req.body.TotalCandidate,
                photo: req.body.photo,
                video: req.body.video,
                PhotoCaptureMinute: req.body.PhotoCaptureMinute,
                videoCaptureMinute: req.body.videoCaptureMinute,

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
                msg: 'Successfully Batch Add.',
            });
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const { assginedSectorsId, state, district, jobRoleId, TrainingPartnerName,
                TrainingCenterName, StartDate, StartTime,
                EndDate, EndTime, BatchCode, TotalCandidate, photo, video, PhotoCaptureMinute, videoCaptureMinute } = req.body
            const TrainingPartnerEmail = req.body.TrainingPartnerEmail.toLowerCase();
            const TrainingCenterEmail = req.body.TrainingCenterEmail.toLowerCase();

            if (state == "" || district == "" || jobRoleId == "" || TrainingPartnerName == "" || TrainingCenterName == ""
                || TrainingPartnerEmail == "" || TrainingCenterEmail == "" || StartDate == "" || StartTime == "" || EndDate == "" || EndTime == ""
                || BatchCode == "" || TotalCandidate == "" || photo == "" || video == "" || PhotoCaptureMinute == "" || videoCaptureMinute == "") {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }
            const isSector = await SectorModel.findOne({ _id: assginedSectorsId });

            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }
            const isJobRole = await JobRoleModel.findOne({ _id: jobRoleId });

            if (!isJobRole) {
                return res.json({
                    res: false,
                    msg: 'Job Role is not found!',
                });
            }
            await BatchModel.create({
                state: req.body.state,
                district: req.body.district,
                batch: req.body.batch,
                sector: req.body.sector,
                assginedSectorsId: isSector.id,
                jobRole: req.body.jobRole,
                jobRoleId: isJobRole.id,
                TrainingPartnerName: req.body.TrainingPartnerName,
                TrainingCenterName: req.body.TrainingCenterName,
                TrainingPartnerEmail,
                TrainingCenterEmail,
                StartDate: req.body.StartDate,
                StartTime: req.body.StartTime,
                EndDate: req.body.EndDate,
                EndTime: req.body.EndTime,
                BatchCode: req.body.BatchCode,
                TotalCandidate: req.body.TotalCandidate,
                photo: req.body.photo,
                video: req.body.video,
                PhotoCaptureMinute: req.body.PhotoCaptureMinute,
                videoCaptureMinute: req.body.videoCaptureMinute,

                clientId: isClient._id,
                clientName: isClient.clientName,
                createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                createdById: isClient._id,
                createdByName: isClient.clientName,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isClient.clientName,
                lastUpdatedById: isClient._id,
                status: "Active",
                spocCreatedById: isSpocPerson._id,
                spocCreatedByName: isSpocPerson.spocPersonName
            })
            return res.json({
                res: true,
                msg: 'Successfully Batch Add.',
            });
        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const { assginedSectorsId, state, district, jobRoleId, TrainingPartnerName,
                TrainingCenterName, StartDate, StartTime,
                EndDate, EndTime, BatchCode, TotalCandidate, photo, video, PhotoCaptureMinute, videoCaptureMinute } = req.body
            const TrainingPartnerEmail = req.body.TrainingPartnerEmail.toLowerCase();
            const TrainingCenterEmail = req.body.TrainingCenterEmail.toLowerCase();

            if (state == "" || district == "" || jobRoleId == "" || TrainingPartnerName == "" || TrainingCenterName == ""
                || TrainingPartnerEmail == "" || TrainingCenterEmail == "" || StartDate == "" || StartTime == "" || EndDate == "" || EndTime == ""
                || BatchCode == "" || TotalCandidate == "" || photo == "" || video == "" || PhotoCaptureMinute == "" || videoCaptureMinute == "") {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }
            const isSector = await SectorModel.findOne({ _id: assginedSectorsId });

            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }
            const isJobRole = await JobRoleModel.findOne({ _id: jobRoleId });

            if (!isJobRole) {
                return res.json({
                    res: false,
                    msg: 'Job Role is not found!',
                });
            }
            await BatchModel.create({
                state: req.body.state,
                district: req.body.district,
                batch: req.body.batch,
                sector: req.body.sector,
                assginedSectorsId: isSector.id,
                jobRole: req.body.jobRole,
                jobRoleId: isJobRole.id,
                TrainingPartnerName: req.body.TrainingPartnerName,
                TrainingCenterName: req.body.TrainingCenterName,
                TrainingPartnerEmail,
                TrainingCenterEmail,
                StartDate: req.body.StartDate,
                StartTime: req.body.StartTime,
                EndDate: req.body.EndDate,
                EndTime: req.body.EndTime,
                BatchCode: req.body.BatchCode,
                TotalCandidate: req.body.TotalCandidate,
                photo: req.body.photo,
                video: req.body.video,
                PhotoCaptureMinute: req.body.PhotoCaptureMinute,
                videoCaptureMinute: req.body.videoCaptureMinute,

                clientId: isClient._id,
                clientName: isClient.clientName,
                createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                createdById: isClient._id,
                createdByName: isClient.clientName,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isClient.clientName,
                lastUpdatedById: isClient._id,
                status: "Active",
                childUserCreatedById: isChildUser._id,
                childUserCreatedByName: isChildUser.childUserName
            })
            return res.json({
                res: true,
                msg: 'Successfully Batch Add.',
            });

        }
    } catch (error) {
        console.error('error in batch added ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}

const getBatchData = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }

            if (!req.user.id) {
                return res.json({
                    res: false,
                    msg: 'Client ID is missing',
                });
            }

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = {
                createdById: isClient._id,
            };
            if (req.query.jobRoleId) {
                query = { ...query, jobRoleId: req.query.jobRoleId }
            }
            if (req.query.assginedSectorsId) {
                query = { ...query, assginedSectorsId: req.query.assginedSectorsId }
            }
            if (req.query.batch) {
                query = { ...query, batch: req.query.batch }
            }
            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            if (req.query.district) {
                query = { ...query, district: req.query.district }
            }

            const bulkDataList = await BatchModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved Manage bulkData List  ",
                data: bulkDataList.docs,
                paginate: {
                    totalDocs: bulkDataList.totalDocs,
                    limit: bulkDataList.limit,
                    totalPages: bulkDataList.totalPages,
                    page: bulkDataList.page,
                    pagingCounter: bulkDataList.pagingCounter,
                    hasPrevPage: bulkDataList.hasPrevPage,
                    hasNextPage: bulkDataList.hasNextPage,
                    prevPage: bulkDataList.prevPage,
                    nextPage: bulkDataList.nextPage
                }
            });
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = {
                createdById: isClient._id,
                spocCreatedById: isSpocPerson._id
            };
            if (req.query.jobRoleId) {
                query = { ...query, jobRoleId: req.query.jobRoleId }
            }
            if (req.query.assginedSectorsId) {
                query = { ...query, assginedSectorsId: req.query.assginedSectorsId }
            }
            if (req.query.batch) {
                query = { ...query, batch: req.query.batch }
            }
            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            if (req.query.district) {
                query = { ...query, district: req.query.district }
            }

            const bulkDataList = await BatchModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved Manage bulkData List  ",
                data: bulkDataList.docs,
                paginate: {
                    totalDocs: bulkDataList.totalDocs,
                    limit: bulkDataList.limit,
                    totalPages: bulkDataList.totalPages,
                    page: bulkDataList.page,
                    pagingCounter: bulkDataList.pagingCounter,
                    hasPrevPage: bulkDataList.hasPrevPage,
                    hasNextPage: bulkDataList.hasNextPage,
                    prevPage: bulkDataList.prevPage,
                    nextPage: bulkDataList.nextPage
                }
            });
        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = {
                createdById: isClient._id,
                childUserCreatedById: isChildUser._id
            };
            if (req.query.jobRoleId) {
                query = { ...query, jobRoleId: req.query.jobRoleId }
            }
            if (req.query.assginedSectorsId) {
                query = { ...query, assginedSectorsId: req.query.assginedSectorsId }
            }
            if (req.query.batch) {
                query = { ...query, batch: req.query.batch }
            }
            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            if (req.query.district) {
                query = { ...query, district: req.query.district }
            }

            const bulkDataList = await BatchModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved Manage bulkData List  ",
                data: bulkDataList.docs,
                paginate: {
                    totalDocs: bulkDataList.totalDocs,
                    limit: bulkDataList.limit,
                    totalPages: bulkDataList.totalPages,
                    page: bulkDataList.page,
                    pagingCounter: bulkDataList.pagingCounter,
                    hasPrevPage: bulkDataList.hasPrevPage,
                    hasNextPage: bulkDataList.hasNextPage,
                    prevPage: bulkDataList.prevPage,
                    nextPage: bulkDataList.nextPage
                }
            });
        }

    } catch (error) {
        console.error('error in Manage bulkDataList ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}

const editBatchData = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }

            const batchData = await BatchModel.findById(req.params.id);
            if (!batchData) {
                return res.json({
                    res: false,
                    msg: 'Batch not found!',
                });
            }

            const updatedData = {
                state: req.body.state || batchData.state,
                district: req.body.district || batchData.district,
                batch: req.body.batch || batchData.batch,
                sector: req.body.sector || batchData.sector,
                assignedSectorsId: req.body.assignedSectorsId || batchData.assignedSectorsId,
                jobRole: req.body.jobRole || batchData.jobRole,
                jobRoleId: req.body.jobRoleId || batchData.jobRoleId,
                TrainingPartnerName: req.body.TrainingPartnerName || batchData.TrainingPartnerName,
                TrainingCenterName: req.body.TrainingCenterName || batchData.TrainingCenterName,
                TrainingPartnerEmail: req.body.TrainingPartnerEmail.toLowerCase() || batchData.TrainingPartnerEmail,
                TrainingCenterEmail: req.body.TrainingCenterEmail.toLowerCase() || batchData.TrainingCenterEmail,
                StartDate: req.body.StartDate || batchData.StartDate,
                StartTime: req.body.StartTime || batchData.StartTime,
                EndDate: req.body.EndDate || batchData.EndDate,
                EndTime: req.body.EndTime || batchData.EndTime,
                BatchCode: req.body.BatchCode || batchData.BatchCode,
                TotalCandidate: req.body.TotalCandidate || batchData.TotalCandidate,
                photo: req.body.photo || batchData.photo,
                video: req.body.video || batchData.video,
                PhotoCaptureMinute: req.body.PhotoCaptureMinute || batchData.PhotoCaptureMinute,
                videoCaptureMinute: req.body.videoCaptureMinute || batchData.videoCaptureMinute,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isClient.clientName,
                lastUpdatedById: isClient._id,
                status: "Active"
            };

            // Update the batch data
            const candidateUpdate = await BatchModel.findByIdAndUpdate(
                batchData._id,
                updatedData,
                { new: true }
            );

            return res.json({
                res: true,
                msg: 'Batch Data updated successfully.',

            });

        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const batchData = await BatchModel.findById(req.params.id);
            if (!batchData) {
                return res.json({
                    res: false,
                    msg: 'Batch not found!',
                });
            }

            const updatedData = {
                state: req.body.state || batchData.state,
                district: req.body.district || batchData.district,
                batch: req.body.batch || batchData.batch,
                sector: req.body.sector || batchData.sector,
                assignedSectorsId: req.body.assignedSectorsId || batchData.assignedSectorsId,
                jobRole: req.body.jobRole || batchData.jobRole,
                jobRoleId: req.body.jobRoleId || batchData.jobRoleId,
                TrainingPartnerName: req.body.TrainingPartnerName || batchData.TrainingPartnerName,
                TrainingCenterName: req.body.TrainingCenterName || batchData.TrainingCenterName,
                TrainingPartnerEmail: req.body.TrainingPartnerEmail.toLowerCase() || batchData.TrainingPartnerEmail,
                TrainingCenterEmail: req.body.TrainingCenterEmail.toLowerCase() || batchData.TrainingCenterEmail,
                StartDate: req.body.StartDate || batchData.StartDate,
                StartTime: req.body.StartTime || batchData.StartTime,
                EndDate: req.body.EndDate || batchData.EndDate,
                EndTime: req.body.EndTime || batchData.EndTime,
                BatchCode: req.body.BatchCode || batchData.BatchCode,
                TotalCandidate: req.body.TotalCandidate || batchData.TotalCandidate,
                photo: req.body.photo || batchData.photo,
                video: req.body.video || batchData.video,
                PhotoCaptureMinute: req.body.PhotoCaptureMinute || batchData.PhotoCaptureMinute,
                videoCaptureMinute: req.body.videoCaptureMinute || batchData.videoCaptureMinute,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isSpocPerson.spocPersonName,
                lastUpdatedById: isSpocPerson._id,
                status: "Active"
            };

            // Update the batch data
            const candidateUpdate = await BatchModel.findByIdAndUpdate(
                batchData._id,
                updatedData,
                { new: true }
            );

            return res.json({
                res: true,
                msg: 'Batch Data updated successfully.',

            });
        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const batchData = await BatchModel.findById(req.params.id);
            if (!batchData) {
                return res.json({
                    res: false,
                    msg: 'Batch not found!',
                });
            }
            const updatedData = {
                state: req.body.state || batchData.state,
                district: req.body.district || batchData.district,
                batch: req.body.batch || batchData.batch,
                sector: req.body.sector || batchData.sector,
                assignedSectorsId: req.body.assignedSectorsId || batchData.assignedSectorsId,
                jobRole: req.body.jobRole || batchData.jobRole,
                jobRoleId: req.body.jobRoleId || batchData.jobRoleId,
                TrainingPartnerName: req.body.TrainingPartnerName || batchData.TrainingPartnerName,
                TrainingCenterName: req.body.TrainingCenterName || batchData.TrainingCenterName,
                TrainingPartnerEmail: req.body.TrainingPartnerEmail.toLowerCase() || batchData.TrainingPartnerEmail,
                TrainingCenterEmail: req.body.TrainingCenterEmail.toLowerCase() || batchData.TrainingCenterEmail,
                StartDate: req.body.StartDate || batchData.StartDate,
                StartTime: req.body.StartTime || batchData.StartTime,
                EndDate: req.body.EndDate || batchData.EndDate,
                EndTime: req.body.EndTime || batchData.EndTime,
                BatchCode: req.body.BatchCode || batchData.BatchCode,
                TotalCandidate: req.body.TotalCandidate || batchData.TotalCandidate,
                photo: req.body.photo || batchData.photo,
                video: req.body.video || batchData.video,
                PhotoCaptureMinute: req.body.PhotoCaptureMinute || batchData.PhotoCaptureMinute,
                videoCaptureMinute: req.body.videoCaptureMinute || batchData.videoCaptureMinute,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isChildUser.childUserName,
                lastUpdatedById: isChildUser._id,
                status: "Active"
            };

            // Update the batch data
            const candidateUpdate = await BatchModel.findByIdAndUpdate(
                batchData._id,
                updatedData,
                { new: true }
            );

            return res.json({
                res: true,
                msg: 'Batch Data updated successfully.',

            });

        }
    } catch (error) {
        console.error('Error in editBatchData:', error);
        return res.json({
            res: false,
            msg: 'Something went wrong!'
        });
    }

}

const deleteBatchData = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }
            const batchData = await BatchModel.findOne({ _id: req.params.id })
            if (!batchData) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }
            await BatchModel.deleteOne({ _id: batchData._id })
            return res.json({
                res: true,
                msg: 'Successfully BatchData remove.',
            });
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const batchData = await BatchModel.findOne({ _id: req.params.id })
            if (!batchData) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }
            await BatchModel.deleteOne({ _id: batchData._id })
            return res.json({
                res: true,
                msg: 'Successfully BatchData remove.',
            });

        }

        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const batchData = await BatchModel.findOne({ _id: req.params.id })
            if (!batchData) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }
            await BatchModel.deleteOne({ _id: batchData._id })
            return res.json({
                res: true,
                msg: 'Successfully BatchData remove.',
            });

        }
    } catch (error) {
        console.error("Error in Delete BatchData:", error);
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while delete the BatchData ',
        });
    }
}
const scheduleBatchList = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }
            if (!req.user.id) {
                return res.json({
                    res: false,
                    msg: 'Client ID is missing',
                });
            }
            const today = moment().format('YYYY-MM-DD');

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = {
                createdById: isClient._id,
                StartDate: today
            };

            const bulkDataList = await ManageBatchModel.paginate(query, options);
            return res.json({
                res: true,
                msg: 'Schedule Batch List retrieved successfully',
                data: bulkDataList,
                data: bulkDataList.docs,
                paginate: {
                    totalDocs: bulkDataList.totalDocs,
                    limit: bulkDataList.limit,
                    totalPages: bulkDataList.totalPages,
                    page: bulkDataList.page,
                    pagingCounter: bulkDataList.pagingCounter,
                    hasPrevPage: bulkDataList.hasPrevPage,
                    hasNextPage: bulkDataList.hasNextPage,
                    prevPage: bulkDataList.prevPage,
                    nextPage: bulkDataList.nextPage
                }

            });
        }
        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            const today = moment().format('YYYY-MM-DD');

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = {
                createdById: isClient._id,
                spocCreatedById: isSpocPerson._id,
                StartDate: today
            };

            const bulkDataList = await ManageBatchModel.paginate(query, options);
            return res.json({
                res: true,
                msg: 'Schedule Batch List retrieved successfully',
                data: bulkDataList,
                data: bulkDataList.docs,
                paginate: {
                    totalDocs: bulkDataList.totalDocs,
                    limit: bulkDataList.limit,
                    totalPages: bulkDataList.totalPages,
                    page: bulkDataList.page,
                    pagingCounter: bulkDataList.pagingCounter,
                    hasPrevPage: bulkDataList.hasPrevPage,
                    hasNextPage: bulkDataList.hasNextPage,
                    prevPage: bulkDataList.prevPage,
                    nextPage: bulkDataList.nextPage
                }

            });

        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const today = moment().format('YYYY-MM-DD');

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = {
                createdById: isClient._id,
                childUserCreatedById: isChildUser._id,
                StartDate: today
            };

            const bulkDataList = await ManageBatchModel.paginate(query, options);
            return res.json({
                res: true,
                msg: 'Schedule Batch List retrieved successfully',
                data: bulkDataList,
                data: bulkDataList.docs,
                paginate: {
                    totalDocs: bulkDataList.totalDocs,
                    limit: bulkDataList.limit,
                    totalPages: bulkDataList.totalPages,
                    page: bulkDataList.page,
                    pagingCounter: bulkDataList.pagingCounter,
                    hasPrevPage: bulkDataList.hasPrevPage,
                    hasNextPage: bulkDataList.hasNextPage,
                    prevPage: bulkDataList.prevPage,
                    nextPage: bulkDataList.nextPage
                }

            });
        }

    } catch (error) {
        console.error("Error in scheduleBatchList:", error);
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while Schedule Batch get List',
        });
    }
}
const currentBatch = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }
            if (!req.user.id) {
                return res.json({
                    res: false,
                    msg: 'Client ID is missing',
                });
            }
            const currentTime = moment().format('hh:mm A');
            const currentDate = moment().format('DD-MM-YYYY');
            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };
            const query = {
                createdById: isClient._id,
                $expr: {
                    $and: [
                        { $lte: ["$StartTime", currentTime] },
                        { $gte: ["$EndTime", currentTime] }
                    ]
                }
            };
            const currentBatch = await ManageBatchModel.paginate(query, options);
            return res.json({
                res: true,
                msg: 'Schedule Batch List retrieved successfully',
                data: currentBatch,
                data: currentBatch.docs,
                paginate: {
                    totalDocs: currentBatch.totalDocs,
                    limit: currentBatch.limit,
                    totalPages: currentBatch.totalPages,
                    page: currentBatch.page,
                    pagingCounter: currentBatch.pagingCounter,
                    hasPrevPage: currentBatch.hasPrevPage,
                    hasNextPage: currentBatch.hasNextPage,
                    prevPage: currentBatch.prevPage,
                    nextPage: currentBatch.nextPage
                }

            });
        }
        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            const currentTime = moment().format('hh:mm A');
            const currentDate = moment().format('DD-MM-YYYY');
            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };
            const query = {
                createdById: isClient._id,
                spocCreatedById: isSpocPerson._id,
                $expr: {
                    $and: [
                        { $lte: ["$StartTime", currentTime] },
                        { $gte: ["$EndTime", currentTime] }
                    ]
                }
            };
            const currentBatch = await ManageBatchModel.paginate(query, options);
            return res.json({
                res: true,
                msg: 'Schedule Batch List retrieved successfully',
                data: currentBatch,
                data: currentBatch.docs,
                paginate: {
                    totalDocs: currentBatch.totalDocs,
                    limit: currentBatch.limit,
                    totalPages: currentBatch.totalPages,
                    page: currentBatch.page,
                    pagingCounter: currentBatch.pagingCounter,
                    hasPrevPage: currentBatch.hasPrevPage,
                    hasNextPage: currentBatch.hasNextPage,
                    prevPage: currentBatch.prevPage,
                    nextPage: currentBatch.nextPage
                }

            });
        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const currentTime = moment().format('hh:mm A');
            const currentDate = moment().format('DD-MM-YYYY');
            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };
            const query = {
                createdById: isClient._id,
                childUserCreatedById: isChildUser._id,
                $expr: {
                    $and: [
                        { $lte: ["$StartTime", currentTime] },
                        { $gte: ["$EndTime", currentTime] }
                    ]
                }
            };
            const currentBatch = await ManageBatchModel.paginate(query, options);
            return res.json({
                res: true,
                msg: 'Schedule Batch List retrieved successfully',
                data: currentBatch,
                data: currentBatch.docs,
                paginate: {
                    totalDocs: currentBatch.totalDocs,
                    limit: currentBatch.limit,
                    totalPages: currentBatch.totalPages,
                    page: currentBatch.page,
                    pagingCounter: currentBatch.pagingCounter,
                    hasPrevPage: currentBatch.hasPrevPage,
                    hasNextPage: currentBatch.hasNextPage,
                    prevPage: currentBatch.prevPage,
                    nextPage: currentBatch.nextPage
                }

            });
        }


    } catch (error) {
        console.error("Error in currentBatch:", error);
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while currentBatch get List',
        });
    }
}

const dropDown = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }
            const data = await BatchModel.find({ createdById: isClient._id, status: "Active" }, "_id BatchCode")
            return res.json({
                res: true,
                msg: 'Successfully dropDown',
                data: data
            });
        }
        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const data = await BatchModel.find({ createdById: isClient._id, spocCreatedById: isSpocPerson._id, status: "Active" }, "_id BatchCode")
            return res.json({
                res: true,
                msg: 'Successfully dropDown',
                data: data
            });
        }
        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const data = await BatchModel.find({ createdById: isClient._id, childUserCreatedById: isChildUser._id, status: "Active" }, "_id BatchCode")
            return res.json({
                res: true,
                msg: 'Successfully dropDown',
                data: data
            });
        }
    } catch (error) {
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while dropDown',
        });
    }
}


module.exports = {
    add_batch,
    batch_bulkupload,
    moveBatch,
    deleteBatch,
    bulkDataList,
    getBatchData,
    editBatchData,
    deleteBatchData,
    scheduleBatchList,
    currentBatch,
    dropDown

}
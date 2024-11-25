const candidateModel = require("../../models/Candidatebulk")  //move data manage candidate
const manageCandidate = require('../../models/manageCandidate')
const ClientModel = require("../../models/client.model")
const SectorModel = require("../../models/sector.model")
const JobRoleModel = require("../../models/job-role.model")
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model");
const bcrypt = require('bcryptjs');


const fs = require('fs');
const xlsx = require('xlsx');
const moment = require("moment-timezone")

const addCandidate = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {
            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'clientEmail is not found!',
                });
            }
            const {
                BatchName,
                CandidateName,
                EnrollmentNumber,
                Gender,
                ContactNumber,
                DateOfBirth,
                FatherName,
                AadharCard,
                Address, } = req.body
            const Email = req.body.Email.toLowerCase()



            if (BatchName == "" || CandidateName == "" || EnrollmentNumber == "") {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'File is missing..' });
            }

            const isExistEmail = await candidateModel.findOne({ Email: Email, clientId: isClient._id })
            if (isExistEmail) {
                return res.json({
                    status: false,
                    msg: "email is already existing"
                })
            }
            const isExistMobile = await candidateModel.findOne({ ContactNumber: ContactNumber, clientId: isClient._id })
            if (isExistMobile) {
                return res.json({
                    status: false,
                    msg: "ContactNumber is already existing"
                })
            }

            await candidateModel.create({
                BatchName,
                EnrollmentNumber,
                Gender,
                CandidateName,
                Email,
                ContactNumber,
                DateOfBirth,
                FatherName,
                Address,
                ProfilePicture: `/upload/${req.file.filename}`,
                AadharCard,

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
                status: true,
                msg: 'Successfully add Candidate.',
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

            const {
                BatchName,
                CandidateName,
                EnrollmentNumber,
                Gender,
                ContactNumber,
                DateOfBirth,
                FatherName,
                AadharCard,
                Address, } = req.body
            const Email = req.body.Email.toLowerCase()



            if (BatchName == "" || CandidateName == "" || EnrollmentNumber == "") {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'File is missing..' });
            }

            const isExistEmail = await candidateModel.findOne({ Email: Email, clientId: isClient._id })
            if (isExistEmail) {
                return res.json({
                    status: false,
                    msg: "email is already existing"
                })
            }
            const isExistMobile = await candidateModel.findOne({ ContactNumber: ContactNumber, clientId: isClient._id })
            if (isExistMobile) {
                return res.json({
                    status: false,
                    msg: "ContactNumber is already existing"
                })
            }

            await candidateModel.create({
                BatchName,
                EnrollmentNumber,
                Gender,
                CandidateName,
                Email,
                ContactNumber,
                DateOfBirth,
                FatherName,
                Address,
                ProfilePicture: `/upload/${req.file.filename}`,
                AadharCard,

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
                status: true,
                msg: 'Successfully add Candidate.',
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
            const {
                BatchName,
                CandidateName,
                EnrollmentNumber,
                Gender,
                ContactNumber,
                DateOfBirth,
                FatherName,
                AadharCard,
                Address, } = req.body
            const Email = req.body.Email.toLowerCase()

            if (BatchName == "" || CandidateName == "" || EnrollmentNumber == "") {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'File is missing..' });
            }

            const isExistEmail = await candidateModel.findOne({ Email: Email, clientId: isClient._id })
            if (isExistEmail) {
                return res.json({
                    status: false,
                    msg: "email is already existing"
                })
            }
            const isExistMobile = await candidateModel.findOne({ ContactNumber: ContactNumber, clientId: isClient._id })
            if (isExistMobile) {
                return res.json({
                    status: false,
                    msg: "ContactNumber is already existing"
                })
            }

            await candidateModel.create({
                BatchName,
                EnrollmentNumber,
                Gender,
                CandidateName,
                Email,
                ContactNumber,
                DateOfBirth,
                FatherName,
                Address,
                ProfilePicture: `/upload/${req.file.filename}`,
                AadharCard,

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
                status: true,
                msg: 'Successfully add Candidate.',
            });
            

        }
    } catch (error) {
        console.error('error in create Candidate ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}

const candidateList = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'clientEmail is not found!',
                });
            }

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };

            let query = { createdById: isClient.id };
            if (req.query.sector) {
                query = { ...query, sector: req.query.sector };
            }
            if (req.query.job_Role) {
                query = { ...query, jobRole: req.query.jobRole };
            }
            if (req.query.Batch) {
                query = { ...query, Batch: req.query.Batch };
            }
            const CandidateData = await candidateModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved Candidate list",
                data: CandidateData.docs,
                paginate: {
                    totalDocs: CandidateData.totalDocs,
                    limit: CandidateData.limit,
                    totalPages: CandidateData.totalPages,
                    page: CandidateData.page,
                    pagingCounter: CandidateData.pagingCounter,
                    hasPrevPage: CandidateData.hasPrevPage,
                    hasNextPage: CandidateData.hasNextPage,
                    prevPage: CandidateData.prevPage,
                    nextPage: CandidateData.nextPage
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

            let query = { createdById: isClient.id, spocCreatedById: isSpocPerson._id };
            if (req.query.sector) {
                query = { ...query, sector: req.query.sector };
            }
            if (req.query.job_Role) {
                query = { ...query, jobRole: req.query.jobRole };
            }
            if (req.query.Batch) {
                query = { ...query, Batch: req.query.Batch };
            }
            const CandidateData = await candidateModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved Candidate list",
                data: CandidateData.docs,
                paginate: {
                    totalDocs: CandidateData.totalDocs,
                    limit: CandidateData.limit,
                    totalPages: CandidateData.totalPages,
                    page: CandidateData.page,
                    pagingCounter: CandidateData.pagingCounter,
                    hasPrevPage: CandidateData.hasPrevPage,
                    hasNextPage: CandidateData.hasNextPage,
                    prevPage: CandidateData.prevPage,
                    nextPage: CandidateData.nextPage
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

            let query = { createdById: isClient.id, childUserCreatedById: isChildUser._id };
            if (req.query.sector) {
                query = { ...query, sector: req.query.sector };
            }
            if (req.query.job_Role) {
                query = { ...query, jobRole: req.query.jobRole };
            }
            if (req.query.Batch) {
                query = { ...query, Batch: req.query.Batch };
            }
            const CandidateData = await candidateModel.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved Candidate list",
                data: CandidateData.docs,
                paginate: {
                    totalDocs: CandidateData.totalDocs,
                    limit: CandidateData.limit,
                    totalPages: CandidateData.totalPages,
                    page: CandidateData.page,
                    pagingCounter: CandidateData.pagingCounter,
                    hasPrevPage: CandidateData.hasPrevPage,
                    hasNextPage: CandidateData.hasNextPage,
                    prevPage: CandidateData.prevPage,
                    nextPage: CandidateData.nextPage
                }
            });


        }
    } catch (error) {
        console.error('error in getCandidate list ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}


const bulkupload = async (req, res) => {
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

            const data = xlsx.utils.sheet_to_json(sheet);
            if (!data || data.length === 0) {
                return res.status(400).json({ error: 'No data found in the Excel sheet.' });
            }

            const emails = data.map(candidate => candidate.Email);
            const contactNumbers = data.map(candidate => candidate.ContactNumber);
            const clientCandidate = await candidateModel.find({
                clientId: isClient._id,
                $or: [
                    { Email: { $in: emails } },
                    { ContactNumber: { $in: contactNumbers } }
                ]
            });

            const clientEmail = clientCandidate.map(candidate => candidate.Email);
            const clientContactNumber = clientCandidate.map(candidate => candidate.ContactNumber);
            const newCandidates = data.filter(candidate =>
                !clientEmail.includes(candidate.Email) &&
                !clientContactNumber.includes(candidate.ContactNumber)
            );

            // Generate password based on EnrollmentNumber
            const generatePassword = (enrollmentNumber) => {
                return `Pass${enrollmentNumber}`;
            };

            const CandidateData = await Promise.all(newCandidates.map(async candidate => {
                const password = generatePassword(candidate.EnrollmentNumber); // Generate password
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
                let dateOfBirth = candidate.DateOfBirth;
                if (dateOfBirth) {
                    // Check if the date format is "DD-MM-YYYY" and parse it using moment.js
                    dateOfBirth = moment(dateOfBirth, "DD-MM-YYYY").isValid()
                        ? moment(dateOfBirth, "DD-MM-YYYY").toDate()  // Convert to Date object
                        : null;  // If invalid, set to null (or you can handle as per your requirement)
                }

                return {
                    CandidateName: candidate.CandidateName,
                    EnrollmentNumber: candidate.EnrollmentNumber,
                    ContactNumber: candidate.ContactNumber,
                    FatherName: candidate.FatherName,
                    Email: candidate.Email.toLowerCase(),
                    Gender: candidate.Gender,
                    DateOfBirth: dateOfBirth,
                    AadharCard: candidate.AadharCard,
                    sector: candidate.sector,
                    job_Role: candidate.jobRole,
                    Batch: candidate.Batch,

                    clientId: isClient._id,
                    clientName: isClient.clientName,
                    createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    createdById: isClient._id,
                    createdByName: isClient.clientName,
                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isClient.clientName,
                    lastUpdatedById: isClient._id,
                    status: "Active",
                    password: hashedPassword // Add the hashed password
                };
            }));

            const createdCandidates = await candidateModel.create(CandidateData);

            return res.status(200).json({
                status: true,
                message: 'Bulk upload successful',
                createdCandidates,
                skippedRecords: data.length - newCandidates.length
            });
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email });
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId });
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

            const data = xlsx.utils.sheet_to_json(sheet);
            if (!data || data.length === 0) {
                return res.status(400).json({ error: 'No data found in the Excel sheet.' });
            }

            const emails = data.map(candidate => candidate.Email);
            const contactNumbers = data.map(candidate => candidate.ContactNumber);
            const clientCandidate = await candidateModel.find({
                clientId: isClient._id,
                $or: [
                    { Email: { $in: emails } },
                    { ContactNumber: { $in: contactNumbers } }
                ]
            });

            const clientEmail = clientCandidate.map(candidate => candidate.Email);
            const clientContactNumber = clientCandidate.map(candidate => candidate.ContactNumber);
            const newCandidates = data.filter(candidate =>
                !clientEmail.includes(candidate.Email) &&
                !clientContactNumber.includes(candidate.ContactNumber)
            );

            const CandidateData = await Promise.all(newCandidates.map(async candidate => {
                const password = generatePassword(candidate.EnrollmentNumber);
                const hashedPassword = await bcrypt.hash(password, 10);
                let dateOfBirth = candidate.DateOfBirth;
                if (dateOfBirth) {
                    // Check if the date format is "DD-MM-YYYY" and parse it using moment.js
                    dateOfBirth = moment(dateOfBirth, "DD-MM-YYYY").isValid()
                        ? moment(dateOfBirth, "DD-MM-YYYY").toDate()  // Convert to Date object
                        : null;  // If invalid, set to null (or you can handle as per your requirement)
                }


                return {
                    CandidateName: candidate.CandidateName,
                    EnrollmentNumber: candidate.EnrollmentNumber,
                    ContactNumber: candidate.ContactNumber,
                    FatherName: candidate.FatherName,
                    Email: candidate.Email.toLowerCase(),
                    Gender: candidate.Gender,
                    DateOfBirth: dateOfBirth,
                    AadharCard: candidate.AadharCard,
                    sector: candidate.sector,
                    job_Role: candidate.job_Role,
                    Batch: candidate.Batch,

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
                    spocCreatedByName: isSpocPerson.spocPersonName,
                    password: hashedPassword // Add password to candidate data
                };
            }));

            const createdCandidates = await candidateModel.create(CandidateData);

            return res.status(200).json({
                status: true,
                message: 'Bulk upload successful',
                createdCandidates,
                skippedRecords: data.length - newCandidates.length
            });
        }

        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email });
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId });
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

            const data = xlsx.utils.sheet_to_json(sheet);
            if (!data || data.length === 0) {
                return res.status(400).json({ error: 'No data found in the Excel sheet.' });
            }

            const emails = data.map(candidate => candidate.Email);
            const contactNumbers = data.map(candidate => candidate.ContactNumber);
            const clientCandidate = await candidateModel.find({
                clientId: isClient._id,
                $or: [
                    { Email: { $in: emails } },
                    { ContactNumber: { $in: contactNumbers } }
                ]
            });

            const clientEmail = clientCandidate.map(candidate => candidate.Email);
            const clientContactNumber = clientCandidate.map(candidate => candidate.ContactNumber);
            const newCandidates = data.filter(candidate =>
                !clientEmail.includes(candidate.Email) &&
                !clientContactNumber.includes(candidate.ContactNumber)
            );

            const CandidateData = await Promise.all(newCandidates.map(async candidate => {
                const password = generatePassword(candidate.EnrollmentNumber);
                const hashedPassword = await bcrypt.hash(password, 10);

                let dateOfBirth = candidate.DateOfBirth;
                if (dateOfBirth) {
                    // Check if the date format is "DD-MM-YYYY" and parse it using moment.js
                    dateOfBirth = moment(dateOfBirth, "DD-MM-YYYY").isValid()
                        ? moment(dateOfBirth, "DD-MM-YYYY").toDate()  // Convert to Date object
                        : null;  // If invalid, set to null (or you can handle as per your requirement)
                }
                 

           

                return {
                    CandidateName: candidate.CandidateName,
                    EnrollmentNumber: candidate.EnrollmentNumber,
                    ContactNumber: candidate.ContactNumber,
                    FatherName: candidate.FatherName,
                    Email: candidate.Email.toLowerCase(),
                    Gender: candidate.Gender,
                    DateOfBirth: dateOfBirth,
                    AadharCard: candidate.AadharCard,
                    sector: candidate.sector,
                    job_Role: candidate.job_Role,
                    Batch: candidate.Batch,

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
                    childUserCreatedByName: isChildUser.childUserName,
                    password: hashedPassword // Add password field
                };
            }));

            const createdCandidates = await candidateModel.create(CandidateData);

            return res.status(200).json({
                status: true,
                message: 'Bulk upload successful',
                createdCandidates,
                skippedRecords: data.length - newCandidates.length
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = {
    addCandidate,
    candidateList,
    bulkupload

}

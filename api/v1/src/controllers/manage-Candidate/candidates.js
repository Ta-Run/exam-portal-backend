const manageCandidate = require("../../models/manageCandidate")
const candidateModel = require("../../models/Candidatebulk")
const ClientModel = require("../../models/client.model")
const ManageBatchModel = require('../../models/manage-Batch')
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model")
const moment = require("moment-timezone")

const moveCandidate = async (req, res) => {
    try {

        if (req.user.loginType == "Client") {
            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'clientEmail is not found!',
                });
            }
            const candidateIds = req.body.ids;
            if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
                return res.status(400).json({
                    res: false,
                    msg: 'No candidate IDs provided!'
                });
            }

            for (const candidateId of candidateIds) {
                const candidateData = await candidateModel.findById(candidateId);

                if (!candidateData) {
                    continue;
                }
                const profilePicturePath = candidateData.ProfilePicture;

                const newManageCandidate = new manageCandidate({
                    BatchName: candidateData.BatchName,
                    EnrollmentNumber: candidateData.EnrollmentNumber,
                    Gender: candidateData.Gender,
                    CandidateName: candidateData.CandidateName,
                    Email: candidateData.Email,
                    ContactNumber: candidateData.ContactNumber,
                    DateOfBirth: candidateData.DateOfBirth,
                    FatherName: candidateData.FatherName,
                    Address: candidateData.Address,
                    ProfilePicture: profilePicturePath,
                    AadharCard: candidateData.AadharCard,
                    sector: candidateData.sector,
                    assginedSectorsId: candidateData.id,
                    jobRole: candidateData.jobRole,
                    jobRoleId: candidateData.id,

                    Batch: candidateData.Batch,

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

                await newManageCandidate.save();

                await candidateModel.findByIdAndDelete(candidateId);
            }
            return res.json({
                res: true,
                msg: 'Candidate moved successfully!'
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

            const candidateIds = req.body.ids;
            if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
                return res.status(400).json({
                    res: false,
                    msg: 'No candidate IDs provided!'
                });
            }

            for (const candidateId of candidateIds) {
                const candidateData = await candidateModel.findById(candidateId);

                if (!candidateData) {
                    continue;
                }
                const profilePicturePath = candidateData.ProfilePicture;

                const newManageCandidate = new manageCandidate({
                    BatchName: candidateData.BatchName,
                    EnrollmentNumber: candidateData.EnrollmentNumber,
                    Gender: candidateData.Gender,
                    CandidateName: candidateData.CandidateName,
                    Email: candidateData.Email,
                    ContactNumber: candidateData.ContactNumber,
                    DateOfBirth: candidateData.DateOfBirth,
                    FatherName: candidateData.FatherName,
                    Address: candidateData.Address,
                    ProfilePicture: profilePicturePath,
                    AadharCard: candidateData.AadharCard,
                    sector: candidateData.sector,
                    assginedSectorsId: candidateData.id,
                    jobRole: candidateData.jobRole,
                    jobRoleId: candidateData.id,

                    Batch: candidateData.Batch,

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

                await newManageCandidate.save();

                await candidateModel.findByIdAndDelete(candidateId);
            }
            return res.json({
                res: true,
                msg: 'Candidate moved successfully!'
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
            const candidateIds = req.body.ids;
            if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
                return res.status(400).json({
                    res: false,
                    msg: 'No candidate IDs provided!'
                });
            }

            for (const candidateId of candidateIds) {
                const candidateData = await candidateModel.findById(candidateId);

                if (!candidateData) {
                    continue;
                }
                const profilePicturePath = candidateData.ProfilePicture;

                const newManageCandidate = new manageCandidate({
                    BatchName: candidateData.BatchName,
                    EnrollmentNumber: candidateData.EnrollmentNumber,
                    Gender: candidateData.Gender,
                    CandidateName: candidateData.CandidateName,
                    Email: candidateData.Email,
                    ContactNumber: candidateData.ContactNumber,
                    DateOfBirth: candidateData.DateOfBirth,
                    FatherName: candidateData.FatherName,
                    Address: candidateData.Address,
                    ProfilePicture: profilePicturePath,
                    AadharCard: candidateData.AadharCard,
                    sector: candidateData.sector,
                    assginedSectorsId: candidateData.id,
                    jobRole: candidateData.jobRole,
                    jobRoleId: candidateData.id,

                    Batch: candidateData.Batch,
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

                await newManageCandidate.save();

                await candidateModel.findByIdAndDelete(candidateId);
            }
            return res.json({
                res: true,
                msg: 'Candidate moved successfully!'
            });

        }

    } catch (error) {
        console.error('Error in moveCandidate: ', error);
        return res.status(500).json({
            res: false,
            msg: 'Something went wrong!'
        });
    }
}

const deleteCandidate = async (req, res) => {
    try {
        const candidateIds = req.body.ids;

        if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
            return res.status(400).json({
                res: false,
                msg: 'No candidate IDs provided!'
            });
        }

        // Delete candidates by IDs
        await candidateModel.deleteMany({ _id: { $in: candidateIds } });

        return res.json({
            res: true,
            msg: 'Candidates deleted successfully!'
        }); 

    } catch (error) {
        console.error('Error in deleteCandidates: ', error);
        return res.status(500).json({
            res: false,
            msg: 'Something went wrong!'
        });
    }
}

const manageCandidateList = async (req, res) => {
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

            // let query = { createdById: isClient._id };
            // let query = { }

            if (req.query.sector) {
                query = { ...query, sector: req.query.sector }
            }
            if (req.query.job_Role) {
                query = { ...query, job_Role: req.query.job_Role }
            }
            if (req.query.Batch) {
                query = { ...query, Batch: req.query.Batch }
            }

            const CandidateData = await manageCandidate.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved manageCandidate list",
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
            let query = {
                createdById: isClient._id,
                spocCreatedById: isSpocPerson._id
            };



            if (req.query.sector) {
                query = { ...query, sector: req.query.sector }
            }
            if (req.query.job_Role) {
                query = { ...query, job_Role: req.query.job_Role }
            }
            if (req.query.Batch) {
                query = { ...query, Batch: req.query.Batch }
            }

            const CandidateData = await manageCandidate.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved manageCandidate list",
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
            let query = {
                createdById: isClient._id,
                childUserCreatedById: isChildUser._id,
               
            };

            if (req.query.sector) {
                query = { ...query, sector: req.query.sector }
            }
            if (req.query.job_Role) {
                query = { ...query, job_Role: req.query.job_Role }
            }
            if (req.query.Batch) {
                query = { ...query, Batch: req.query.Batch }
            }

            const CandidateData = await manageCandidate.paginate(query, options);

            return res.json({
                res: true,
                msg: "Successfully retrieved manageCandidate list",
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
        console.error('error in getManageCandidate list ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}

const Edit = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }
            const candidates = await manageCandidate.findOne({ _id: req.params.id })

            if (!candidates) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }

            const updateData = {
                BatchName: req.body.BatchName || candidates.BatchName,
                EnrollmentNumber: req.body.EnrollmentNumber || candidates.EnrollmentNumber,
                Gender: req.body.Gender || candidates.Gender,
                candidatesName: req.body.candidatesName || candidates.candidatesName,
                Email: req.body.Email.toLowerCase() || candidates.Email,
                ContactNumber: req.body.ContactNumber || candidates.ContactNumber,
                DateOfBirth: req.body.DateOfBirth || candidates.DateOfBirth,
                FatherName: req.body.FatherName || candidates.FatherName,
                Address: req.body.Address || candidates.Address,
                AadharCard: req.body.AadharCard || candidates.AadharCard,
                sector: req.body.sector || candidates.sector,
                jobRole: req.body.jobRole || candidates.jobRole,
                Batch: req.body.Batch || candidates.Batch,
                jobRoleId: candidates.jobRoleId,
                assignedSectorsId: candidates.assignedSectorsId,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isClient.clientName,
                lastUpdatedById: isClient._id,
                status: "Active"
            };
            if (req.file) {
                updateData.ProfilePicture = `/upload/${req.file.filename}`;
            }
            await manageCandidate.updateOne({ _id: candidates._id }, { $set: updateData });

            const updatedCandidate = await manageCandidate.findOne({ _id: candidates._id });

            return res.json({
                res: true,
                msg: 'Candidate updated successfully.',
                profilePicture: updatedCandidate.ProfilePicture || ''
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

            const candidates = await manageCandidate.findOne({ _id: req.params.id })

            if (!candidates) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }

            const updateData = {
                BatchName: req.body.BatchName || candidates.BatchName,
                EnrollmentNumber: req.body.EnrollmentNumber || candidates.EnrollmentNumber,
                Gender: req.body.Gender || candidates.Gender,
                candidatesName: req.body.candidatesName || candidates.candidatesName,
                Email: req.body.Email.toLowerCase() || candidates.Email,
                ContactNumber: req.body.ContactNumber || candidates.ContactNumber,
                DateOfBirth: req.body.DateOfBirth || candidates.DateOfBirth,
                FatherName: req.body.FatherName || candidates.FatherName,
                Address: req.body.Address || candidates.Address,
                AadharCard: req.body.AadharCard || candidates.AadharCard,
                sector: req.body.sector || candidates.sector,
                jobRole: req.body.jobRole || candidates.jobRole,
                Batch: req.body.Batch || candidates.Batch,
                jobRoleId: candidates.jobRoleId,
                assignedSectorsId: candidates.assignedSectorsId,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isSpocPerson.spocPersonName,
                lastUpdatedById: isSpocPerson._id,
                status: "Active"
            };
            if (req.file) {
                updateData.ProfilePicture = `/upload/${req.file.filename}`;
            }
            await manageCandidate.updateOne({ _id: candidates._id }, { $set: updateData });

            const updatedCandidate = await manageCandidate.findOne({ _id: candidates._id });

            return res.json({
                res: true,
                msg: 'Candidate updated successfully.',
                profilePicture: updatedCandidate.ProfilePicture || ''
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
            const candidates = await manageCandidate.findOne({ _id: req.params.id })

            if (!candidates) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }

            const updateData = {
                BatchName: req.body.BatchName || candidates.BatchName,
                EnrollmentNumber: req.body.EnrollmentNumber || candidates.EnrollmentNumber,
                Gender: req.body.Gender || candidates.Gender,
                candidatesName: req.body.candidatesName || candidates.candidatesName,
                Email: req.body.Email.toLowerCase() || candidates.Email,
                ContactNumber: req.body.ContactNumber || candidates.ContactNumber,
                DateOfBirth: req.body.DateOfBirth || candidates.DateOfBirth,
                FatherName: req.body.FatherName || candidates.FatherName,
                Address: req.body.Address || candidates.Address,
                AadharCard: req.body.AadharCard || candidates.AadharCard,
                sector: req.body.sector || candidates.sector,
                jobRole: req.body.jobRole || candidates.jobRole,
                Batch: req.body.Batch || candidates.Batch,
                jobRoleId: candidates.jobRoleId,
                assignedSectorsId: candidates.assignedSectorsId,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isChildUser.emailId,
                lastUpdatedById: isChildUser._id,
                status: "Active"
            };
            if (req.file) {
                updateData.ProfilePicture = `/upload/${req.file.filename}`;
            }
            await manageCandidate.updateOne({ _id: candidates._id }, { $set: updateData });

            const updatedCandidate = await manageCandidate.findOne({ _id: candidates._id });

            return res.json({
                res: true,
                msg: 'Candidate updated successfully.',
                profilePicture: updatedCandidate.ProfilePicture || ''
            });

        }


    } catch (error) {
        console.error('error in edit ManageCandidate  ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }

}
const deletebyId = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client not found',
                });
            }
            const candidateData = await manageCandidate.findOne({ _id: req.params.id })
            if (!candidateData) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }
            await manageCandidate.deleteOne({ _id: candidateData._id })
            return res.json({
                res: true,
                msg: 'Successfully candidate remove.',
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

            const candidateData = await manageCandidate.findOne({ _id: req.params.id })
            if (!candidateData) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }
            await manageCandidate.deleteOne({ _id: candidateData._id })
            return res.json({
                res: true,
                msg: 'Successfully candidate remove.',
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
            const candidateData = await manageCandidate.findOne({ _id: req.params.id })
            if (!candidateData) {
                return res.json({
                    res: false,
                    msg: 'candidate is not found!',
                });
            }
            await manageCandidate.deleteOne({ _id: candidateData._id })
            return res.json({
                res: true,
                msg: 'Successfully candidate remove.',
            });

        }
    } catch (error) {
        console.error("Error in Delete candidate:", error);
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while delete the candidate ',
        });
    }
}


module.exports = {
    moveCandidate,
    deleteCandidate,
    manageCandidateList,
    Edit,
    deletebyId

}
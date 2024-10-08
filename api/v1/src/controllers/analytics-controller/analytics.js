
const SectorModel = require("../../models/sector.model")
const ClientModel = require("../../models/client.model")
const AdminModel = require("../../models/admin.model");
const QuestionBankModel = require("../../models/question-bank.model")
const JobRoleModel = require('../../models/job-role.model')
const SpocPersonModel = require('../../models/spoc-person.model')
const ChildUserModel = require("../../models/child.user.model")
const manageCandidateModel = require("../../models/manageCandidate")
const manageAssessorModel = require("../../models/manage.assessor")
const manageBatchModel = require("../../models/manage-Batch");
const jobRoleModel = require("../../models/job-role.model");
const questionModel = require("../../models/question.model");
const AssessorModel = require("../../models/manage.assessor")
const mongoose = require('mongoose')

const moment = require('moment-timezone');


const getQuestionAnalyticsRecord = async (req, res) => {
    try {
        const questionBankId = req.params.id;  // The question bank ID from the request params
        const { startDate, endDate } = req.query;  // The start and end date from the request query parameter
        const matchConditions = {};
        // Filter by questionBankId
        if (questionBankId) {
            matchConditions.questionBankId = new mongoose.Types.ObjectId(questionBankId);
        }

        // Filter by start and end date (on the createdAt field)
        if (startDate || endDate) {
            matchConditions.createdAt = {};  // Match on createdAt field, timestamps are enabled in the schema
            if (startDate) {
                matchConditions.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                matchConditions.createdAt.$lte = new Date(endDate);
            }
        }

        // Query to fetch data
        const questionData = await questionModel.aggregate([
            { $match: matchConditions },
            {
                $project: {
                    _id: 1,
                    questionBankName: 1,
                    nosName: 1,
                    difficultyLevel: 1,
                    questionMarks: 1,
                    questionType: 1,
                    question: 1,
                    optionA: 1,
                    optionB: 1,
                    optionC: 1,
                    optionD: 1,
                    clientName: 1,
                    createdAt: 1,  // The timestamp field
                    lastUpdatedAt: 1,  // Last updated field
                },
            },
        ]);

        // Send the result as a JSON response
        res.status(200).json({
            success: true,
            result: questionData,
        });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAnalyticsBySector = async (req, res) => {
    try {
        const sectorId = req.params.id;
        const { from, to } = req.query;

        // Use moment to handle the date conversion
        const fromDate = moment(from).startOf('day'); // Set the start of the day
        const toDate = moment(to).endOf('day'); // Set the end of the day

        // Correct instantiation of ObjectId using 'new'
        const sectorObjectId = new mongoose.Types.ObjectId(sectorId);

        // Filter by StartDate using moment.js date formatting
        const totalBatches = await manageBatchModel.countDocuments({
            assginedSectorsId: sectorObjectId,
            StartDate: {
                $gte: fromDate.toISOString(),
                $lte: toDate.toISOString()
            }
        });

        const totalCandidates = await manageCandidateModel.countDocuments({
            assginedSectorsId: sectorObjectId, // Use sectorObjectId consistently
            createAt: { $gte: fromDate.toISOString(), $lte: toDate.toISOString() }
        });

        const totalStates = await manageBatchModel.find({ assginedSectorsId: sectorObjectId }, "state");
        const totalDistricts = await manageBatchModel.find({ assginedSectorsId: sectorObjectId }, "district");

        const statesCount = totalStates.length;

        const districtCount = totalDistricts.length;
        // Aggregation for batch status by state
        const stateBatchStatus = await manageBatchModel.aggregate([
            {
                $match: {
                    StartDate: {
                        $gte: fromDate.toISOString(),
                        $lte: toDate.toISOString()
                    }
                }
            },
            {
                $group: {
                    _id: "$state",
                    stateCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    stateCount: 1
                }
            }
        ]);

        // Aggregation for job role status
        const jobRoleStatus = await jobRoleModel.aggregate([
            {
                $match: {
                    createAt: {
                        $gte: fromDate.toISOString(),
                        $lte: toDate.toISOString()
                    }
                }
            },
            {
                $group: {
                    _id: "$jobRoleName",
                    jobRoleCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    jobRole: "$_id",
                    jobRoleCount: 1
                }
            }
        ]);

        // Final Response
        res.status(200).json({
            totalBatches,
            totalCandidates,
            totalStates:statesCount,
            totalDistricts:districtCount,
            stateBatchStatus,
            jobRoleStatus,
        });

    } catch (error) {
        console.error("Error in getAnalyticsBySector:", error); // Add logging for better error tracking
        res.status(500).json({ message: 'Server Error', error });
    }
};


const getquesitonBankDropDown = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })

            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            console.log('isClient ', isClient)
            const questionBankData = await QuestionBankModel.find({}, "_id questionBankName");

            return res.json({
                req: true,
                msg: "success",
                data: questionBankData
            })
        }

        if (req.user.loginType == "Admin") {
            const sectorData = await QuestionBankModel.find({ status: "Active" }, "_id name");
            return res.json({
                req: true,
                msg: "success",
                data: sectorData
            })
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const sectorData = await QuestionBankModel.find({ _id: { $in: isSpocPerson.assginedSectorsIds }, status: "Active" }, "_id name");
            return res.json({
                req: true,
                msg: "success",
                data: sectorData
            })
        }

        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const sectorData = await QuestionBankModel.find({ _id: isChildUser.selectSectorPermissionId, status: "Active" }, "_id name");
            return res.json({
                req: true,
                msg: "success",
                data: sectorData
            })
        }

        return res.json({
            res: false,
            msg: 'Somthing went to wrong.',
        });

    } catch (error) {
        return res.json({
            res: false,
            msg: 'Somthing went to wrong.',
        });
    }
}

//assessors

const getAssessorsDropDown = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {
            const sectorId = req.params.id;

            // Convert sectorId to ObjectId if needed
            const sectorObjectId = new mongoose.Types.ObjectId(sectorId);

            // Find assessors where the sectorId exists in the array
            const questionBankData = await AssessorModel.find({
                assginedSectorsIds: sectorObjectId
            }, "_id firstName");

            return res.json({
                req: true,
                msg: "success",
                data: questionBankData
            });
        }

        if (req.user.loginType == "Admin") {
            const sectorData = await QuestionBankModel.find({ status: "Active" }, "_id name");
            return res.json({
                req: true,
                msg: "success",
                data: sectorData
            })
        }

        if (req.user.loginType == "spoc-person") {
            const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
            if (!isSpocPerson) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const sectorData = await QuestionBankModel.find({ _id: { $in: isSpocPerson.assginedSectorsIds }, status: "Active" }, "_id name");
            return res.json({
                req: true,
                msg: "success",
                data: sectorData
            })
        }

        if (req.user.loginType == "Child-User") {
            const isChildUser = await ChildUserModel.findOne({ emailId: req.user.email })
            if (!isChildUser) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const sectorData = await QuestionBankModel.find({ _id: isChildUser.selectSectorPermissionId, status: "Active" }, "_id name");
            return res.json({
                req: true,
                msg: "success",
                data: sectorData
            })
        }

        return res.json({
            res: false,
            msg: 'Somthing went to wrong.',
        });
    } catch (error) {
        console.error('Error:', error);
        return res.json({
            res: false,
            msg: 'Something went wrong.',
        });
    }
};

module.exports = {
    getQuestionAnalyticsRecord,
    getAnalyticsBySector,
    getquesitonBankDropDown,
    getAssessorsDropDown
}



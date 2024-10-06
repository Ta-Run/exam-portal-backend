
const ClientModel = require("../../models/client.model")

const QuestionBankModel = require("../../models/question-bank.model")

const SpocPersonModel = require('../../models/spoc-person.model')
const ChildUserModel = require("../../models/child.user.model")
const manageBatchModel = require("../../models/manage-Batch");
const manageAssessorModel = require("../../models/manage.assessor")
const sectoeModel = require("../../models/sector.model")


const getMisReportsData = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })

            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client Not Found',
                });
            }

            // console.log('isClient ', isClient)

            const reportsData = await sectoeModel.aggregate([
                
                {
                    $lookup: {
                        from: "manage-batches",
                        localField: "_id",
                        foreignField: "assginedSectorsId",
                        as: "manageBatch"
                    }
                },
                {
                    $unwind: "$manageBatch"  // Flatten the manageBatch array
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        logo: 1,
                        type: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        // Flatten fields from the manageBatch
                        state: "$manageBatch.state",
                        district: "$manageBatch.district",
                        TrainingPartnerName: "$manageBatch.TrainingPartnerName",
                        TrainingCenterName: "$manageBatch.TrainingCenterName",
                        StartDate: "$manageBatch.StartDate",
                        EndDate: "$manageBatch.EndDate",
                        BatchCode: "$manageBatch.BatchCode",
                        TotalCandidate: "$manageBatch.TotalCandidate",
                        clientName: "$manageBatch.clientName",
                        batchStatus: "$manageBatch.status"
                    }
                },
                {
                    $lookup: {
                        from: "questionBanks",
                        localField: "_id",
                        foreignField: "assginedSectorsId",
                        as: "questionBanks"
                    }
                },


            ])

            return res.json({
                req: true,
                msg: "success",
                data: reportsData
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


module.exports = {
    getMisReportsData
}

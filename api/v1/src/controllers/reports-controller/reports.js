
const ClientModel = require("../../models/client.model")
const sectoeModel = require("../../models/sector.model");
const moment = require('moment');


const getMisReportsData = async (req, res) => {
    try {
        if (req.user.loginType == "Client") {
            const { startDate, endDate } = req.query;
            const fromDate = moment(startDate).format('YYYY-MM-DD'); 
             const toDate = moment(endDate).format('YYYY-MM-DD');

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email });

            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Client Not Found',
                });
            }

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
                $match: {
                // //         // Ensure that you are using the correct variable names
                           "manageBatch.StartDate": {$gte:fromDate},
                           "manageBatch.EndDate": {$lte:toDate} 
                     }
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
                 
            ]);

            console.log(reportsData,'kkk')
            return res.json({
                req: true,
                msg: "success",
                data: reportsData
            });
        }
    } catch (error) {
        console.error("Error fetching MIS reports:", error);
        return res.json({
            res: false,
            msg: 'Something went wrong.',
        });
    }
}



module.exports = {
    getMisReportsData
}

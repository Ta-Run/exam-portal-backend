const assModel = require('../../models/manage.assessor')
const AdminModel = require("../../models/admin.model")
const ClientModel = require("../../models/client.model")
const SectorModel = require("../../models/sector.model")
const SpocPersonModel = require("../../models/spoc-person.model")
const ChildUserModel = require("../../models/child.user.model")

const moment = require('moment-timezone');


const asscreate = async (req, res) => {
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
            const { assginedSectorsIds, state, district, mobileNo, gender, accessorCode, profile_picture, adharcard, pancardNo, pancard_img, adhar_img, adhar_img2 } = req.body
            const email = req.body.email.toLowerCase()

            if (state == "" || district == "" || mobileNo == "" || gender == "" || email == "" || accessorCode == "" || profile_picture == "" || adharcard == "" || pancardNo == "" || pancard_img == "" || adhar_img == "") {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }
            const isSector = await SectorModel.findOne({ _id: assginedSectorsIds });
            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }
            // const accessorCode = await ass

            if (req.file) {
                return res.status(400).json({ error: 'File is missing' })
            }
            const isAssessor = await ClientModel.findOne({ clientEmail: req.body.clientEmail, clientId: isClient._id })
            if (isAssessor) {
                return res.json({
                    res: false,
                    msg: 'clientEmail already used',
                });
            }
            await assModel.create({
                state: req.body.state,
                district: req.body.district,
                language: req.body.language,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                fatherName: req.body.fatherName,
                motherName: req.body.motherName,
                dateOfBirth: req.body.dateOfBirth,
                mobileNo: req.body.mobileNo,
                gender: req.body.gender,
                email: req.body.email.toLowerCase(),
                accessorCode: req.body.accessorCode,
                permanent_Address: req.body.permanent_Address,
                pinCode: req.body.pinCode,
                current_Address: req.body.current_Address,
                pincode: req.body.pincode,

                profile_picture: `/upload/${req.files.profile_picture[0].filename}`,
                adharcard: req.body.adharcard,
                adhar_img: `/upload/${req.files.adhar_img[0].filename}`,
                adhar_img2: req.files.adhar_img2 ? `/upload/${req.files.adhar_img2[0].filename}` : "",
                pancardNo: req.body.pancardNo,
                pancard_img: `/upload/${req.files.pancard_img[0].filename}`,
                // sector: req.body.sector,
                assginedSectorsIds: isSector.id,

                select_jobRole: req.body.select_jobRole,
                CertificateExpiryDate: req.body.CertificateExpiryDate,

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
                msg: 'Successfully assessor Create.',
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

            const { assginedSectorsIds, state, district, mobileNo, gender, accessorCode, profile_picture, adharcard, pancardNo, pancard_img, adhar_img, adhar_img2 } = req.body
            const email = req.body.email.toLowerCase()

            if (state == "" || district == "" || mobileNo == "" || gender == "" || email == "" || accessorCode == "" || profile_picture == "" || adharcard == "" || pancardNo == "" || pancard_img == "" || adhar_img == "" ) {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }
            const isSector = await SectorModel.findOne({ _id: assginedSectorsIds });
            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }

            if (req.file) {
                return res.status(400).json({ error: 'File is missing' })
            }
            const isAssessor = await ClientModel.findOne({ clientEmail: req.body.clientEmail, spocPersonId: isSpocPerson._id })
            if (isAssessor) {
                return res.json({
                    res: false,
                    msg: 'clientEmail already used',
                });
            }
            await assModel.create({
                state: req.body.state,
                district: req.body.district,
                language: req.body.language,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                fatherName: req.body.fatherName,
                motherName: req.body.motherName,
                dateOfBirth: req.body.dateOfBirth,
                mobileNo: req.body.mobileNo,
                gender: req.body.gender,
                email: req.body.email.toLowerCase(),
                accessorCode: req.body.accessorCode,
                permanent_Address: req.body.permanent_Address,
                pinCode: req.body.pinCode,
                current_Address: req.body.current_Address,
                pincode: req.body.pincode,

                profile_picture: `/upload/${req.files.profile_picture[0].filename}`,
                adharcard: req.body.adharcard,
                adhar_img: `/upload/${req.files.adhar_img[0].filename}`,
                adhar_img2: req.files.adhar_img2 ? `/upload/${req.files.adhar_img2[0].filename}` : "",
                pancardNo: req.body.pancardNo,
                pancard_img: `/upload/${req.files.pancard_img[0].filename}`,
                // sector: req.body.sector,
                assginedSectorsIds: isSector.id,

                select_jobRole: req.body.select_jobRole,
                CertificateExpiryDate: req.body.CertificateExpiryDate,

                clientId: isClient._id,
                clientName: isClient.clientName,
                createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                createdById: isClient._id,
                createdByName: isClient.clientName,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isSpocPerson.spocPersonName,
                lastUpdatedById: isSpocPerson._id,
                status: "Active",
                spocPersonId: isSpocPerson._id,
                spocPersonName: isSpocPerson.spocPersonName
            })
            return res.json({
                res: true,
                msg: 'Successfully assessor Create.',
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
            const { assginedSectorsIds, state, district, mobileNo, gender, accessorCode, profile_picture, adharcard, pancardNo, pancard_img, adhar_img, adhar_img2 } = req.body
            const email = req.body.email.toLowerCase()

            if (state == "" || district == "" || mobileNo == "" || gender == "" || email == "" || accessorCode == "" || profile_picture == "" || adharcard == "" || pancardNo == "" || pancard_img == "" || adhar_img == "" ) {
                return res.json({
                    res: false,
                    msg: 'All fields required.',
                });
            }
            const isSector = await SectorModel.findOne({ _id: assginedSectorsIds });
            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }

            if (req.file) {
                return res.status(400).json({ error: 'File is missing' })
            }
            const isAssessor = await ClientModel.findOne({ clientEmail: req.body.clientEmail, childUserCreatedById: isChildUser._id })
            if (isAssessor) {
                return res.json({
                    res: false,
                    msg: 'clientEmail already used',
                });
            }
            await assModel.create({
                state: req.body.state,
                district: req.body.district,
                language: req.body.language,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                fatherName: req.body.fatherName,
                motherName: req.body.motherName,
                dateOfBirth: req.body.dateOfBirth,
                mobileNo: req.body.mobileNo,
                gender: req.body.gender,
                email: req.body.email.toLowerCase(),
                accessorCode: req.body.accessorCode,
                permanent_Address: req.body.permanent_Address,
                pinCode: req.body.pinCode,
                current_Address: req.body.current_Address,
                pincode: req.body.pincode,

                profile_picture: `/upload/${req.files.profile_picture[0].filename}`,
                adharcard: req.body.adharcard,
                adhar_img: `/upload/${req.files.adhar_img[0].filename}`,
                adhar_img2: req.files.adhar_img2 ? `/upload/${req.files.adhar_img2[0].filename}` : "",
                pancardNo: req.body.pancardNo,
                pancard_img: `/upload/${req.files.pancard_img[0].filename}`,
                // sector: req.body.sector,
                assginedSectorsIds: isSector.id,

                select_jobRole: req.body.select_jobRole,
                CertificateExpiryDate: req.body.CertificateExpiryDate,

                clientId: isClient._id,
                clientName: isClient.clientName,
                createAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                createdById: isClient._id,
                createdByName: isClient.clientName,
                lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                lastUpdatedByName: isChildUser.emailId,
                lastUpdatedById: isChildUser._id,
                childUserCreatedById: isChildUser._id,
                childUserCreatedByName: isChildUser.emailId,
                status: "Active",
            })
            return res.json({
                res: true,
                msg: 'Successfully assessor Create.',
            });

        }
    } catch (error) {
        console.error('error in create assessor ', error)
        return res.json({
            res: false,
            msg: 'Something Went To Wrong!'
        });
    }
}

const assGetAll = async (req, res) => {
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

            if (req.query.sector) {
                query = { ...query, sector: req.query.sector }
            }
            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            const assessorData = await assModel.paginate(query, options);
            return res.json({
                res: true,
                msg: "Successfully retrieved assessors list",
                data: assessorData.docs,
                paginate: {
                    totalDocs: assessorData.totalDocs,
                    limit: assessorData.limit,
                    totalPages: assessorData.totalPages,
                    page: assessorData.page,
                    pagingCounter: assessorData.pagingCounter,
                    hasPrevPage: assessorData.hasPrevPage,
                    hasNextPage: assessorData.hasNextPage,
                    prevPage: assessorData.prevPage,
                    nextPage: assessorData.nextPage
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
            let query = { createdById: isClient._id, spocPersonId: isSpocPerson._id };

            if (req.query.sector) {
                query = { ...query, sector: req.query.sector }
            }
            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            const assessorData = await assModel.paginate(query, options);
            return res.json({
                res: true,
                msg: "Successfully retrieved assessors list",
                data: assessorData.docs,
                paginate: {
                    totalDocs: assessorData.totalDocs,
                    limit: assessorData.limit,
                    totalPages: assessorData.totalPages,
                    page: assessorData.page,
                    pagingCounter: assessorData.pagingCounter,
                    hasPrevPage: assessorData.hasPrevPage,
                    hasNextPage: assessorData.hasNextPage,
                    prevPage: assessorData.prevPage,
                    nextPage: assessorData.nextPage
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

            if (req.query.sector) {
                query = { ...query, sector: req.query.sector }
            }
            if (req.query.state) {
                query = { ...query, state: req.query.state }
            }
            const assessorData = await assModel.paginate(query, options);
            return res.json({
                res: true,
                msg: "Successfully retrieved assessors list",
                data: assessorData.docs,
                paginate: {
                    totalDocs: assessorData.totalDocs,
                    limit: assessorData.limit,
                    totalPages: assessorData.totalPages,
                    page: assessorData.page,
                    pagingCounter: assessorData.pagingCounter,
                    hasPrevPage: assessorData.hasPrevPage,
                    hasNextPage: assessorData.hasNextPage,
                    prevPage: assessorData.prevPage,
                    nextPage: assessorData.nextPage
                }
            })

        }
    } catch (error) {
        console.error("Error in retrieving assessor list", error);
        return res.json({
            res: false,
            msg: 'Something went wrong!'
        });
    }
}

const assEdit = async (req, res) => {
    try {

        if (req.user.loginType == "Client" && req.user.loginType == "Admin") {
            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
            const isAdmin = await AdminModel.findOne({ adminEmail: req.user.email })

            if (!isClient && !isAdmin) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsIds });
            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }


            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }
            const assUpdateResult = await assModel.updateOne({ _id: isAssessor._id }, {
                $set: {
                    state: req.body.state || isAssessor.state,
                    district: req.body.district || isAssessor.district,
                    firstName: req.body.firstName || isAssessor.firstName,
                    lastName: req.body.lastName || isAssessor.lastName,
                    fatherName: req.body.fatherName || isAssessor.fatherName,
                    motherName: req.body.motherName || isAssessor.motherName,
                    dateOfBirth: req.body.dateOfBirth || isAssessor.dateOfBirth,
                    mobileNo: req.body.mobileNo || isAssessor.mobileNo,
                    gender: req.body.gender || isAssessor.gender,
                    email: isAssessor.email.toLowerCase(),

                    accessorCode: req.body.accessorCode || isAssessor.accessorCode,
                    permanent_Address: req.body.permanent_Address || isAssessor.permanent_Address,
                    pinCode: req.body.pinCode || isAssessor.pinCode,
                    current_Address: req.body.current_Address || isAssessor.current_Address,
                    pincode: req.body.pincode || isAssessor.pincode,
                    adharcard: req.body.adharcard || isAssessor.adharcard,
                    pancardNo: req.body.pancardNo || isAssessor.pancardNo,
                    sector: req.body.sector || isAssessor.sector,
                    assginedSectorsIds: isSector.assginedSectorsIds,
                    select_jobRole: req.body.select_jobRole || isAssessor.select_jobRole,
                    CertificateExpiryDate: req.body.CertificateExpiryDate || isAssessor.CertificateExpiryDate,


                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isClient && isAdmin ? isAdmin.userName : null,
                    lastUpdatedById: isClient && isAdmin ? isAdmin.id : null
                }
            })

            if (req.file) {
                await assModel.updateOne({ _id: isAssessor._id }, {
                    $set: {
                        profile_picture: `/upload/${req.files.profile_picture[0].filename}`,
                        adhar_img: `/upload/${req.files.adhar_img[0].filename}`,
                        adhar_img2: `/upload/${req.files.adhar_img2[0].filename}`,
                        pancard_img: `/upload/${req.files.pancard_img[0].filename}`,
                        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                        lastUpdatedByName: isClient && isAdmin ? isAdmin.userName : null,
                        lastUpdatedById: isClient && isAdmin ? isAdmin.id : null

                    }
                })
            }
            return res.json({
                res: true,
                msg: ' Assessor updated Successfully.',
                // data: assUpdateResult
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
            const isClient = await ClientModel.findOne({ _id: isSpocPerson.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }

            const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsIds });
            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }


            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }
            const assUpdateResult = await assModel.updateOne({ _id: isAssessor._id }, {
                $set: {
                    state: req.body.state || isAssessor.state,
                    district: req.body.district || isAssessor.district,
                    firstName: req.body.firstName || isAssessor.firstName,
                    lastName: req.body.lastName || isAssessor.lastName,
                    fatherName: req.body.fatherName || isAssessor.fatherName,
                    motherName: req.body.motherName || isAssessor.motherName,
                    dateOfBirth: req.body.dateOfBirth || isAssessor.dateOfBirth,
                    mobileNo: req.body.mobileNo || isAssessor.mobileNo,
                    gender: req.body.gender || isAssessor.gender,
                    email: isAssessor.email.toLowerCase(),

                    accessorCode: req.body.accessorCode || isAssessor.accessorCode,
                    permanent_Address: req.body.permanent_Address || isAssessor.permanent_Address,
                    pinCode: req.body.pinCode || isAssessor.pinCode,
                    current_Address: req.body.current_Address || isAssessor.current_Address,
                    pincode: req.body.pincode || isAssessor.pincode,
                    adharcard: req.body.adharcard || isAssessor.adharcard,
                    pancardNo: req.body.pancardNo || isAssessor.pancardNo,
                    sector: req.body.sector || isAssessor.sector,
                    assginedSectorsIds: isSector.assginedSectorsIds,
                    select_jobRole: req.body.select_jobRole || isAssessor.select_jobRole,
                    CertificateExpiryDate: req.body.CertificateExpiryDate || isAssessor.CertificateExpiryDate,


                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isSpocPerson.spocPersonName,
                    lastUpdatedById: isSpocPerson._id
                }
            })

            if (req.file) {
                await assModel.updateOne({ _id: isAssessor._id }, {
                    $set: {
                        profile_picture: `/upload/${req.files.profile_picture[0].filename}`,
                        adhar_img: `/upload/${req.files.adhar_img[0].filename}`,
                        adhar_img2: `/upload/${req.files.adhar_img2[0].filename}`,
                        pancard_img: `/upload/${req.files.pancard_img[0].filename}`,
                        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                        lastUpdatedByName: isSpocPerson.spocPersonName,
                        lastUpdatedById: isSpocPerson._id

                    }
                })
            }
            return res.json({
                res: true,
                msg: ' Assessor updated Successfully.',
                // data: assUpdateResult
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
            const isClient = await ClientModel.findOne({ _id: isChildUser.clientId })
            if (!isClient) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isSector = await SectorModel.findOne({ _id: req.body.assginedSectorsIds });
            if (!isSector) {
                return res.json({
                    res: false,
                    msg: 'Sector is not found!',
                });
            }


            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }
            const assUpdateResult = await assModel.updateOne({ _id: isAssessor._id }, {
                $set: {
                    state: req.body.state || isAssessor.state,
                    district: req.body.district || isAssessor.district,
                    firstName: req.body.firstName || isAssessor.firstName,
                    lastName: req.body.lastName || isAssessor.lastName,
                    fatherName: req.body.fatherName || isAssessor.fatherName,
                    motherName: req.body.motherName || isAssessor.motherName,
                    dateOfBirth: req.body.dateOfBirth || isAssessor.dateOfBirth,
                    mobileNo: req.body.mobileNo || isAssessor.mobileNo,
                    gender: req.body.gender || isAssessor.gender,
                    email: isAssessor.email.toLowerCase(),

                    accessorCode: req.body.accessorCode || isAssessor.accessorCode,
                    permanent_Address: req.body.permanent_Address || isAssessor.permanent_Address,
                    pinCode: req.body.pinCode || isAssessor.pinCode,
                    current_Address: req.body.current_Address || isAssessor.current_Address,
                    pincode: req.body.pincode || isAssessor.pincode,
                    adharcard: req.body.adharcard || isAssessor.adharcard,
                    pancardNo: req.body.pancardNo || isAssessor.pancardNo,
                    sector: req.body.sector || isAssessor.sector,
                    assginedSectorsIds: isSector.assginedSectorsIds,
                    select_jobRole: req.body.select_jobRole || isAssessor.select_jobRole,
                    CertificateExpiryDate: req.body.CertificateExpiryDate || isAssessor.CertificateExpiryDate,
                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isChildUser.emailId,
                    lastUpdatedById: isChildUser._id
                }
            })

            if (req.file) {
                await assModel.updateOne({ _id: isAssessor._id }, {
                    $set: {
                        profile_picture: `/upload/${req.files.profile_picture[0].filename}`,
                        adhar_img: `/upload/${req.files.adhar_img[0].filename}`,
                        adhar_img2: `/upload/${req.files.adhar_img2[0].filename}`,
                        pancard_img: `/upload/${req.files.pancard_img[0].filename}`,
                        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                        childUserCreatedById: isChildUser._id,
                        childUserCreatedByName: isChildUser.childUserName
                    }
                })
            }
            return res.json({
                res: true,
                msg: ' Assessor updated Successfully.',
                // data: assUpdateResult
            })
        }


    } catch (error) {
        console.error("Error updating assessor:", error);
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while updating the assessor.',
        });
    }
}

const statusUpdate = async (req, res) => {
    try {
        if (req.user.loginType == "Client" || req.user.loginType == "Admin") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
            const isAdmin = await AdminModel.findOne({ adminEmail: req.user.email })

            if (!isClient && !isAdmin) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }

            if (isAssessor.status == "Active") {
                await assModel.updateOne({ _id: isAssessor._id }, {
                    $set: {
                        status: "Inactive",
                        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                        lastUpdatedByName: isClient && isAdmin ? isAdmin.userName : null,
                        lastUpdatedById: isClient && isAdmin ? isAdmin.id : null
                    }
                })

                return res.json({
                    res: true,
                    status: "Inactive",
                    msg: 'Successfully Assessor is Inactive',
                });
            }

            await assModel.updateOne({ _id: isAssessor._id }, {
                $set: {
                    status: "Active",
                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isClient && isAdmin ? isAdmin.userName : null,
                    lastUpdatedById: isClient && isAdmin ? isAdmin.id : null
                }
            })
            return res.json({
                res: true,
                status: "Active",
                msg: 'Successfully Assessor is Active',
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

            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }

            if (isAssessor.status == "Active") {
                await assModel.updateOne({ _id: isAssessor._id }, {
                    $set: {
                        status: "Inactive",
                        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                        lastUpdatedByName: isSpocPerson.spocPersonName,
                        lastUpdatedById: isSpocPerson._id
                    }
                })
                return res.json({
                    res: true,
                    status: "Inactive",
                    msg: 'Successfully Assessor is Inactive',
                });
            }
            await assModel.updateOne({ _id: isAssessor._id }, {
                $set: {
                    status: "Active",
                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isSpocPerson.spocPersonName,
                    lastUpdatedById: isSpocPerson._id
                }
            })
            return res.json({
                res: true,
                status: "Active",
                msg: 'Successfully Assessor is Active',
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
            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }

            if (isAssessor.status == "Active") {
                await assModel.updateOne({ _id: isAssessor._id }, {
                    $set: {
                        status: "Inactive",
                        lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                        lastUpdatedByName: isChildUser.emailId,
                        lastUpdatedById: isChildUser._id
                    }
                })
                return res.json({
                    res: true,
                    status: "Inactive",
                    msg: 'Successfully Assessor is Inactive',
                });
            }
            await assModel.updateOne({ _id: isAssessor._id }, {
                $set: {
                    status: "Active",
                    lastUpdatedAt: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                    lastUpdatedByName: isChildUser.emailId,
                    lastUpdatedById: isChildUser._id
                }
            })
            return res.json({
                res: true,
                status: "Active",
                msg: 'Successfully Assessor is Active',
            });
        }

    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while updating the assessor status.',
        });
    }
}

const assDelete = async (req, res) => {
    try {
        if (req.user.loginType == "Client" || req.user.loginType == "Admin") {

            const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
            const isAdmin = await AdminModel.findOne({ adminEmail: req.user.email })

            if (!isClient && !isAdmin) {
                return res.json({
                    res: false,
                    msg: 'Somthing Went To Wrong!',
                });
            }
            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }
            await assModel.deleteOne({ _id: isAssessor._id })

            return res.json({
                res: true,
                msg: 'Successfully assessor remove.',
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

            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }
            await assModel.deleteOne({ _id: isAssessor._id })

            return res.json({
                res: true,
                msg: 'Successfully assessor remove.',
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
            const isAssessor = await assModel.findOne({ _id: req.params.id })
            if (!isAssessor) {
                return res.json({
                    res: false,
                    msg: 'Assessor is not found!',
                });
            }
            await assModel.deleteOne({ _id: isAssessor._id })
            return res.json({
                res: true,
                msg: 'Successfully assessor remove.',
            });


        }

    } catch (error) {
        console.error("Error in Delete assessor:", error);
        return res.status(500).json({
            res: false,
            msg: 'An error occurred while delete the assessor ',
        });
    }
}



const asscrDropDown = async (req, res) => {
    try {
      if (req.user.loginType == "Client") {
        const isClient = await ClientModel.findOne({ clientEmail: req.user.email })
          
        if (!isClient) {
  
          
          return res.json({
            res: false,
            msg: 'Somthing Went To Wrong!',
          });
        }
  
        const asscrData = []
        await Promise.all(isClient.assginedSectorsId.map(async (id) => {
         
          const asscr = await assModel.findOne({ _id: id, status: "Active" }, "_id name");
          console.log('sector',asscr)
          if (asscr) {
            asscrData.push(asscr);
          }
        }))
        
        return res.json({
          req: true,
          msg: "success",
          data: asscrData
        })
      }
  
      if (req.user.loginType == "Admin") {
        const sectorData = await assModel.find({ status: "Active" }, "_id name");
        return res.json({
          req: true,
          msg: "success",
          data: sectorData
        })
      }
  
      if(req.user.loginType == "spoc-person"){
        const isSpocPerson = await SpocPersonModel.findOne({ emailId: req.user.email })
        if (!isSpocPerson) {
          return res.json({
            res: false,
            msg: 'Somthing Went To Wrong!',
          });
        }
        const sectorData = await sectorModel.find({_id: { $in: isSpocPerson.assginedSectorsIds },status: "Active" }, "_id name");
        return res.json({
          req: true,
          msg: "success",
          data: sectorData
        })
      }
  
      if(req.user.loginType == "Child-User"){
        const isChildUser = await ChildUserModel.findOne({emailId:req.user.email})
        if(!isChildUser){
          return res.json({
            res: false,
            msg: 'Somthing Went To Wrong!',
          });
        }
        const sectorData = await sectorModel.find({_id:  isChildUser.selectSectorPermissionId ,status: "Active" }, "_id name");
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
    asscreate,
    assGetAll,
    assEdit,
    statusUpdate,
    assDelete,
    asscrDropDown
}
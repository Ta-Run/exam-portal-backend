/**
 * This is where you will define all the api endpoints
 * that the api will have.
 */

const router = require("express").Router();
const auth = require("../middlewares/authentication/auth");
const { singleFileUpload, multiFieldsUpload } = require("../helpers/index");

// API Controllers.
const adminController = require("../controllers/admin-controller");
const sectorController = require("../controllers/sector-controller");
const clientController = require("../controllers/client-controller");
const spocpersonController = require("../controllers/spoc-person-controller");
const jobRoleController = require("../controllers/job-role-controller");
const nosController = require("../controllers/nos-controller/index");
const schemeController = require("../controllers/scheme-controller");
const questionBankController = require("../controllers/question-bank-controller");
const questionController = require("../controllers/question-controller");
const childUserController = require("../controllers/child-user-controller");
const assessorController = require("../controllers/manage-accessor");
const candidateController = require("../controllers/candidate-bulk");
const manageCandidateController = require("../controllers/manage-Candidate");
const assessmentController = require("../controllers/assessment");
const appController = require("../controllers/app");
const SpocPersonAuthController = require("../controllers/spoc-person-service");
const childUserService = require("../controllers/child-user-service");
const stateDistrictController = require("../controllers/state-district");
const examController = require("../controllers/exam/index");
// const getAllQuestions = require("../controllers/exam/index")
// const getUploadDocumentById = require("../controllers/exam/index")
// const getClientQuestionDetails = require("../controllers/exam")

//State District Router
router.get("/state", auth, stateDistrictController.state);

// Routes endpoints
router.post("/default-admin", adminController.defultAdminCrate);
router.post("/admin/login", adminController.adminLogin);
router.get("/admin/logout", auth, adminController.adminLogout);

// Dashbord API create
router.get("/admin/dashboard", auth, adminController.adminDashboard);
router.get("/client/dashboard", auth, adminController.clientDashboard);

//Sector Router
router.post(
  "/sector-add",
  auth,
  singleFileUpload("logo"),
  sectorController.sectorCreate
);
router.get("/sector", auth, sectorController.sectorList);
router.put(
  "/sector/:id",
  singleFileUpload("logo"),
  auth,
  sectorController.sectorEdit
);
router.put("/sector-status/:id", auth, sectorController.sectorStatusUpdate);
router.delete("/sector-remove/:id", auth, sectorController.sectorDelete);
router.get("/sector/drop-down", auth, sectorController.sectorDropDown);

//Client Router
router.post("/client-add", auth, clientController.clientCreate);
router.get("/client", auth, clientController.clientList);
router.put("/client/:id", auth, clientController.clientEdit);
router.put("/client-status/:id", auth, clientController.clientStatusChange);
router.delete("/client-remove/:id", auth, clientController.clientremove);

//Spoc Person Router
router.post("/spoc-person/add", auth, spocpersonController.spocPersonCreate);
router.get("/spoc-person", auth, spocpersonController.spocPersonList);
router.put("/spoc-person/:id", auth, spocpersonController.spocPersonEdit);
router.put(
  "/spoc-person/status/:id",
  auth,
  spocpersonController.spocPersonStatusChange
);
router.delete(
  "/spoc-person/remove/:id",
  auth,
  spocpersonController.spocPersonRemove
);

//Job Role Controller Router
router.post("/job-role/add", auth, jobRoleController.jobRoleCreate);
router.get("/job-role", auth, jobRoleController.jobRoleList);
router.put("/job-role/:id", auth, jobRoleController.jobRoleEdit);
router.put("/job-role/status/:id", auth, jobRoleController.jobRoleStatusChange);
router.delete("/job-role/remove/:id", auth, jobRoleController.jobRoleRemove);
router.get("/job-role/drop-down", auth, jobRoleController.jobRoleDropDown);

//NOS Router
router.post("/nos/add", auth, nosController.nosCreate);
router.get("/nos", auth, nosController.nosList);
router.delete("/nos/:id", auth, nosController.nosDelete);
router.put("/nos/:id", auth, nosController.nosEdit);
router.put("/nos-status/:id", auth, nosController.nosStatus);
router.get("/nos/drop-dwon", auth, nosController.nosDropDownList);
router.post(
  "/nos/bulkUpload",
  auth,
  singleFileUpload("bulkUpload"),
  nosController.bulkUpload
);

//Scheme Router
router.post("/scheme/add", auth, schemeController.schemeCreate);
router.get("/scheme", auth, schemeController.schemeList);
router.delete("/scheme/remove/:id", auth, schemeController.schemeRemove);
router.put("/scheme-edit/:id", auth, schemeController.schemeUpdate);
router.put("/scheme-status/:id", auth, schemeController.schemeStatus);

//Question Bank Router
router.post("/question-bank/add", auth, questionBankController.questionBankAdd);
router.get("/question-bank", auth, questionBankController.questionBankList);
router.delete(
  "/question-bank/remove/:id",
  auth,
  questionBankController.questionBankRemove
);
router.put(
  "/question-bank/edit/:id",
  auth,
  questionBankController.questionBankEdit
);
router.put(
  "/question-bank/status/:id",
  auth,
  questionBankController.questionBankStatus
);

//Question Router
router.post(
  "/question/add",
  auth,
  multiFieldsUpload([
    { name: "attatchment", maxCount: 1 },
    { name: "optionAAttatchment", maxCount: 1 },
    { name: "optionBAttatchment", maxCount: 1 },
    { name: "optionCAttatchment", maxCount: 1 },
    { name: "optionDAttatchment", maxCount: 1 },
  ]),
  questionController.questionCreate
);

router.get("/question/:id", auth, questionController.questionList);
router.delete("/question-remove/:id", auth, questionController.questionRemove);
router.put(
  "/question-status/:id",
  auth,
  questionController.questionStatusChange
);
router.put(
  "/question-edit/:id",
  auth,
  multiFieldsUpload([
    { name: "attatchment", maxCount: 1 },
    { name: "optionAAttatchment", maxCount: 1 },
    { name: "optionBAttatchment", maxCount: 1 },
    { name: "optionCAttatchment", maxCount: 1 },
    { name: "optionDAttatchment", maxCount: 1 },
  ]),
  questionController.questionEdit
);

//Question BulkUpload
router.post(
  "/question/bulkUpload",
  singleFileUpload("bulkUpload"),
  auth,
  questionController.questionBulkUpload
);
router.get(
  "/bulk-upload/question",
  auth,
  questionController.getQuestionBulkUpload
);

// Child User Router
router.post("/child-user/add", auth, childUserController.childUserCreate);
router.get("/child-user", auth, childUserController.childUserList);
router.put("/child-user/edit/:id", auth, childUserController.childUserEdit);
router.put(
  "/child-user/status/:id",
  auth,
  childUserController.childUserStatusChange
);
router.delete(
  "/child-user/remove/:id",
  auth,
  childUserController.childUserRemove
);

// Assessor Route
router.post(
  "/assessor/register",
  auth,
  multiFieldsUpload([
    { name: "profile_picture", maxCount: 1 },
    { name: "adhar_img", maxCount: 1 },
    { name: "adhar_img2", maxCount: 1 },
    { name: "pancard_img", maxCount: 1 },
  ]),
  assessorController.asscreate
);

router.get("/assessor/get", auth, assessorController.assGetAll);

router.get("/assessor/asscrDropDown",auth, assessorController.asscrDropDown)

router.put(
  "/assessor/:id",
  auth,
  multiFieldsUpload([
    { name: "profile_picture", maxCount: 1 },
    { name: "adhar_img", maxCount: 1 },
    { name: "adhar_img2", maxCount: 1 },
    { name: "pancard_img", maxCount: 1 },
  ]),
  assessorController.assEdit
);
router.put(
  "/assessor/update-status/:id",
  auth,
  assessorController.statusUpdate
);
router.delete("/assessor/delete-ass/:id", auth, assessorController.assDelete);

//add Candidate
router.post(
  "/candidate/add",
  auth,
  singleFileUpload("ProfilePicture"),
  candidateController.addCandidate
);
router.get("/candidate/list", auth, candidateController.candidateList);
router.post(
  "/candidate/bulkUpload",
  auth,
  singleFileUpload("bulkUpload"),
  candidateController.bulkupload
);

//manage Candidates
router.post(
  "/manageCandidate/move",
  auth,
  manageCandidateController.moveCandidate
);
router.post(
  "/manageCandidate/delete",
  auth,
  manageCandidateController.deleteCandidate
);
router.get(
  "/manageCandidate/list",
  auth,
  manageCandidateController.manageCandidateList
);
router.put(
  "/manageCandidate/Edit/:id",
  auth,
  singleFileUpload("ProfilePicture"),
  manageCandidateController.Edit
);
router.delete(
  "/manageCandidate/delete/:id",
  auth,
  manageCandidateController.deletebyId
);

//Assessment -Batch Upload
router.post(
  "/assessment/bulk_upload",
  auth,
  singleFileUpload("bulkUpload"),
  assessmentController.batch_bulkupload
);
router.post("/assessment/moveBulk", auth, assessmentController.moveBatch); //move to manage bulk
router.post(
  "/assessment/deleteBulkData",
  auth,
  assessmentController.deleteBatch
);
router.get("/assessment/bulkDataList", auth, assessmentController.bulkDataList);

//Assessment manage-batch
router.post("/assessment/addBatch", auth, assessmentController.add_batch);
router.get("/assessment/getBatchData", auth, assessmentController.getBatchData);
router.put(
  "/assessment/editBatchData/:id",
  auth,
  assessmentController.editBatchData
);
router.delete(
  "/assessment/deleteBatchData/:id",
  auth,
  assessmentController.deleteBatchData
);
router.get(
  "/manageCandidate/scheduleBatch",
  auth,
  assessmentController.scheduleBatchList
);
router.get(
  "/manageCandidate/currentBatch",
  auth,
  assessmentController.currentBatch
);
router.get(
  "/manageCandidate/batch/dropDown",
  auth,
  assessmentController.dropDown
);

//application
router.post(
  "/application/upload",
  auth,
  multiFieldsUpload([
    { name: "yourPhoto", maxCount: 1 },
    { name: "yourDocument", maxCount: 1 },
  ]),
  appController.ulpoadDocument
);
router.post("/application/login", auth, appController.login);

//Spoc Person Login
router.post("/spoc-person/login", SpocPersonAuthController.spocPersonLogin);
router.get(
  "/spoc-person/logout",
  auth,
  SpocPersonAuthController.spocPersonLogout
);
router.get(
  "/spoc-person/assign-job-role",
  auth,
  SpocPersonAuthController.assignJobRole
);

// child user login
router.post("/child-user/login", childUserService.childUserLogin);
router.get("/child-user/logout", auth, childUserService.childUserLogout);

// client exam routes

router.post(
  "/exam/upload-document",
  auth,
  multiFieldsUpload([
    { name: "yourPhoto", maxCount: 1 },
    { name: "yourDocument", maxCount: 1 },
  ]),
  examController.uploadDocuments
);

router.get("/exam/questions-list", auth, examController.getAllQuestions);
router.post("/exam/submit-exam", auth, examController.submitExam);

//for get upload Documents 
router.get("/exam/get-document/:clientId", auth, examController.getUploadDocumentById);
router.get("/exam/clietnDetail", auth, examController.getClientQuestionDetails)

//Question Bank Analytics.
router.get("/analytics/questionAnalytics/:id", auth, questionBankController.getQuestionAnalyticsRecord)

//Get Sectors Analytics 
router.get("/analytics/analyticReports/:id", auth, questionBankController.getAnalyticsBySector)


module.exports = router;

const uploadDocuments = async (req, res) => {
  try {
    // console.log("===============> body", req.body);
    // console.log("===============>files", req.files);

    if (
      !req.files ||
      !Object.keys(req.files).length ||
      (!req.files?.yourPhoto?.length && !req.files?.yourDocument?.length)
    ) {
      return res.json({
        res: true,
        msg: "Either photo or your document must be uploaded",
      });
    }

    return res.json({
      res: true,
      msg: "File successfully uploaded",
    });
  } catch (error) {
    return res.json({
      res: false,
      msg: "Somthing Went To Wrong!",
    });
  }
};

module.exports = { uploadDocuments };

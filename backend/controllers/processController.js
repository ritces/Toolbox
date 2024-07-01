import { getAllFiles } from "../managers/proccessManager.js";

/**
 * @description get all complete files
 * @param {Request} req 
 * @param {Response} res - a list of files with the specific information
 */
const getFilesInfo = async (req, res) => {
  try {
    const files = await getAllFiles(req.query.fileName);
    return res.status(200).send(files);
  }
  catch (e) {
    return res.status(500).send({ message: "Something went wrong, please try later" });
  }
};

export { getFilesInfo }
import fetch from 'node-fetch';
import { API_URL, API_TOKEN } from "../apiKeys.js"

/** 
  * @return {path} path of the endpoint i want to execute
  * Returns the result of calling an api
*/
const fetchApi = async (path) => {
  const url = API_URL;
  const token = API_TOKEN;

  const headers = {
    Authorization: `Bearer ${token}`
  }

  try {
    const response = await fetch(`${url}${path}`, {
      method: "GET",
      headers,
    });

    if (response.status !== 200) throw new Error("Error fetching endpoint");

    const contentType = response?.headers?.get('content-type');
    if (contentType?.includes("application/json")) {
      return await response.json();
    }
    return response.text()

  }
  catch (e) {
    console.log("[fetchApi] error fetching endpoint");
    throw new Error("Error fetching endpoint");
  }

};


/**
  * Returns a boolean to check if the input is a Hexadecimal number and has 32 digits
  * @return {boolean} 
*/
const isHexadecimal = (number) => {
  const isHexa = /^[0-9A-F]+$/ig.test(number);
  const isHexa32 = isHexa && number?.length === 32;
  return isHexa32;
};

/**
  * Returns a boolean to check if the input is a number
  * @return {boolean} 
*/
const isNumber = (number) => {
  return !isNaN(+number);
};

/**
  * Returns a boolean to check if the input is a string
  * @return {boolean} 
*/
const isString = (number) => {
  return typeof number === "string";
};


/**
  * Returns a list of files with information of the lines
    @param {fileName} fileName the name of the files or file we want to filter
  * @return {array} file
*/
const getAllFiles = async (fileName) => {
  try {
    const response = await fetchApi("/files");
    if (response.files) {
      if (fileName && fileName !== "null" && fileName !== "") {
        response.files = response.files.filter((file) => file.includes(fileName));
      }
      const filesInformation = await Promise.allSettled(response.files.map((file => {
        return getInfoFile(file)
      })));

      //filter the file that got error or doesn't have any line
      const filesComplete = filesInformation.filter(file => file?.status === 'fulfilled' &&
        Object.keys(file?.value)?.length).map(file => file.value);
      return filesComplete;
    }
  }
  catch (e) {
    console.log("[getAllFiles] error fetching endpoint ");
    throw new Error("Error fetching endpoint");
  }

};


/**
  * @return {param} file 
  * Returns information of a especific file
  * @return {object} file information
*/
const getInfoFile = async (file) => {
  const readFile = await fetchApi(`/file/${file}`);
  //error reading file so i return nothing
  if (!readFile?.length) return
  const fileArray = readFile?.split('\n');
  const headerCSV = fileArray?.[0]?.split(",");
  //clean headers
  fileArray.shift();
  const objFiles = {};
  let lines = [];
  let nameFile = ""

  fileArray.forEach(file => {
    const fileInfoArray = file?.split(",")
    let lineObject = {}
    fileInfoArray?.forEach((info, index2) => {
      //first position is the name
      if (!index2) nameFile = info
      // ignore the name of file and check that the info is not empty
      if (index2 && info !== "") {
        // check if the type of input are correct
        if (headerCSV[index2] === "number" && !isNumber(info) || headerCSV[index2] === "hex" && !isHexadecimal(info)
          || headerCSV[index2] === "text" && !isString(info)
        ) return;
        lineObject = { ...lineObject, [headerCSV[index2]]: info };
      }

    })

    if (Object.keys(lineObject)?.length === headerCSV.length - 1) {
      lines.push(lineObject);
    }

  })

  // check if is there is any line
  if (lines.length) {
    objFiles[headerCSV[0]] = nameFile;
    objFiles.lines = lines;
  }

  return objFiles;
}

export { getAllFiles, getInfoFile }

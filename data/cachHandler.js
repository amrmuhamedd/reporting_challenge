const fs = require("fs");
const path = require("path");
const { runWorker } = require("../workers/initiateWorker");

let gradesCache;

module.exports = {
  getGradeData,
};

loadStaticFiles();

async function loadStaticFiles() {
  const gradeDataPath = path.resolve(__dirname, "./staticData/gradeData.json");
  if (doseFileExist(gradeDataPath)) {
    gradesCache = require(gradeDataPath);
  } 
}

function doseFileExist(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
}
async function getGradeData() {
  if (!gradesCache) {
    gradesCache = await runWorker("./gradeDataFetcher.js");
  }

  return gradesCache;
}

const fs = require("fs");
const path = require("path");
const { runWorker } = require("../workers/initiateWorker");

let gradesCache;
let courseGradeReport;

module.exports = {
  getGradeData,
  getCourseGradesReportData,
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

async function getCourseGradesReportData() {
  try {
    if (!courseGradeReport) {
      const gradeData = await getGradeData();
      courseGradeReport = await runWorker("./courseGradeReporter.js", {
        data: gradeData,
      });
    }
    return courseGradeReport;
  } catch (error) {
    throw error;
  }
}

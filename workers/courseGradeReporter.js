const { parentPort} = require("worker_threads");
const fsPromises = require("fs/promises");
const {generateCourseReport } = require("../utils/calculateCourse");

fsPromises.readFile("data/staticData/gradeData.json", "utf-8").then((value) => {
  const allStudentGrades = JSON.parse(value);
    parentPort.postMessage({
      courseGradesReport: generateCourseReport(allStudentGrades),
    });
});

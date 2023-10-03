const axios = require("axios");
const fs = require("fs");
const { parentPort } = require("worker_threads");
const gradeDataUrl =
  "https://outlier-coding-test-data.onrender.com/grades.json";

function fetchGradesData() {
    axios
    .get(gradeDataUrl)
    .then(({ data }) => {
      parentPort.postMessage(data);
      const jsonData = JSON.stringify(data , null , 2)
      const filePath = "data/staticData/gradeData.json"; 

      fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          console.error("Error writing JSON file:", err);
        } else {
          console.log("JSON file has been created!");
        }
      });
    })
    .catch((err) => {
      parentPort.postMessage({ error: err.message });
    });
}

fetchGradesData();

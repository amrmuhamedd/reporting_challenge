const axios = require("axios");
const { parentPort } = require("worker_threads");

const gradeDataUrl =
  "https://outlier-coding-test-data.onrender.com/grades.json";

function fetchGradesData() {
  axios
    .get(gradeDataUrl)
    .then(({ data }) => {
      parentPort.postMessage(data);
    })
    .catch((err) => {
      parentPort.postMessage({ error: err.message });
    });
}

fetchGradesData()
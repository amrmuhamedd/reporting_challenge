const { getGradeData } = require('./data/cachHandler')
const knex = require('./db')
const { throwNewError, sendErrorResponse } = require('./utils/errorHandler')


module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudentById (id) {
  if(!id || id === ':id') {
  return  throwNewError(400, "Valid id is required")
  }

  const student = await knex('students').where({id}).first();
  
  if (!student) {
    return  throwNewError(404, "student not found")
  }

  return student
}

async function getStudent (req, res, next) {
 try {
  const {id} = req.params

  const student = await getStudentById(id);

  return res.status(200).json(student).end()
 } catch (e) {
  sendErrorResponse(e, req, res, next)
 }
}

async function getStudentGradesReport (req, res, next) {
try {
  const {id} = req.params
  console.log({id})
  const student = await getStudentById(id);
  console.log({student})
  const gradeData = await getGradeData()
  const grades = gradeData
  .filter(grade => grade?.id === parseInt(id))
  .map(({course, grade}) => ({course , grade}))

  if(grades.length ===  0) {
    return res
        .status(404)
        .json({ message: 'Grades not found for the student.', student })
  }

  return res.status(200).json({student , grades})
} catch (e) {
  
}
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

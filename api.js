const { getGradeData, getCourseGradesReportData } = require('./data/cachHandler')
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
  const student = await getStudentById(id);

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
  sendErrorResponse(e, req, res, next)
}
}

async function getCourseGradesReport (req, res, next) {
  try {
    const report = await getCourseGradesReportData()
    return res.status(200).json(report) 
  } catch (e) {
    sendErrorResponse(e, req, res, next)
  }
}


async function getStudentById (id) {
  if(!id || id === ':id') {
  return  throwNewError(400, "Valid id is required")
  }
  const keysToInclude = [
    'id',
    'first_name',
    'last_name',
    'email',
    'is_registered',
    'is_approved',
    'address',
    'city',
    'state',
    'zip',
    'phone',
    'created',
    'last_login',
    'ip_address'
  ]

  const student = await knex('students').select().where({id}).first();

  if (!student) {
    return  throwNewError(404, "student not found")
  }

  Object.keys(student).forEach((key) => {
    if (!keysToInclude.includes(key)) {
      delete student[key]
    }
  })

  return student
}
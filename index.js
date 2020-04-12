const express = require('express');
const students = require('./Students');
const schema = require('./Schema');
//Initialize express
const app = express();
//Ensure that all data is parsed as json by using a middleware
app.use(express.json());

//Home page route
app.get('/', (req, res) => {
    //This is a dummy route
    res.status(200).send("Welcome");
});

//Get all Students Route
app.get('/api/v1/students', (req, res, next) => {
    //Fetch all students and return with corresponding success code
    //res.status(200).send(students);
    //Determine page count with a limit of 5 students per page
    const pageCount = Math.ceil(students.length / 5);
    //Get queried page i.e. from ?page=int
    let page = parseInt(req.query.page);
    //If no page is specified in queries, then set page to 1
    if (!page) {
        page = 1;
    }
    //If a user requests a page higher than pageCount default to the last page
    if (page > pageCount) {
        page = pageCount
    }
    //Return results of determined pagegi
    res.status(200).send({
        "page": page,
        "pageCount": pageCount,
        "students": students.slice(page * 5 - 5, page * 5)
    });

});

// Get Student by ID
app.get('/api/v1/students/:id', (req, res) => {
    //Check if id provided is in collection of students
    const student = students.find(s => s.id === parseInt(req.params.id));
    //Send error and status code if student is missing
    if (!student) res.status(404).send(`The student with ID ${req.params.id} was not found.`);
    //Send student and status code
    res.status(200).send(student);
});

//Create Student
app.post('/api/v1/students', (req, res) => {
    //Validate new student data
    const {error} = validateStudent(req.body);
    //Send validation errors and status code
    if (error) {
        res.status(400).send({errors: error.message});
        return;
    }
    //Create update object
    const student = {
        "id": students.length + 1,
        "year_of_birth": req.body.year_of_birth,
        "course": req.body.course,
        "name": {
            "first": req.body.name.first,
            "last": req.body.name.last
        },
        "email": req.body.email,
        "phone": req.body.phone
    };
    //Create student
    students.push(student);
    //Send response code and student that was created
    res.status(201).send(student);
});

//Edit Student
app.put('/api/v1/students/:id', (req, res) => {
    //Check if student exists in collection
    const student = students.find(s => s.id === parseInt(req.params.id));
    //Send error if student is missing
    if (!student) res.status(404).send({errors: `The student with ID ${req.params.id} was not found.`});
    //Validate student
    const {error} = validateStudent(req.body);
    //Return error if validation fails
    if (error) {
        res.status(400).send({errors: error.message});
        return;
    }
    //Update student
    student.year_of_birth = req.body.year_of_birth;
    student.course = req.body.course;
    student.name.first = req.body.name.first;
    student.name.last = req.body.name.last;
    student.email = req.body.email;
    student.phone = req.body.phone;
    //Send response code together with updated student
    res.status(200).send(student);
});

//Delete Student
app.delete('/api/v1/students/:id', (req, res) => {
    //Check if student exists
    const student = students.find(s => s.id === parseInt(req.params.id));
    //Send error if student id is missing
    if (!student) res.status(404).send({errors: `The student with ID ${req.params.id} was not found.`});
    //Get student index in array
    const index = students.indexOf(student);
    //Remove student from collection
    students.splice(index, 1);
    //Send response code and student that was deleted
    res.status(200).send(student);
});

//Validate Student object
function validateStudent(student) {
    return schema.validate(student);
}

//Express Server Configs
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
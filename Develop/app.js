const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


var Team = [];

const ManagerQuestions = [
{
    type: "input",
    name: "name",
    message: "Please enter your Name",
    validate: async (input) => {
        if (input == ""){
            return "Please enter your name";
        }
        return true;
    }
},
{
    type: "input",
    name: "email",
    message: "Please enter your email",
    validate: async (input) => {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input)){
          return true;
        }
          return ("You have entered an invalid email address!");
    }
},
{ 
    type: "input",
    name: "idNumber",
    message: "Please enter your office ID Number",
    validate: async (input) => {
        if (isNaN(input)) {
            return ("Please enter your ID Number");
        }
            return true;
        }
},
{ 
    type: "input",
    name: "officeNum",
    message: "Please enter your office Number",
    validate: async (input) => {
        if (isNaN(input)) {
            return ("Please enter your office number");
        }
            return true;
        }
},
{
            type: "list",
            name: "teamConfirm",
            message: "Do you have a team?",
            choices: ["Yes", "No"]
 },
]


const employeeQuestions = [

    {
        type: "input",
        name: "name",
        message: "Please enter the employee name",
        validate: async (input) => {
            if (input == ""){
                return ("Please enter a name");
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "What is the employee's email?",
        validate: async (input) => {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input)){
              return true;
            }
              return ("You have entered an invalid email address!");
        }
    },
    {
        type: "list",
        name: "position",
        message: "What is the employee's position in the company?",
        choices: ["Engineer","Intern"]
    },
    {
        when: input => {
            return input.position == "Engineer"
        },

        type: "input",
        name: "github",
        message: "Please enter the employee's github username:",
        validate: async (input) => {
            if (input == "" || /\s/.test(input)) {
                return "Please enter a username";
            }
            return true;
        }
    },
    {
        when: input => {
            return input.position = "Intern"
        },
    },
    {
        type: "input",
        name: "school",
        message: "Please enter your school",
        validate: async (input) => {
            if (input == ""){
                return ("Please enter a School Name!")
            }
            return true;
        }
    },
    {
        type: "list",
        name: "addTeam",
        message: "Would you like to add another team member?",
        choices: ["Yes, No"]
    }
]


function TeamBuild() {
    inquirer.prompt(employeeQuestions).then(employeeInfo => {
        if (employeeInfo.role == "Engineer") {
            var newMember = new Engineer(employeeInfo.name, employeeInfo.length + 1, employeeInfo.email, employeeInfo.github);
        } else {
            var newMember = new Intern(employeeInfo.name, employeeInfo.length + 1, employeeInfo.email, employeeInfo.school);
        }
        Team.push(newMember);
        if (employeeInfo.addAnother === "Yes") {
        ;
          TeamBuild();
        } else {
            htmlBuild();
        }
    })
}

function CardBuild(memberType, name, id, email, propertyValue) {
    let data = fs.readFileSync(`./templates/${memberType}.html`, 'utf8')
    data = data.replace("nameHere", name);
    data = data.replace("idHere", `ID: ${id}`);
    data = data.replace("emailHere", `Email: <a href="mailto:${email}">${email}</a>`);
    data = data.replace("propertyHere", propertyValue);
    fs.appendFileSync("success.html", data, err => { if (err) throw err; });
}


function htmlBuild() {
    let newFile = fs.readFileSync("./templates/main.html")
    fs.writeFileSync("success.html", newFile, function (err) {
        if (err) throw err;
    })

    for (member of Team) {
        if (member.getRole() == "Manager") {
            CardBuild("manager", member.getName(), member.getId(), member.getEmail(), "Office: " + member.getOfficeNumber());
        } else if (member.getRole() == "Engineer") {
            CardBuild("engineer", member.getName(), member.getId(), member.getEmail(), "Github: " + member.getGithub());
        } else if (member.getRole() == "Intern") {
            CardBuild("intern", member.getName(), member.getId(), member.getEmail(), "School: " + member.getSchool());
        }
    }
    fs.appendFileSync("success.html", "</div></main></body></html>", function (err) {
        if (err) throw err;
    });
   
}


function init() {
    inquirer.prompt(ManagerQuestions).then(managerInfo => {
        let teamManager = new Manager(managerInfo.name, 1, managerInfo.email, managerInfo.officeNum);
        Team.push(teamManager);
        if (managerInfo.teamConfirm === "Yes") {
            TeamBuild();
        } else {
            htmlBuild();
        }
    })
}

init();







// create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

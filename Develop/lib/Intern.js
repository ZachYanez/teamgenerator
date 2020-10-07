const Employee = require("./Employee");

class Intern extends Employee {
    constructor (name, id, email, school) {
        super (name, id, email, school);
        this.name = name;
        this.id = id;
        this.email = email
    }
    getSchool() {
        return this.school;
    }
    getRole() {
        return 'Intern';
    }
}

module.exports = Intern;
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Employee = require('./models/Employee');

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Generate random employees
const generateEmployees = (num) => {
  const employees = [];
  for (let i = 0; i < num; i++) {
    const employee = {
      employeeId: faker.datatype.uuid(),
      fullName: faker.name.findName(),
      email: faker.internet.email(),
      department: faker.name.jobArea(),
      role: faker.name.jobTitle(),
      salary: {
        basic: faker.datatype.number({ min: 40000, max: 100000 }),
        allowances: {
          housing: faker.datatype.number({ min: 5000, max: 15000 }),
          transport: faker.datatype.number({ min: 2000, max: 8000 }),
        },
      },
      leaves: {
        annual: faker.datatype.number({ min: 10, max: 20 }),
        sick: faker.datatype.number({ min: 5, max: 10 }),
        carriedForward: faker.datatype.number({ min: 0, max: 5 }),
      },
      performance: [],
      joiningDate: faker.date.past(),
      status: 'active',
    };
    employees.push(employee);
  }
  return employees;
};

// Seed employees into DB
const seedDatabase = async () => {
  try {
    const employees = generateEmployees(50);
    await Employee.insertMany(employees);
    console.log('50 employees added to the database!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();

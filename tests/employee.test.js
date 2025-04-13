const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const Employee = require('../models/Employee'); 
require('dotenv').config({ path: '.env.test' });

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await Employee.deleteMany();
  await mongoose.connection.close();
});

// Test for getting all employees
describe('GET /employees', () => {
  it('should fetch all employees', async () => {
    const res = await request(app).get('/employees');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

// Test for creating an employee
describe('POST /employees', () => {
  it('should create a new employee', async () => {
    const employeeData = {
      employeeId: 'EMP123',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      department: 'Engineering',
      role: 'Backend Developer',
      salary: {
        basic: 60000,
        allowances: {
          housing: 10000,
          transport: 5000,
        },
      },
      leaves: {
        annual: 12,
        sick: 5,
        carriedForward: 3,
      },
      performance: [],
      joiningDate: new Date(),
      status: 'active',
    };

    const res = await request(app).post('/employees').send(employeeData);
    expect(res.status).toBe(201);
    expect(res.body.employeeId).toBe(employeeData.employeeId);
    expect(res.body.fullName).toBe(employeeData.fullName);
  });
});

// Test for deleting an employee
describe('DELETE /employees/:id', () => {
  it('should delete an employee', async () => {
    const newEmployee = new Employee({
      employeeId: 'EMP123',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      department: 'Engineering',
      role: 'Backend Developer',
      salary: {
        basic: 60000,
        allowances: {
          housing: 10000,
          transport: 5000,
        },
      },
      leaves: {
        annual: 12,
        sick: 5,
        carriedForward: 3,
      },
      performance: [],
      joiningDate: new Date(),
      status: 'active',
    });
    await newEmployee.save();

    const res = await request(app).delete(`/employees/${newEmployee._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Employee deleted successfully');
  });
});

// Test for updating an employee
describe('PUT /employees/:id', () => {
  it('should update an employee\'s details', async () => {
    const newEmployee = new Employee({
      employeeId: 'EMP124',
      fullName: 'Jane Smith',
      email: 'janesmith@example.com',
      department: 'HR',
      role: 'HR Manager',
      salary: {
        basic: 70000,
        allowances: {
          housing: 15000,
          transport: 7000,
        },
      },
      leaves: {
        annual: 15,
        sick: 6,
        carriedForward: 4,
      },
      performance: [],
      joiningDate: new Date(),
      status: 'active',
    });
    await newEmployee.save();

    const updatedData = { fullName: 'Jane Smith Updated', department: 'Sales' };

    const res = await request(app)
      .put(`/employees/${newEmployee._id}`)
      .send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe(updatedData.fullName);
    expect(res.body.department).toBe(updatedData.department);
  });
});

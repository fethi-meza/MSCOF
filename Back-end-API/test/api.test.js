
const request = require("supertest");
const app = require("../server");
let adminToken = null;
let studentToken = null;
let createdDepartmentId = null;
let createdCourseId = null;
let createdStudentId = null;
let createdInstructorId = null;
let createdFormationId = null;
let createdScheduleId = null;
let createdGradeId = null;
let createdEnrollmentId = null;

describe("Campus Management API CRUD", () => {
  beforeAll(async () => {
    // Seed test accounts and login as admin and student
    await request(app)
      .post("/api/auth/seed-test-accounts")
      .send();

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "password123" });
    adminToken = adminLogin.body.token;

    const studentLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "student@test.com", password: "password123" });
    studentToken = studentLogin.body.token;
  });

  // DEPARTMENT CRUD
  it("should create, get, update, and delete a department", async () => {
    // Create
    const createRes = await request(app)
      .post("/api/departments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Test Department", description: "Test Desc" });
    expect(createRes.status).toBe(201);
    createdDepartmentId = createRes.body.data.id;

    // Get
    const getRes = await request(app)
      .get(`/api/departments/${createdDepartmentId}`);
    expect(getRes.status).toBe(200);

    // Update
    const patchRes = await request(app)
      .patch(`/api/departments/${createdDepartmentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ description: "Updated Desc" });
    expect(patchRes.status).toBe(200);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/departments/${createdDepartmentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // COURSE CRUD
  it("should create, get, update, and delete a course", async () => {
    // Make a new department for the course
    const dep = await request(app)
      .post("/api/departments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Course Dep", description: "Dep" });
    const depId = dep.body.data.id;
    // Create
    const createRes = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Test Course", description: "Test Desc", departmentId: depId });
    expect(createRes.status).toBe(201);
    createdCourseId = createRes.body.data.id;

    // Get
    const getRes = await request(app).get(`/api/courses/${createdCourseId}`);
    expect(getRes.status).toBe(200);

    // Update
    const patchRes = await request(app)
      .patch(`/api/courses/${createdCourseId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ description: "Updated Course Desc" });
    expect(patchRes.status).toBe(200);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/courses/${createdCourseId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // STUDENT CRUD (update and delete)
  it("should get and update student, then delete as admin", async () => {
    // Get student by admin
    const getRes = await request(app)
      .get("/api/students/2")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);

    // Update student (use student ID 2 from seed accounts)
    const updateRes = await request(app)
      .put("/api/students/2")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ phoneNumber: "+123456789", status: "ACTIVE" });
    expect(updateRes.status).toBe(200);

    // Delete (create one for delete)
    const regRes = await request(app)
      .post("/api/auth/register/student")
      .send({
        firstName: "Del",
        lastName: "Stu",
        email: "delstu@test.com",
        password: "password123",
        dateOfBirth: "2002-02-02"
      });
    createdStudentId = regRes.body.data.id;
    const deleteRes = await request(app)
      .delete(`/api/students/${createdStudentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // INSTRUCTOR CRUD (update, delete)
  it("should register, get, update and delete an instructor", async () => {
    // Register instructor
    const regRes = await request(app)
      .post("/api/auth/register/instructor")
      .send({
        firstName: "Test",
        lastName: "Instructor",
        email: "instructor-crud@test.com",
        password: "password123",
        specialization: "Math",
        isSpecialist: true
      });
    expect(regRes.status).toBe(201);
    createdInstructorId = regRes.body.data.id;

    // Get instructor
    const getRes = await request(app)
      .get(`/api/instructors/${createdInstructorId}`);
    expect(getRes.status).toBe(200);

    // Update instructor (as admin)
    const updateRes = await request(app)
      .patch(`/api/instructors/${createdInstructorId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ specialization: "Updated Math" });
    expect(updateRes.status).toBe(200);

    // Delete instructor
    const deleteRes = await request(app)
      .delete(`/api/instructors/${createdInstructorId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // FORMATION CRUD
  it("should create, get, update, and delete a formation", async () => {
    const createRes = await request(app)
      .post("/api/formations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TestFormation",
        description: "Test Desc",
        availableSpots: 5,
        durationInHours: 10,
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      });
    expect(createRes.status).toBe(201);
    createdFormationId = createRes.body.data.id;

    // Get
    const getRes = await request(app).get(`/api/formations/${createdFormationId}`);
    expect(getRes.status).toBe(200);

    // Update
    const updateRes = await request(app)
      .put(`/api/formations/${createdFormationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ description: "Formation updated", availableSpots: 7 });
    expect(updateRes.status).toBe(200);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/formations/${createdFormationId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // SCHEDULE CRUD
  it("should create, get, update, and delete a schedule", async () => {
    // Get or create a formation needed for schedules
    const formationRes = await request(app)
      .post("/api/formations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Schedule Formation",
        description: "Test",
        availableSpots: 2,
        durationInHours: 4,
        startDate: "2024-01-01",
        endDate: "2024-02-02"
      });
    const fId = formationRes.body.data.id;

    // Create
    const createRes = await request(app)
      .post("/api/schedules")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "10:00",
        location: "Room 1",
        formationId: fId
      });
    expect(createRes.status).toBe(201);
    createdScheduleId = createRes.body.data.id;

    // Get
    const getRes = await request(app).get(`/api/schedules/${createdScheduleId}`);
    expect(getRes.status).toBe(200);

    // Update
    const updateRes = await request(app)
      .put(`/api/schedules/${createdScheduleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ location: "Room 99" });
    expect(updateRes.status).toBe(200);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/schedules/${createdScheduleId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // ENROLLMENT CRUD
  it("should create, get, update, and delete an enrollment", async () => {
    // Register a student
    const stuRes = await request(app)
      .post("/api/auth/register/student")
      .send({
        firstName: "Enroll",
        lastName: "Me",
        email: "enrollme@test.com",
        password: "password123",
        dateOfBirth: "2002-03-03"
      });
    const stuId = stuRes.body.data.id;

    // Create a formation
    const formationRes = await request(app)
      .post("/api/formations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "ForEnroll",
        description: "Test",
        availableSpots: 3,
        durationInHours: 7,
        startDate: "2024-01-01",
        endDate: "2025-01-01"
      });
    const fId = formationRes.body.data.id;

    // Create
    const createRes = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ studentId: stuId, formationId: fId });
    expect(createRes.status).toBe(201);
    createdEnrollmentId = createRes.body.data.id;

    // Get
    const getRes = await request(app)
      .get(`/api/enrollments/student/${stuId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);

    // Update
    const updateRes = await request(app)
      .patch(`/api/enrollments/${createdEnrollmentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "COMPLETED" });
    expect(updateRes.status).toBe(200);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/enrollments/${createdEnrollmentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // GRADE CRUD
  it("should create, get, update, and delete a grade", async () => {
    // Register a student and create course
    const stuRes = await request(app)
      .post("/api/auth/register/student")
      .send({
        firstName: "GradeStu",
        lastName: "Grade",
        email: "gradestu@test.com",
        password: "password123",
        dateOfBirth: "2002-04-04"
      });
    const studentId = stuRes.body.data.id;

    const depRes = await request(app)
      .post("/api/departments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "GradeDep", description: "GD" });
    const depId = depRes.body.data.id;

    const courseRes = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "GradeCourse", description: "GC", departmentId: depId });
    const courseId = courseRes.body.data.id;

    // Create
    const createRes = await request(app)
      .post("/api/grades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ value: 95.5, studentId, courseId });
    expect(createRes.status).toBe(201);
    createdGradeId = createRes.body.data.id;

    // Get
    const getRes = await request(app)
      .get(`/api/grades/${createdGradeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);

    // Update
    const updateRes = await request(app)
      .put(`/api/grades/${createdGradeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ value: 99.9 });
    expect(updateRes.status).toBe(200);

    // Delete
    const deleteRes = await request(app)
      .delete(`/api/grades/${createdGradeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });

  // ATTENDANCE CRUD (create, read, update, delete)
  it("should create, read, update, and delete attendance", async () => {
    // Register a student
    const studentRes = await request(app)
      .post("/api/auth/register/student")
      .send({
        firstName: "Att",
        lastName: "Stu",
        email: "attstu@test.com",
        password: "password123",
        dateOfBirth: "2002-04-04"
      });
    const studentId = studentRes.body.data.id;

    // Create as admin
    const createRes = await request(app)
      .post("/api/attendance")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ studentId, date: "2024-04-10", status: "PRESENT" });
    expect(createRes.status).toBe(201);
    const attendanceId = createRes.body.data.id;

    // Get as admin
    const getRes = await request(app)
      .get(`/api/attendance/student/${studentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);

    // Update as admin
    const updateRes = await request(app)
      .patch(`/api/attendance/${attendanceId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "EXCUSED" });
    expect(updateRes.status).toBe(200);

    // Delete as admin
    const deleteRes = await request(app)
      .delete(`/api/attendance/${attendanceId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleteRes.status);
  });
});

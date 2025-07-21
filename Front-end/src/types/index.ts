export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber?: string;
  enrollmentDate: string;
  status: 'ACTIVE' | 'GRADUATED' | 'DROPPED';
  photo?: string;
};

export type Instructor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  isSpecialist: boolean;
  departmentId?: number;
  department?: Department;
  photo?: string;
};

export type Formation = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  availableSpots: number;
  remainingSpots?: number;
  durationInHours: number;
  startDate: string;
  endDate: string;
  instructorId?: number;
  instructor?: Instructor;
  departmentId?: number;
  department?: Department;
  schedules?: Schedule[];
  calendar?: Calendar;
};

export type Schedule = {
  id: number;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  location: string;
  formationId: number;
  formation?: Formation;
};

export type Department = {
  id: number;
  name: string;
  description?: string;
};

export type Course = {
  id: number;
  name: string;
  description?: string;
  departmentId: number;
  department?: Department;
  formationId?: number;
  formation?: Formation;
};

export type Grade = {
  id: number;
  value: number;
  date: string;
  studentId: number;
  student?: Student;
  courseId: number;
  course?: Course;
};

export type Enrollment = {
  id: number;
  studentId: number;
  student?: Student;
  formationId: number;
  formation?: Formation;
  enrollmentDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
};

export type Attendance = {
  id: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED';
  studentId: number;
  student?: Student;
};

export type Event = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarId: number;
};

export type Calendar = {
  id: number;
  formationId: number;
  events: Event[];
};

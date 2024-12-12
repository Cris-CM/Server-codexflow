import { Injectable } from '@nestjs/common';

@Injectable()
export class CoursesService {
  private courses = [];

  createCourse(courseData: any) {
    this.courses.push(courseData);
    return courseData;
  }

  getAllCourses() {
    return this.courses;
  }
} 
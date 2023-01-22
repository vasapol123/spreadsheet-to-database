import async from 'async';
import bcrypt from 'bcrypt';
import lodash from 'lodash';
import { PrismaClient } from '@prisma/client';
import * as spreadsheet from './spreadsheet.js';
import faker from './faker.js';

const prisma = new PrismaClient();

const LETTER_GRADE = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D'];

function GRADE_MAPPING(this: any) {
  LETTER_GRADE.forEach((val, i) => {
    this[val] = 4 - i * 0.5;
  });
  return this;
}

function studentCode2year(studentCode: string): number {
  const currentYear = Number(
    (Number(new Date().getFullYear()) + 543).toString().slice(-2)
  );
  const studentYear = currentYear - Number(studentCode.slice(0, 2));
  return studentYear;
}

function letterGrade2number(letterGrade: string) {
  return lodash.get(new (<any>GRADE_MAPPING)(letterGrade), letterGrade) || 0;
}

let count = 0;
async function main() {
  // Input associated student data to the database.
  const student_ids = await async.map(
    spreadsheet.worksheetIdentifier,
    async function _(val: any) {
      return bcrypt.hash(<string>val.title, 8).then(async function _(hash) {
        const student = await prisma.students.create({
          data: {
            student_year: studentCode2year(<string>val.title),
            hashed_student_code: hash,
          },
        });
        return lodash.assign(
          { ...student, student_code: <string>val.title },
          {}
        );
      });
    }
  );

  spreadsheet.worksheetIdentifier.map(async (iden, i) => {
    const rawData = await spreadsheet.getRawDataByIndex(<number>iden.index);

    await async.map(rawData, async function _(val: any) {
      // Input associated course data to the database.
      try {
        await prisma.courses.create({
          data: {
            course_code: val.Course_Code,
            course_name: val.Course_Name,
            course_credit: Number(val.Course_Credit),
          },
        });
      } catch (e) {
        console.log(`Unique constraint failed × ${(count += 1)}`);
        process.stdout.write('\x1b[1A');
      }

      // Input associated grade average report data to the database.
      await prisma.grade_average_reports.create({
        data: {
          academic_year: val.Academic_Year,
          semester: val.Semester,
          gpa: Number(val.GPA),
          gpax: Number(val.GPAX),
          student_id: student_ids[i].id,
        },
      });

      // Input associated grade report data and enrollment to the database.
      await prisma.grade_reports.create({
        data: {
          letter_grade: val.Grade,
          number_grade: letterGrade2number(val.Grade),
          enrollment: {
            create: {
              academic_year: val.Academic_Year,
              semester: val.Semester,
              student: {
                connect: {
                  id: student_ids[i].id,
                },
              },
              course: {
                connect: {
                  course_code: val.Course_Code,
                },
              },
            },
          },
        },
      });
    });
  });
}

faker()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });

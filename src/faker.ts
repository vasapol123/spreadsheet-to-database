import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NUMBER_OF_DATA = 500000;

async function faker() {
  // Input fake student data into the database.
  await prisma.$executeRaw`
  INSERT INTO students
    WITH RECURSIVE
      cnt(id, student_year, hashed_student_code) AS (
        VALUES (1, ABS(RANDOM()) % (10 - 1) + 1, ABS(RANDOM())) UNION ALL
        SELECT id + 1, ABS(RANDOM()) % (10 - 1) + 1, ABS(RANDOM()) FROM cnt WHERE ID < 50000
      )
  SELECT * FROM cnt;
  `;

  // Input fake course data into the database.
  await prisma.$executeRaw`
  INSERT INTO courses
    WITH RECURSIVE
      cnt(id, course_code, course_name, course_credit) AS (
        VALUES (
          1,
          ABS(RANDOM()),
          ABS(RANDOM()),
          ABS(RANDOM()) % (6 - 1) + 1
        ) UNION ALL
        SELECT 
          id + 1,
          ABS(RANDOM()),
          ABS(RANDOM()),
          ABS(RANDOM()) % (6 - 1) + 1
        FROM cnt WHERE ID < ${NUMBER_OF_DATA}
      )
  SELECT * FROM cnt;
  `;

  // Input fake grade average reports data into the database.
  await prisma.$executeRaw`
  INSERT INTO grade_average_reports
    WITH RECURSIVE
      cnt(id, academic_year, semester, gpa, gpax, student_id) AS (
        VALUES (
          1,
          ABS(RANDOM()) % (2565 - 2550) + 2550,
          ABS(RANDOM()) % (3 - 1) + 1,
          ABS(RANDOM()) % (4 - 1) + 1,
          ABS(RANDOM()) % (4 - 1) + 1,
          ABS(RANDOM()) % (1000 - 1) + 1
        ) UNION ALL
        SELECT
          id + 1,
          ABS(RANDOM()) % (2565 - 2550) + 2550,
          ABS(RANDOM()) % (3 - 1) + 1,
          ABS(RANDOM()) % (4 - 1) + 1,
          ABS(RANDOM()) % (4 - 1) + 1,
          ABS(RANDOM()) % (1000 - 1) + 1
        FROM cnt WHERE ID < ${NUMBER_OF_DATA}
      )
  SELECT * FROM cnt;
  `;

  // Input fake grade reports data into the database.
  await prisma.$executeRaw`
  INSERT INTO grade_reports
    WITH RECURSIVE
      cnt(id, letter_grade, number_grade) AS (
        VALUES (
          1,
          ABS(RANDOM()),
          ABS(RANDOM()) % (4 - 1) + 1
        ) UNION ALL
        SELECT 
          id + 1,
          ABS(RANDOM()),
          ABS(RANDOM()) % (4 - 1) + 1
        FROM cnt WHERE ID < ${NUMBER_OF_DATA}
      )
  SELECT * FROM cnt;
  `;

  // Input fake enrollment data into the database.
  await prisma.$executeRaw`
  INSERT OR IGNORE INTO enrollments
    WITH RECURSIVE
      cnt(id, semester, academic_year, student_id, grade_report_id, course_id) AS (
        VALUES (
          1,
          ABS(RANDOM()) % (3 - 1) + 1,
          ABS(RANDOM()) % (2565 - 2550) + 2550,
          ABS(RANDOM()) % (1000 - 1) + 1,
          ABS(RANDOM()) % (${NUMBER_OF_DATA} - 1) + 1,
          ABS(RANDOM()) % (${NUMBER_OF_DATA} - 1) + 1
        ) UNION ALL
        SELECT
          id + 1,
          ABS(RANDOM()) % (3 - 1) + 1,
          ABS(RANDOM()) % (2565 - 2550) + 2550,
          ABS(RANDOM()) % (1000 - 1) + 1,
          id,
          ABS(RANDOM()) % (${NUMBER_OF_DATA} - 1) + 1
        FROM cnt WHERE ID < ${NUMBER_OF_DATA}
      )
  SELECT * FROM cnt;
  `;
}

export default faker;

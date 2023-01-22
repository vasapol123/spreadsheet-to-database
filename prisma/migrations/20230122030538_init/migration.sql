-- CreateTable
CREATE TABLE "students" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_year" INTEGER NOT NULL,
    "hashed_student_code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "courses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_code" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_credit" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "grade_reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "letter_grade" TEXT NOT NULL,
    "number_grade" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "grade_average_reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "academic_year" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "gpa" REAL NOT NULL,
    "gpax" REAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    CONSTRAINT "grade_average_reports_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "semester" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "grade_report_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrollments_grade_report_id_fkey" FOREIGN KEY ("grade_report_id") REFERENCES "grade_reports" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_code_key" ON "courses"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_grade_report_id_key" ON "enrollments"("grade_report_id");

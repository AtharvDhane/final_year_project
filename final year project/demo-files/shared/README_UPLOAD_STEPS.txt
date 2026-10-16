━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AXIOM — DEMO FILES UPLOAD GUIDE
AI Academic Suite | Smart Research Assistant
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUICK REFERENCE: Which file goes where?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESEARCHER TOOLS:
┌─────────────────────────┬──────────────────────────────────────────┐
│ Feature                 │ File to Upload                           │
├─────────────────────────┼──────────────────────────────────────────┤
│ Paper Analyzer          │ research_paper_1.txt (as PDF)           │
│ Literature Review       │ research_paper_1 + 2 + 3.txt (all 3)   │
│ Gap Finder              │ research_paper_1 + 2 + 3.txt (all 3)   │
│ Comparison              │ research_paper_1 + 2.txt (min 2)        │
│ Citation                │ research_paper_1.txt (as PDF)           │
│ Data Analyzer           │ research_dataset.csv (direct upload)    │
└─────────────────────────┴──────────────────────────────────────────┘

TEACHER TOOLS:
┌─────────────────────────┬──────────────────────────────────────────┐
│ Feature                 │ File to Upload                           │
├─────────────────────────┼──────────────────────────────────────────┤
│ Question Paper Gen      │ syllabus_science.txt OR                 │
│                         │ syllabus_computer.txt                   │
│ Assignment Generator    │ syllabus_science.txt OR                 │
│                         │ syllabus_computer.txt                   │
│ Teaching Material Gen   │ syllabus_science.txt OR                 │
│                         │ syllabus_computer.txt                   │
│ Evaluation & Feedback   │ model_answer.txt (reference)            │
│                         │ + student answer typed in textarea      │
│ Lesson Plan Generator   │ NO FILE NEEDED — just fill form         │
│ Performance Analyzer    │ student_marks.csv (direct upload)       │
└─────────────────────────┴──────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP-BY-STEP UPLOAD PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: LOGIN
  → Open http://localhost:3000
  → Login with your credentials
  → (Demo accounts: researcher@axiom.com / teacher@axiom.com, Password: Demo@123)

STEP 2: UPLOAD FILES TO "MY DOCUMENTS" (For PDF/TXT files)
  → From left sidebar, click "My Documents"
  → Click "Upload Document" button
  → Select the .txt files from this demo-files folder
  → Wait for "Processing Complete" message (10-30 seconds each)
  → Repeat for each file you want to use

  Files to upload for RESEARCHER role:
  ✓ researcher/research_paper_1.txt
  ✓ researcher/research_paper_2.txt
  ✓ researcher/research_paper_3.txt

  Files to upload for TEACHER role:
  ✓ teacher/syllabus_science.txt
  ✓ teacher/syllabus_computer.txt
  ✓ teacher/model_answer.txt

STEP 3: USE THE FEATURES
  → Navigate to any feature from the sidebar
  → Select uploaded document from the dropdown
  → Fill any additional inputs required
  → Click Submit/Analyze/Generate button
  → Wait for AI response (5-30 seconds)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOR CSV FILES (NO My Documents upload needed):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data Analyzer (Researcher):
  → Researcher Workspace → Data Analyzer
  → Click upload box → Select researcher/research_dataset.csv
  → Click "ANALYZE DATASET"

Performance Analyzer (Teacher):
  → Teacher Workspace → Student Performance Analyzer
  → Click upload box → Select teacher/student_marks.csv
  → Click "ANALYZE DATA"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EVALUATION TOOL — SAMPLE STUDENT ANSWER TO PASTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After uploading model_answer.txt as reference, paste this sample student
answer in the textarea for Evaluation & Feedback demonstration:

--- COPY FROM BELOW ---

Photosynthesis is how plants make food using sunlight. The plant takes in
carbon dioxide from the air and water from the soil. With the help of
chlorophyll (the green pigment) and sunlight, the plant makes glucose for
energy. Oxygen is released as a byproduct.

The equation is: CO2 + H2O → Glucose + O2

Factors that affect photosynthesis include the amount of light available,
temperature, and how much carbon dioxide is in the air. More light means
more photosynthesis happens until a certain limit.

The process happens in the chloroplasts inside the leaf cells.

--- COPY TILL ABOVE ---

This student answer is intentionally incomplete (missing some details,
no balancing of equation) so the AI will give meaningful partial marks
and constructive feedback.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LESSON PLAN GENERATOR — SAMPLE INPUTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No file needed! Just fill:
  Subject: Science
  Topic: Photosynthesis
  Target Class: 10th Grade
  Duration: 45 mins

OR try:
  Subject: Computer Science
  Topic: Recursion in Python
  Target Class: 12th Grade
  Duration: 60 mins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTION PAPER GENERATOR — SAMPLE INPUTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reference: syllabus_science.txt (upload first)
Subject: Science
Difficulty: Medium
Total Count: 15
Question Types: MCQs, Short Answer, Long Answer

OR for Computer Science:
Reference: syllabus_computer.txt
Subject: Computer Science - Python
Difficulty: Hard
Total Count: 20
Question Types: MCQs, True/False, Programming Questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AXIOM — AI Academic Suite | Final Year Project 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

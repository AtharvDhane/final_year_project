# 📁 AXIOM — Demo Files Guide
## Smart Research Assistant | Final Year Project

Ye folder sab demo/sample files contain karta hai jo aap website ke **Researcher**
aur **Teacher** workspace mein features demonstrate karne ke liye upload/use kar sakte hain.

---

## 🗂️ Folder Structure

```
demo-files/
│
├── DEMO_FILES_GUIDE.md              ← (Ye file) — Puri guide
│
├── researcher/
│   ├── research_paper_1.pdf         → Paper Analyzer, Lit Review, Gap Finder, Comparison, Citation
│   ├── research_paper_2.pdf         → Literature Review, Gap Finder, Comparison
│   ├── research_paper_3.pdf         → Literature Review, Gap Finder, Comparison
│   └── research_dataset.csv         → Data Analyzer (direct upload)
│
├── teacher/
│   ├── syllabus_science.txt         → Question Paper, Assignment, Teaching Material, Evaluation
│   ├── syllabus_computer.txt        → Question Paper, Assignment, Teaching Material, Evaluation
│   ├── model_answer.txt             → Evaluation (Reference/Model Answer)
│   └── student_marks.csv            → Performance Analyzer (direct upload)
│
└── shared/
    └── README_UPLOAD_STEPS.txt      → Step-by-step upload instructions
```

---

## 🔬 RESEARCHER WORKSPACE — Features & File Details

### 1. 📄 Paper Analyzer
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Research paper se objectives, problem, methodology, findings auto-extract karta hai |
| **File chahiye** | `researcher/research_paper_1.pdf` |
| **File type** | PDF only |
| **Upload method** | Pehle "My Documents" mein upload karo, phir dropdown se select karo |
| **Extra inputs** | Koi nahi — sirf paper select karo aur ANALYZE karo |

**AI kya extract karta hai:**
- Research Objective (mokshad)
- Problem Statement
- Methodology (kaise kiya gaya)
- Findings & Results
- Conclusion & Recommendations

---

### 2. 📚 Literature Review Assistant
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Multiple papers se ek comprehensive literature review synthesize karta hai |
| **Files chahiye** | `research_paper_1.pdf` + `research_paper_2.pdf` + `research_paper_3.pdf` |
| **File type** | PDF (multiple) |
| **Upload method** | My Documents upload → CTRL/CMD hold karke multiple papers select karo |
| **Extra inputs** | Koi nahi |

**AI kya banata hai:**
- Common themes across all papers
- Methodology comparison table
- Key findings synthesis
- Research evolution summary

---

### 3. 🔍 Gap Finder
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Papers mein jo research nahi hua wo gaps identify karta hai |
| **Files chahiye** | `research_paper_1.pdf` + `research_paper_2.pdf` + `research_paper_3.pdf` |
| **File type** | PDF (multiple) |
| **Upload method** | My Documents upload → CTRL/CMD hold karke select karo |
| **Extra inputs** | Koi nahi |

**AI kya dhundta hai:**
- Methodological gaps (missing research methods)
- Dataset gaps (unexplored data)
- Geographical gaps (unstudied regions)
- Future research directions

---

### 4. ⚖️ Research Paper Comparison
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | 2+ papers ko side-by-side compare karta hai |
| **Files chahiye** | Minimum `research_paper_1.pdf` + `research_paper_2.pdf` |
| **File type** | PDF (minimum 2) |
| **Upload method** | My Documents upload → CTRL/CMD hold karke select karo |
| **Extra inputs** | Koi nahi |

**AI kya compare karta hai:**
- Objectives comparison
- Methodology differences
- Dataset comparison
- Findings & conclusions

---

### 5. 📖 Citation & Reference Assistant
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Paper se APA, MLA, IEEE format citations auto-generate karta hai |
| **File chahiye** | `researcher/research_paper_1.pdf` |
| **File type** | PDF only |
| **Upload method** | My Documents upload → dropdown se select karo |
| **Extra inputs** | Koi nahi |

**AI kya banata hai:**
- APA format citation
- MLA format citation
- IEEE format citation
- In-text citation examples

---

### 6. 📊 Data Analyzer (Research)
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Research dataset ka statistical analysis karta hai |
| **File chahiye** | `researcher/research_dataset.csv` |
| **File type** | CSV ya XLSX — **Direct upload (My Documents ki zaroorat NAHI)** |
| **Upload method** | "Click to upload research dataset" box mein seedha upload karo |
| **Extra inputs** | Koi nahi |

**AI kya batata hai:**
- Total rows & columns count
- Min, Max, Mean, Median per column
- Missing values count
- Top frequencies for categorical data
- Research patterns & insights

---

## 👩‍🏫 TEACHER WORKSPACE — Features & File Details

### 1. ❓ Question Paper Generator
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Syllabus se automatically question paper generate karta hai |
| **File chahiye** | `teacher/syllabus_science.txt` ya `teacher/syllabus_computer.txt` |
| **File type** | PDF ya TXT |
| **Upload method** | My Documents upload → "Reference Syllabus/Material" dropdown |
| **Extra inputs** | Subject, Difficulty (Easy/Medium/Hard), Question Count, Question Types |

**Question types aap choose kar sakte ho:**
- MCQs (Multiple Choice Questions)
- Short Answer
- Long Answer / Essay
- True/False
- Fill in the Blanks

---

### 2. 📝 Assignment Generator
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Reference material se structured student assignment banata hai |
| **File chahiye** | `teacher/syllabus_science.txt` ya `teacher/syllabus_computer.txt` |
| **File type** | PDF ya TXT |
| **Upload method** | My Documents upload → "Reference Material" dropdown |
| **Extra inputs** | Assignment Topic (e.g., "Photosynthesis", "World War II") |

**AI kya banata hai:**
- Assignment title & objectives
- Part A, B, C style questions
- Research/analysis tasks
- Submission guidelines

---

### 3. 🎓 Automatic Evaluation & Feedback
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Student answer ko reference material se compare karke evaluate karta hai |
| **Files chahiye** | Reference: `teacher/model_answer.txt` + Student answer textarea mein type karo |
| **File type** | PDF ya TXT (reference ke liye) |
| **Upload method** | My Documents upload → "Reference Material / Model Answer" dropdown |
| **Extra inputs** | Student's Answer (textarea mein paste karo) |

**AI kya deta hai:**
- Score/marks suggestion
- Detailed paragraph-wise feedback
- Strengths identified
- Areas of improvement
- Compared with model answer

---

### 4. 📅 Lesson Plan Generator
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Detailed lesson plan create karta hai — **Koi file upload nahi chahiye!** |
| **File chahiye** | ❌ Koi file nahi — sirf form fill karo |
| **Extra inputs** | Subject, Topic, Target Class/Grade, Duration |

**Example inputs:**
- Subject: `Science`
- Topic: `Photosynthesis`
- Target Class: `10th Grade`
- Duration: `45 mins`

**AI kya banata hai:**
- Learning objectives
- Introduction activity
- Main teaching flow
- Practice exercises
- Assessment plan
- Homework suggestions

---

### 5. 📋 Teaching Material Generator
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Syllabus se student-ready lecture notes & teaching content banata hai |
| **File chahiye** | `teacher/syllabus_science.txt` ya `teacher/syllabus_computer.txt` |
| **File type** | PDF ya TXT |
| **Upload method** | My Documents upload → "Syllabus / Source Material" dropdown |
| **Extra inputs** | Koi nahi |

**AI kya generate karta hai:**
- Chapter-wise lecture notes
- Key definitions & terms
- Real-world examples
- Quick summary for revision

---

### 6. 📈 Student Performance Analyzer
| Property     | Details |
|-------------|---------|
| **Kya karta hai** | Marks spreadsheet analyze karke class performance insights deta hai |
| **File chahiye** | `teacher/student_marks.csv` |
| **File type** | CSV ya XLSX — **Direct upload (My Documents NAHI chahiye)** |
| **Upload method** | "Click to upload marks dataset" box mein seedha upload karo |
| **Extra inputs** | Koi nahi |

**AI kya batata hai:**
- Average marks per subject
- Highest & lowest scorers
- Subject-wise class performance
- Strong areas vs weak areas
- Suggestions for improvement

---

## 📤 UPLOAD STEPS — Step by Step

### 📌 PDF / TXT Files (Researcher & Teacher ke liye)

**Step 1:** Login → Dashboard open karo
**Step 2:** Left sidebar mein "My Documents" click karo
**Step 3:** "Upload Document" button click karo
**Step 4:** `demo-files/researcher/` ya `demo-files/teacher/` se file select karo
**Step 5:** Upload complete hone ka wait karo (10-30 seconds)
**Step 6:** Feature page pe jao (e.g., Paper Analyzer)
**Step 7:** Dropdown mein upload ki hui file dikhai degi — select karo
**Step 8:** Extra inputs fill karo (agar koi ho)
**Step 9:** Submit button click karo aur AI result dekho!

---

### 📌 CSV Files (Data Analyzer & Performance Analyzer)

**Step 1:** Feature page pe seedha jao
- Researcher → Data Analyzer
- Teacher → Student Performance Analyzer
**Step 2:** Upload box mein `research_dataset.csv` ya `student_marks.csv` upload karo
**Step 3:** Submit/Analyze button click karo
**Step 4:** AI instantly stats aur insights show karega

---

## ⚠️ Important Notes

| Rule | Details |
|------|---------|
| PDF size | 10MB tak recommended |
| Processing time | Upload ke baad 10-30 sec processing hoti hai |
| Multiple select | CTRL+Click se multiple papers select karo |
| CSV first row | Header row honi chahiye (column names) |
| Language | English mein files best results deti hain |
| Paper Analyzer | Sirf 1 paper select hota hai — comparison nahi |
| Gap Finder | 2+ papers se better gaps milte hain |

---

*Axiom — AI Academic Suite | Final Year Project 2026*
*Generated for Demo Purposes Only*

# 🎬 PROJECT DEMONSTRATION GUIDE
## Smart Research & Learning Assistant
### Complete Answer Script for All 10 Demonstration Points

> This document prepares you to confidently answer every question during your live project demo.
> Read each section, understand it, and practice saying it out loud before the viva.

---

## ✅ POINT 1 — How the System Works

### One-Line Summary (say this first):
> "Our system is a full-stack AI-powered web application where users upload academic documents, and the system uses a RAG (Retrieval-Augmented Generation) pipeline to generate accurate, document-grounded AI responses — without hallucination."

### Detailed Explanation (step by step):

**Step 1 — User Registers and Logs In**
- A new user opens the web app (running at `localhost:80` via Docker)
- They register with their email, password, and select a role: **Student**, **Teacher**, or **Researcher**
- On login, the backend generates a **JWT (JSON Web Token)** which is stored in the browser
- Every subsequent API request carries this JWT in the `Authorization: Bearer <token>` header

**Step 2 — User Uploads a Document**
- The user uploads a file (PDF, DOCX, PPTX, or TXT)
- The backend receives it, saves it to the `/uploads` directory
- The file is parsed: **Apache PDFBox** for PDFs, **Apache POI** for DOCX/PPTX
- Extracted text is saved to MongoDB as metadata
- The text is then passed to the **RAG embedding pipeline**

**Step 3 — RAG Phase 1: Document Embedding**
- LangChain4j splits the text into chunks of **500 tokens with 50-token overlap**
- Each chunk is converted into a **384-dimensional vector** using the `all-minilm-l6-v2` embedding model
- These vectors are stored in **Qdrant** (vector database) along with metadata like documentId and userId

**Step 4 — User Requests an AI Feature**
- User selects their uploaded document and clicks a feature (e.g., "Generate Quiz", "Literature Review")
- The frontend sends a POST request to the appropriate backend endpoint with the documentId

**Step 5 — RAG Phase 2: Retrieval + Generation**
- The backend converts the feature request into a query vector
- Qdrant performs **cosine similarity search** and returns the **top-10 most relevant text chunks**
- These chunks become the **context** for the LLM
- A "Super Prompt" is assembled: System Instructions + User Request + Retrieved Context
- This is sent to the LLM (Groq/Llama-3 or Google Gemini) via LangChain4j

**Step 6 — Output Rendered in React**
- The LLM response is returned as structured text
- The React frontend renders it using **React Markdown** (for formatted text/tables)
- Diagrams are rendered via **Mermaid.js**, charts via **Recharts**

### Why RAG instead of just ChatGPT?
> "If we directly ask ChatGPT about a student's specific textbook chapter, it either doesn't know that content or makes up an answer — that's called hallucination. With RAG, we extract the relevant paragraphs from the actual uploaded document and give them to the LLM as context. The LLM now answers only from the student's document — no guessing, no hallucination."

---

## ✅ POINT 2 — Input Provided to the System

### Types of Input:

#### A. User Authentication Input
| Input | Format | Example |
|-------|--------|---------|
| Email | String | student@college.edu |
| Password | String (BCrypt hashed at backend) | ••••••••• |
| Role | Enum | STUDENT / TEACHER / RESEARCHER |

#### B. Document Upload Input
| Input | Accepted Formats | Max Size |
|-------|-----------------|---------|
| Academic document | PDF, DOCX, PPTX, TXT | 50 MB |

**Example documents used for demo:**
- **Student:** A Physics or ML textbook chapter (PDF)
- **Teacher:** A subject syllabus document (PDF/DOCX)
- **Researcher:** 2–3 academic research papers (PDF)

#### C. Feature Request Input (per role)

**Student inputs:**
- Select document → Click "Summarize" → System generates summary
- Select document → Click "Generate Quiz" → Optionally specify number of questions (default: 10)
- Select document → Click "Flashcards" → System creates term-definition pairs
- Select document → Click "ELI5" → Topic field: e.g., "Explain entropy"
- Select document → Select target language → Click "Translate"

**Teacher inputs:**
- Select syllabus document → Click "Question Paper"
- Specify: Difficulty (Easy / Medium / Hard), Number of questions (10–30), Total marks (25–100)
- Click "Generate" → Complete question paper generated

**Researcher inputs:**
- Upload multiple papers → Click "Literature Review"
- Upload 2 papers → Click "Compare Papers" → Side-by-side comparison generated
- Click "Find Research Gaps" → AI identifies unexplored areas

#### D. API-level Input (for technical explanation)
```
POST /api/student/summarize
Headers: Authorization: Bearer <JWT>
Body: {
  "documentId": "64f3a2b1c9e1234567890abc",
  "featureType": "summarize"
}
```

---

## ✅ POINT 3 — Processing Performed

### Processing has 3 major stages:

---

### Stage 1: Document Processing Pipeline

```
Raw File (PDF/DOCX/PPTX/TXT)
        ↓
[PARSING]
  PDF  → Apache PDFBox → PDDocument.load(file) → stripper.getText()
  DOCX → Apache POI   → new XWPFDocument(stream) → paragraph.getText()
  PPTX → Apache POI   → new XMLSlideShow(stream) → slide.getShapes()
        ↓
[TEXT CLEANING]
  → Whitespace normalization
  → Special character removal
  → Unicode normalization
        ↓
[CHUNKING — LangChain4j]
  → DocumentSplitter: 500 tokens per chunk, 50-token overlap
  → Why overlap? Ensures context is not lost at chunk boundaries
        ↓
[EMBEDDING GENERATION]
  → all-minilm-l6-v2 model converts each chunk → 384-dim float vector
  → Example: "Thermodynamics is..." → [0.023, -0.412, 0.788, ... (384 values)]
        ↓
[QDRANT STORAGE]
  → Stores: { id, vector[384], payload: {chunkText, documentId, userId, chunkIndex} }
  → Collection namespaced by userId: "user_{userId}_documents"
```

---

### Stage 2: Authentication Processing

```
Login Request → {email, password}
        ↓
Spring Security AuthenticationManager.authenticate()
        ↓
BCryptPasswordEncoder.matches(rawPassword, storedHash)
        ↓
If valid → JwtService.generateToken(userDetails)
  Token contains:
    - sub: user email
    - role: ROLE_STUDENT / ROLE_TEACHER / ROLE_RESEARCHER
    - iat: issued at timestamp
    - exp: expiry (24 hours)
        ↓
JWT returned to client → stored in localStorage
```

---

### Stage 3: RAG Query Processing (AI Feature Execution)

```
Feature Request (e.g., "generate_quiz") + documentId
        ↓
[AUTHORIZATION CHECK]
  → JwtAuthFilter decodes JWT → extracts role
  → @PreAuthorize("hasRole('STUDENT')") verified
        ↓
[QUERY EMBEDDING]
  → Feature prompt → all-minilm-l6-v2 → query vector[384]
        ↓
[QDRANT SEMANTIC SEARCH]
  → EmbeddingSearchRequest:
      maxResults: 10
      minScore: 0.6  (cosine similarity threshold)
  → Returns top-10 semantically relevant chunks
        ↓
[PROMPT ASSEMBLY]
  → System Prompt:
      "You are an academic assistant. Answer ONLY from the provided context."
  → User Request: "Generate 10 MCQ questions with answers"
  → Context: [10 retrieved text chunks from document]
  → Combined into final prompt string
        ↓
[LLM API CALL — via LangChain4j]
  → chatModel.generate(finalPrompt)
  → LLM: Groq (Llama-3-70B) or Google Gemini 1.5
  → Response: Structured Markdown text
        ↓
[RESPONSE RETURNED TO FRONTEND]
  → JSON: { "result": "## Quiz\n**Q1.** What is entropy?..." }
```

---

### Processing Summary Table

| Stage | Component | Technology |
|-------|-----------|-----------|
| File Parsing | PDFBox / Apache POI | Java library |
| Text Chunking | DocumentSplitter | LangChain4j |
| Embedding | all-minilm-l6-v2 | LangChain4j + HuggingFace |
| Vector Storage | Qdrant | REST/gRPC |
| Auth Processing | BCrypt + JWT | Spring Security |
| AI Generation | Groq / Gemini | LangChain4j ChatLanguageModel |
| Response Rendering | React Markdown | react-markdown + remark-gfm |

---

## ✅ POINT 4 — Output Generated

### Output per User Role:

---

#### 🎓 Student Role Outputs:

**1. AI Summary**
```
## Chapter Summary: Thermodynamics

**Key Concepts:**
- First Law: Energy cannot be created or destroyed
- Second Law: Entropy of a closed system always increases
- Carnot Cycle: Maximum theoretical efficiency = 1 - (T_cold/T_hot)

**Important Formulas:**
| Formula | Meaning |
|---------|---------|
| ΔU = Q - W | Internal energy change |
| S = k ln(Ω) | Boltzmann's entropy equation |
```

**2. MCQ Quiz**
```
**Q1.** What does the First Law of Thermodynamics state?
A) Energy can be created from nothing
B) Energy cannot be created or destroyed ✓
C) Entropy always decreases
D) Heat always flows from cold to hot

**Q2.** The Carnot efficiency formula is:
A) η = T_hot / T_cold
B) η = 1 - (T_cold / T_hot) ✓
...
```

**3. Flashcards**
```
CARD 1:
Front: What is Entropy?
Back: A measure of disorder or randomness in a thermodynamic system.
      Symbol: S, Unit: J/K

CARD 2:
Front: What is the Zeroth Law of Thermodynamics?
Back: If two systems are each in thermal equilibrium with a third,
      they are in equilibrium with each other.
```

**4. ELI5 Output**
```
Imagine your room is super messy. Thermodynamics says your room
will never clean itself by accident — you have to do work to
clean it. That's entropy! Things naturally go from organized
to messy. The energy you use to clean = the "work" in thermodynamics!
```

**5. Multi-Language Translation**
```
Hindi Translation:
ऊष्मागतिकी का पहला नियम कहता है कि ऊर्जा न तो बनाई जा सकती है
और न ही नष्ट की जा सकती है, केवल एक रूप से दूसरे रूप में
परिवर्तित की जा सकती है...
```

---

#### 👩‍🏫 Teacher Role Outputs:

**Question Paper Generator Output:**
```
UNIVERSITY EXAMINATION — PHYSICS (UNIT 3: THERMODYNAMICS)
Total Marks: 50 | Time: 2 Hours | Difficulty: Medium

SECTION A — Multiple Choice Questions (10 × 1 = 10 Marks)
Q1. The SI unit of entropy is: (a) Joule (b) J/K ✓ (c) Watt (d) Pascal

SECTION B — Short Answer Questions (5 × 4 = 20 Marks)
Q11. Explain the Second Law of Thermodynamics with an example.
Q12. Derive the expression for Carnot efficiency.

SECTION C — Long Answer Questions (2 × 10 = 20 Marks)
Q16. Explain the working of a Carnot heat engine with a neat diagram.
     Derive its efficiency equation. (10 Marks)
```

**Lesson Plan Output:**
```
LESSON PLAN — THERMODYNAMICS (Chapter 5)
Subject: Physics | Duration: 5 Sessions × 50 Minutes

Session 1 Objectives:
  - Understand the concept of a thermodynamic system
  - Define internal energy, heat, and work

Activities:
  - 10 min: Recap of energy conservation
  - 25 min: Lecture with diagrams on P-V graphs
  - 10 min: Numerical problem solving
  - 5 min: Q&A
```

---

#### 🔬 Researcher Role Outputs:

**Literature Review Output:**
```
## Literature Review: Machine Learning in Healthcare

### 1. Background
The application of ML in healthcare has grown significantly since 2015...

### 2. Methodology Comparison
| Paper | Method | Dataset | Accuracy |
|-------|--------|---------|---------|
| Smith et al. 2020 | CNN | CheXpert | 94.2% |
| Jones et al. 2021 | Transformer | MIMIC-III | 91.8% |

### 3. Key Findings
Paper A focuses on image classification...
Paper B addresses NLP-based clinical notes...

### 4. Identified Gaps
- No study has addressed real-time inference on edge devices
- Limited work on multi-modal fusion (image + text)
```

**Research Gap Finder Output:**
```
## Research Gaps Identified

Gap 1: Edge Deployment
→ Current models require high computational resources.
  No paper has proposed a lightweight model for mobile/edge deployment.

Gap 2: Explainability
→ Most studies use black-box models. Explainable AI (XAI)
  integration in clinical ML remains underexplored.

Gap 3: Multilingual Support
→ All reviewed papers work only on English clinical notes.
  Non-English healthcare systems are completely ignored.
```

---

### Output Format Details:
| Output Type | Format | Rendered By |
|-------------|--------|------------|
| Text (summaries, reviews) | Markdown | react-markdown |
| Tables (comparisons) | Markdown tables | remark-gfm |
| Flowcharts / Diagrams | Mermaid syntax | Mermaid.js |
| Analytics charts | JSON data | Recharts |
| Question papers | Structured Markdown | react-markdown |

---

## ✅ POINT 5 — Major Modules

### The system has 6 major modules:

---

### Module 1: Authentication & Authorization Module
**Files:** `AuthController.java`, `AuthService.java`, `JwtService.java`, `JwtAuthFilter.java`, `SecurityConfig.java`

**What it does:**
- Handles user registration and login
- Generates and validates JWT tokens
- Enforces role-based access control on all API endpoints
- Uses BCrypt for password hashing

**Key flow:** Register → Hash Password → Save to MongoDB → Login → Validate → Issue JWT → Every request: Validate JWT → Check Role → Allow/Deny

---

### Module 2: Document Ingestion Module
**Files:** `DocumentController.java`, `DocumentProcessingService.java`, `DocumentRepository.java`

**What it does:**
- Accepts file uploads via REST API
- Routes to the correct parser (PDFBox or POI) based on file extension
- Cleans and prepares extracted text
- Saves file metadata to MongoDB
- Triggers the RAG embedding pipeline

**Supported formats:** PDF, DOCX, PPTX, TXT (max 50MB)

---

### Module 3: RAG Pipeline Module (Core AI Engine)
**Files:** `RagService.java`, `DocumentProcessingService.java`, `LangChainConfig.java`, `QdrantConfig.java`

**What it does:**
- **Embedding Phase:** Chunks text → generates vectors → stores in Qdrant
- **Retrieval Phase:** Embeds query → searches Qdrant → retrieves top-10 chunks
- **Generation Phase:** Assembles super prompt → calls LLM → returns response

**This is the most critical module — it prevents hallucination**

---

### Module 4: AI Features Module (Role-Specific)
**Files:** `StudentFeatureController.java`, `TeacherFeatureController.java`, `ResearcherFeatureController.java`, `LlmGenerationService.java`

**What it does:**

| Role | Features |
|------|---------|
| Student | Summarizer, Quiz Generator, Flashcards, ELI5, Study Notes, Translation |
| Teacher | Question Paper Generator, Lesson Plan Creator, Teaching Material Generator, Performance Analyzer |
| Researcher | Paper Analyzer, Literature Review, Research Gap Finder, Paper Comparison, Citation Extractor |

**Total: 15+ features** — each with a specifically engineered prompt template

---

### Module 5: Frontend & Routing Module
**Files:** `App.jsx`, `Sidebar.jsx`, `DocumentSelect.jsx`, all `*DashboardPage.jsx` files

**What it does:**
- Implements role-based protected routing
- Renders 3 separate dashboards based on JWT role
- Handles document selection, feature triggering, output display
- Renders AI output as formatted Markdown, charts, and diagrams

---

### Module 6: Infrastructure & Containerization Module
**Files:** `docker-compose.yml`, `Dockerfile` (frontend + backend), `.env`

**What it does:**
- Orchestrates 4 Docker containers: Frontend (Nginx), Backend (Spring Boot), MongoDB, Qdrant
- Single command deployment: `docker-compose up -d`
- Environment variables managed via `.env` (API keys, secrets)
- Auto-restart policy on container failure

---

## ✅ POINT 6 — Technologies Used

### Explain each technology + WHY it was used:

---

#### Frontend Technologies:

**React 18 (with Vite)**
- *What:* JavaScript UI library for building component-based web apps
- *Why:* Component reusability across 3 dashboards, fast refresh during development with Vite's HMR (Hot Module Replacement)
- *Where used:* All UI pages, dashboards, components

**Tailwind CSS**
- *What:* Utility-first CSS framework
- *Why:* Rapid styling without writing custom CSS, consistent design system, responsive by default
- *Where used:* All component styling

**Framer Motion**
- *What:* Animation library for React
- *Why:* Smooth page transitions and micro-animations to enhance UX
- *Where used:* Page load animations, button hover effects, modal transitions

**Axios**
- *What:* Promise-based HTTP client for JavaScript
- *Why:* Cleaner API than native fetch, easy JWT header injection via interceptors
- *Where used:* All API calls from frontend to backend

**React Markdown + remark-gfm**
- *What:* Markdown renderer for React
- *Why:* LLM responses come as Markdown text. This renders them as proper HTML with tables, bold, lists
- *Where used:* All AI output display panels

**Recharts**
- *What:* Chart library for React based on D3
- *Why:* Visualize performance analytics data as bar/line charts
- *Where used:* Teacher's Performance Analyzer, analytics sections

**Mermaid.js**
- *What:* Diagram-as-code library (renders flowcharts from text)
- *Why:* AI can generate Mermaid syntax, which we render as actual diagrams in browser
- *Where used:* Research flowchart outputs, system diagram visualization

---

#### Backend Technologies:

**Java 21 (LTS)**
- *What:* Primary backend programming language
- *Why:* Java 21 introduces virtual threads (Project Loom) — critical for handling many concurrent LLM API calls (which are I/O-intensive and blocking) without creating OS threads for each

**Spring Boot 3.3.2**
- *What:* Java backend framework
- *Why:* Production-grade REST API support, built-in DI (Dependency Injection), Spring Security integration, auto-configuration reduces boilerplate
- *Where used:* All REST controllers, service layer, security config

**LangChain4j (v0.32.x)**
- *What:* Java-native LLM integration framework (Java equivalent of Python's LangChain)
- *Why:* Provides ready-made abstractions for RAG pipeline: EmbeddingModel, EmbeddingStore, DocumentSplitter, ChatLanguageModel — eliminates writing boilerplate AI infrastructure code
- *Where used:* RAG pipeline (chunking, embedding, retrieval, LLM calling)

**Apache PDFBox (v3.x)**
- *What:* Java library for reading PDF files
- *Why:* Open-source, reliable, supports text extraction from complex PDFs including multi-column layouts
- *Where used:* DocumentProcessingService — PDF text extraction

**Apache POI (v5.x)**
- *What:* Java library for Microsoft Office files (DOCX, PPTX, XLSX)
- *Why:* The only reliable Java library for parsing Word and PowerPoint files
- *Where used:* DocumentProcessingService — DOCX/PPTX text extraction

**Spring Security + JWT**
- *What:* Security framework + JSON Web Token standard
- *Why:* Industry-standard approach for stateless REST API authentication. JWT allows the backend to be stateless (no server-side sessions needed)
- *Where used:* JwtAuthFilter, SecurityConfig, all protected endpoints

---

#### Database Technologies:

**MongoDB (v7.x)**
- *What:* NoSQL document database
- *Why:* Academic data is schema-flexible (different metadata per document type). MongoDB's JSON-like BSON documents store user profiles and document metadata naturally without rigid schemas. Spring Data MongoDB provides clean repository abstraction.
- *Where used:* User collection, DocumentMetadata collection
- *Collections:* `users`, `document_metadata`

**Qdrant (v1.9.x)**
- *What:* Vector database built specifically for storing and searching high-dimensional vectors
- *Why:* Traditional databases (MySQL, MongoDB) cannot efficiently search 384-dimensional vectors. Qdrant uses HNSW (Hierarchical Navigable Small World) algorithm for approximate nearest neighbor search — extremely fast even with millions of vectors
- *Where used:* Storing document chunk embeddings, semantic similarity search during RAG retrieval

---

#### AI / ML Technologies:

**all-minilm-l6-v2 (Embedding Model)**
- *What:* Sentence transformer model that converts text → 384-dimensional vectors
- *Why:* Lightweight (22M parameters), fast, and high-quality semantic embeddings. Runs locally without GPU.
- *Where used:* Converting document chunks and user queries to vectors

**Groq API (Llama-3-70B)**
- *What:* Cloud API that runs the open-source Llama-3 model at extremely high inference speeds
- *Why:* Free tier available, fastest inference speed (~500 tokens/sec), competitive with GPT-4 quality
- *Where used:* Primary LLM for all AI feature generation

**Google Gemini 1.5 API**
- *What:* Google's multimodal LLM API
- *Why:* Backup LLM provider, extremely long context window (1M tokens), useful for processing very large documents
- *Where used:* Fallback LLM, or when document complexity requires larger context

---

#### DevOps / Infrastructure:

**Docker + Docker Compose**
- *What:* Containerization platform + multi-container orchestration
- *Why:* "Works on my machine" problem eliminated. All 4 services (frontend, backend, MongoDB, Qdrant) are containerized and can be started with a single `docker-compose up -d` command on any machine with Docker installed
- *Where used:* Entire deployment infrastructure

---

## ✅ POINT 7 — Database / Backend

### MongoDB — Primary Database

**Purpose:** Stores user accounts and document metadata

**Collections:**

**1. `users` Collection:**
```json
{
  "_id": "ObjectId('64f3a2b1c9e1234567890abc')",
  "username": "atharv_dhane",
  "email": "atharv@example.com",
  "password": "$2a$10$Xh9K....(BCrypt hash, 60 chars)",
  "role": "ROLE_STUDENT",
  "createdAt": "2025-10-01T10:30:00Z"
}
```

**2. `document_metadata` Collection:**
```json
{
  "_id": "ObjectId('64f3a2b1c9e1234567890def')",
  "userId": "ObjectId('64f3a2b1c9e1234567890abc')",
  "fileName": "Chapter5_Thermodynamics.pdf",
  "filePath": "/uploads/a3f9b2c1-Chapter5_Thermodynamics.pdf",
  "fileType": "PDF",
  "fileSize": 2097152,
  "qdrantCollectionName": "user_64f3a2b1_documents",
  "uploadedAt": "2025-10-01T11:00:00Z",
  "processingStatus": "COMPLETED"
}
```

**Why MongoDB (not MySQL)?**
> "Our document metadata doesn't have a fixed schema — a PDF has different properties than a PPTX. MongoDB's flexible JSON-like documents handle this naturally. Also, Spring Data MongoDB gives us a clean repository interface without writing SQL queries."

---

### Qdrant — Vector Database

**Purpose:** Stores semantic embeddings of document chunks for fast similarity search

**Data Structure (one Qdrant "Point"):**
```json
{
  "id": "uuid-550e8400-e29b-41d4-a716-446655440000",
  "vector": [0.023, -0.412, 0.788, 0.091, ... (384 total dimensions)],
  "payload": {
    "documentId": "64f3a2b1c9e1234567890def",
    "chunkIndex": 12,
    "chunkText": "Thermodynamics is the branch of physics that deals with heat and temperature and their relation to energy, work, radiation, and physical properties of matter...",
    "fileName": "Chapter5_Thermodynamics.pdf",
    "userId": "64f3a2b1c9e1234567890abc"
  }
}
```

**Collection Naming Strategy:**
- Each user gets their own Qdrant collection: `user_{userId}_documents`
- This ensures complete data isolation between users
- A student's documents never interfere with a teacher's documents

**How Similarity Search Works:**
```
Query: "What is entropy?"
  ↓
all-minilm-l6-v2 → query_vector[384]
  ↓
Qdrant: cosine_similarity(query_vector, stored_vectors)
  ↓
Returns top-10 chunks with highest similarity scores (≥ 0.6 threshold)
  ↓
Example matches:
  Score: 0.91 → "Entropy is a measure of disorder in a system..."
  Score: 0.87 → "The Second Law states entropy always increases..."
  Score: 0.82 → "Boltzmann's formula: S = k ln(Ω)..."
```

---

### Backend Architecture (Spring Boot Layers):

```
Controller Layer (REST API endpoints)
  → @RestController, @RequestMapping
  → Handles HTTP requests/responses
  → AuthController, DocumentController, StudentFeatureController,
     TeacherFeatureController, ResearcherFeatureController
        ↓
Service Layer (Business Logic)
  → @Service
  → Core logic, AI orchestration
  → AuthService, DocumentProcessingService, RagService, LlmGenerationService
        ↓
Repository Layer (Data Access)
  → @Repository, extends MongoRepository<T, String>
  → UserRepository, DocumentRepository
        ↓
Model Layer (Domain Entities)
  → @Document (MongoDB) / @Data (Lombok)
  → User.java, DocumentMetadata.java
        ↓
Security Layer
  → JwtAuthFilter, SecurityConfig, JwtService
        ↓
Config Layer
  → LangChainConfig (LLM + embedding setup)
  → QdrantConfig (vector store connection)
```

---

## ✅ POINT 8 — Important Algorithms / Models

### Algorithm 1: RAG (Retrieval-Augmented Generation)

**Type:** Information Retrieval + Generative AI hybrid

**Steps:**
1. **Indexing Phase (offline):** Document → Chunks → Embeddings → Qdrant
2. **Query Phase (online):** User query → Query embedding → ANN Search → Context retrieval → LLM prompt → Response

**Why RAG over fine-tuning?**
> "Fine-tuning an LLM requires expensive GPU compute, thousands of training examples, and retraining whenever documents change. RAG is dynamic — any new document can be uploaded and immediately queried. It's also much cheaper and eliminates hallucination for private documents."

---

### Algorithm 2: Cosine Similarity (Vector Search)

**Used in:** Qdrant semantic search

**Formula:**
```
cosine_similarity(A, B) = (A · B) / (|A| × |B|)

Where:
  A = query vector (384 dimensions)
  B = stored chunk vector (384 dimensions)
  A · B = dot product (sum of element-wise products)
  |A|, |B| = L2 norms (magnitudes) of vectors

Result range: -1 to 1
  1.0 = perfectly identical meaning
  0.0 = completely unrelated
 -1.0 = opposite meaning

Threshold used: minScore = 0.6 (only retrieve chunks with similarity ≥ 0.6)
```

**Why cosine similarity over Euclidean distance?**
> "Cosine similarity measures the angle between vectors, not the magnitude. This means two sentences of different lengths but same meaning score very similarly. For text embeddings, this is more meaningful than raw distance."

---

### Algorithm 3: HNSW (Hierarchical Navigable Small World)

**Used in:** Qdrant's internal vector search algorithm

**What it does:** Finds approximate nearest neighbors in high-dimensional vector space in O(log n) time instead of O(n) brute force

**Why it matters:** A user with 50 uploaded papers might have 50,000+ vector chunks. Brute force search would compare query to all 50,000 vectors. HNSW builds a multi-layer graph and searches logarithmically — results in milliseconds.

---

### Algorithm 4: BPE Tokenization (used by embedding model)

**Used in:** all-minilm-l6-v2 before generating embeddings

**What it does:** Converts text into tokens (subword units). "Thermodynamics" → ["Thermo", "dynamic", "s"]. Handles out-of-vocabulary words by splitting into known subwords.

---

### Algorithm 5: BCrypt Password Hashing

**Used in:** User registration and login

**Properties:**
- Adaptive cost factor (default: 10 rounds) — makes brute-force attacks computationally expensive
- Includes salt automatically — prevents rainbow table attacks
- One-way: cannot reverse the hash to get original password

```java
// Storing password:
passwordEncoder.encode("mypassword123")
// → "$2a$10$Xh9KmQp7LzF3jY4N8vWcIO..."

// Verifying at login:
passwordEncoder.matches("mypassword123", storedHash)
// → true or false
```

---

### Model: all-minilm-l6-v2 (Embedding Model)

| Property | Value |
|----------|-------|
| Architecture | Sentence-BERT (Siamese BERT networks) |
| Parameters | ~22 million |
| Embedding Dimensions | 384 |
| Max Input Length | 256 tokens |
| Trained on | MS MARCO + 1B sentence pairs |
| Performance | Strong performance on semantic textual similarity benchmarks |
| Why chosen | Lightweight (no GPU needed), fast, free, high quality embeddings |

---

### Model: Llama-3-70B (via Groq API)

| Property | Value |
|----------|-------|
| Developer | Meta AI |
| Parameters | 70 Billion |
| Context Window | 8,192 tokens |
| Inference Speed (via Groq) | ~500-600 tokens/second |
| Why chosen | Open-source, high quality, free tier via Groq, fast enough for real-time use |

---

### Model: Google Gemini 1.5 Flash/Pro

| Property | Value |
|----------|-------|
| Developer | Google DeepMind |
| Context Window | Up to 1,000,000 tokens |
| Why chosen | Backup LLM, handles very large documents, multimodal capable |

---

## ✅ POINT 9 — Error Handling

### The system handles errors at multiple layers:

---

### Layer 1: Frontend Error Handling (React)

**Invalid Login:**
```
→ Backend returns: 401 Unauthorized
→ Frontend shows: "Invalid email or password. Please try again."
→ JWT not stored, redirect to login page
```

**Session Expired:**
```
→ Backend returns: 403 Forbidden (JWT expired)
→ Axios interceptor catches 403
→ Auto-redirect to login with message: "Session expired. Please login again."
→ JWT removed from localStorage
```

**File Upload Errors:**
```
→ Unsupported format (.exe, .zip): "Unsupported file format. Upload PDF, DOCX, PPTX, or TXT only."
→ File too large (>50MB): "File size exceeds 50MB limit."
→ Empty file: "Uploaded file is empty or could not be read."
```

**API Failure:**
```
→ Network error / backend down: "Unable to connect. Please try again later."
→ AI response timeout: "AI response is taking longer than expected. Please try again."
```

---

### Layer 2: Backend Error Handling (Spring Boot)

**Global Exception Handler:**
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(403)
               .body(Map.of("error", "Access Denied: Insufficient permissions"));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleFileTooLarge(MaxUploadSizeExceededException e) {
        return ResponseEntity.status(413)
               .body(Map.of("error", "File too large. Maximum size is 50MB."));
    }

    @ExceptionHandler(UnsupportedFileTypeException.class)
    public ResponseEntity<?> handleUnsupportedFile(UnsupportedFileTypeException e) {
        return ResponseEntity.status(400)
               .body(Map.of("error", "Unsupported file type. Allowed: PDF, DOCX, PPTX, TXT"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception e) {
        return ResponseEntity.status(500)
               .body(Map.of("error", "Internal server error. Please contact support."));
    }
}
```

**JWT Validation Errors:**
```
→ Malformed token → 400 Bad Request
→ Expired token → 403 Forbidden
→ Invalid signature → 403 Forbidden
→ Missing token → 401 Unauthorized
```

**Document Processing Errors:**
```
→ Corrupted PDF → PDFBox throws PDFException → Caught → HTTP 422 "Document could not be parsed"
→ Password-protected PDF → Caught → HTTP 422 "Password-protected PDFs are not supported"
→ Empty document → HTTP 400 "Document contains no extractable text"
```

---

### Layer 3: RAG Pipeline Error Handling

**Qdrant Unavailable:**
```
→ QdrantClient throws connection exception
→ Caught in DocumentProcessingService
→ processingStatus set to "FAILED" in MongoDB
→ Error response returned to user: "Vector storage unavailable. Please try again."
```

**LLM API Error:**
```
→ Groq rate limit hit → Switch to Gemini (fallback LLM)
→ Both APIs fail → Return: "AI service temporarily unavailable. Please try again in a moment."
→ Context too long → Reduce top-K from 10 to 5 chunks and retry
```

**Zero Retrieval Results:**
```
→ Qdrant returns 0 chunks (minScore threshold too high for query)
→ System lowers threshold from 0.6 to 0.4 and retries
→ Still zero → Returns: "No relevant content found in the document for this query."
```

---

### Layer 4: Role-Based Access Errors

```
→ Student tries to access /api/teacher/* endpoint
  → @PreAuthorize("hasRole('TEACHER')") fails
  → HTTP 403: "Access Denied: You do not have permission to access this resource."

→ Unauthenticated user accesses any protected endpoint
  → JWT missing → HTTP 401: "Authentication required. Please login."
```

---

### Error Handling Summary Table

| Error Type | Where Caught | Response |
|------------|-------------|---------|
| Wrong password | AuthService | 401 + "Invalid credentials" |
| Expired JWT | JwtAuthFilter | 403 + "Token expired" |
| Wrong role access | Spring Security @PreAuthorize | 403 + "Access Denied" |
| File too large | MultipartResolver | 413 + "File too large" |
| Unsupported file | DocumentProcessingService | 400 + "Unsupported format" |
| Corrupted document | PDFBox/POI catch block | 422 + "Parse failed" |
| Qdrant down | RagService catch block | 503 + "Storage unavailable" |
| LLM API failure | LlmGenerationService | 503 → try fallback LLM |
| No relevant chunks | RagService | 200 + "No relevant content found" |

---

## ✅ POINT 10 — Performance / Results

### Test Results (24/24 Test Cases Passed):

| Test Category | Tests Run | Tests Passed | Pass Rate |
|---------------|-----------|-------------|----------|
| Authentication | 4 | 4 | 100% |
| Document Upload | 5 | 5 | 100% |
| Student AI Features | 5 | 5 | 100% |
| Teacher AI Features | 2 | 2 | 100% |
| Researcher AI Features | 3 | 3 | 100% |
| Security (RBAC) | 2 | 2 | 100% |
| RAG Accuracy | 1 | 1 | 100% |
| Hallucination Prevention | 1 | 1 | 100% |
| System / Docker | 1 | 1 | 100% |
| **TOTAL** | **24** | **24** | **100%** |

---

### Response Time Performance:

| Feature | Document Size | Response Time |
|---------|--------------|---------------|
| AI Summarizer | 20-page PDF | 6–9 seconds |
| MCQ Quiz (10 questions) | 15-page PDF | 8–12 seconds |
| Flashcard Generator | 10-page PDF | 5–8 seconds |
| Question Paper (20 Qs) | 30-page syllabus | 10–15 seconds |
| Literature Review | 3 papers (60 pages total) | 15–25 seconds |
| Research Gap Finder | 2 papers (40 pages total) | 12–18 seconds |
| Translation (Hindi) | 10-page document | 8–12 seconds |

**NFR-01 Target:** All responses < 30 seconds → ✅ Achieved

---

### Concurrent User Performance:

**TC-24: 5 Simultaneous Users Test**
- 5 users simultaneously uploading documents + requesting AI features
- All 5 responses returned within 30 seconds
- No timeouts, no data mixing between users
- ✅ PASSED

**Why Java 21 virtual threads help here:**
> "Traditional Java threads are OS threads — creating 100 threads for 100 concurrent users is expensive. Java 21 virtual threads are lightweight (~few KB each vs ~1MB for OS threads). When one user's request is waiting for the Groq API response (network I/O), the virtual thread parks itself and the carrier thread is freed for another user's request. This gives us much better concurrency for I/O-heavy AI workloads."

---

### RAG Accuracy Performance:

**TC-21: RAG Accuracy Test**
- Uploaded a known document (Chapter on Thermodynamics)
- Asked 10 specific questions about content in the document
- 10/10 answers were accurate and matched actual document content
- ✅ PASSED

**TC-22: Hallucination Prevention Test**
- Asked about "quantum entanglement" when only a Thermodynamics chapter was uploaded
- Expected: System should say "this topic is not in the uploaded document"
- Result: System correctly responded: "The uploaded document does not contain information about quantum entanglement. Please upload a relevant document."
- ✅ PASSED — Zero hallucination

---

### Embedding Quality:

| Metric | Value |
|--------|-------|
| Embedding dimensions | 384 |
| Cosine similarity threshold (retrieval) | ≥ 0.6 |
| Average similarity score for relevant chunks | 0.78–0.91 |
| Chunk size | 500 tokens |
| Chunk overlap | 50 tokens |

---

### System Resource Usage (on recommended hardware):

| Resource | Usage During Normal Operation |
|----------|------------------------------|
| RAM (all 4 Docker containers) | ~3–4 GB |
| CPU (during document embedding) | ~60–80% (brief spike) |
| CPU (during AI response wait) | ~5–10% (network I/O wait) |
| Storage (Docker images + data) | ~8–12 GB |
| Network (per AI request) | ~1–5 KB request, ~2–10 KB response |

---

### Academic Impact / Value Delivered:

| User | Manual Time (Before) | With Our System | Time Saved |
|------|---------------------|----------------|-----------|
| Student (chapter summary) | 45–60 minutes reading | ~10 seconds | ~99% |
| Student (making flashcards) | 30–45 minutes | ~8 seconds | ~99% |
| Teacher (question paper) | 3–5 hours | ~2 minutes | ~97% |
| Teacher (lesson plan) | 1–2 hours | ~1 minute | ~98% |
| Researcher (literature review) | 1–2 weeks | ~20 minutes | ~95% |
| Researcher (research gap analysis) | 3–5 days of reading | ~15 minutes | ~95% |

**Overall estimated workload reduction: 60–70%**

---

## 🎤 QUICK DEMO SCRIPT (for live demo)

### Recommended Demo Order:

**Step 1 (2 min):** Open browser at `localhost:80` → Show Login page → Register as Student → Login → Show JWT stored in browser devtools

**Step 2 (2 min):** Upload a PDF (e.g., an ML textbook chapter from `/demo-files/`) → Show "Processing..." → Show "Upload successful" → Explain what happened in background (PDFBox → LangChain4j → Qdrant)

**Step 3 (3 min):** Go to Summarizer → Select uploaded document → Click Generate → Show AI summary output → Explain RAG pipeline

**Step 4 (2 min):** Go to Quiz Generator → Click Generate → Show 10 MCQs → Explain how questions came from document content, not ChatGPT's training data

**Step 5 (2 min):** Logout → Login as Teacher → Upload Syllabus PDF → Generate Question Paper → Show structured output with sections and marks

**Step 6 (2 min):** Logout → Login as Researcher → Upload 2 research papers → Click Literature Review → Show synthesized review → Click Research Gap Finder

**Step 7 (1 min):** Demonstrate RBAC — While logged in as Student, manually change URL to `/teacher/dashboard` → Show redirect / access denied

**Total Demo Time: ~14–16 minutes**

---

## 💬 EXPECTED EXAMINER QUESTIONS & ANSWERS

**Q: What is RAG? Why not just use ChatGPT directly?**
> "RAG stands for Retrieval-Augmented Generation. When we ask ChatGPT about a student's specific textbook, it either doesn't have that information or generates a hallucinated answer. RAG solves this by extracting the most relevant paragraphs from the actual document and giving them to the LLM as context. The LLM then answers from your specific document — not from its training data. This completely eliminates hallucination for document-specific queries."

**Q: What is a vector database? Why Qdrant?**
> "A vector database stores mathematical representations of text called embeddings. When we search, instead of keyword matching, we search by 'meaning similarity.' Qdrant uses the HNSW algorithm to search millions of vectors in milliseconds. We chose Qdrant because it's open-source, self-hostable (important for privacy), and has an excellent Java client library."

**Q: How does JWT authentication work?**
> "When a user logs in, the backend generates a JWT token which contains the user's email, role, and expiry time — all cryptographically signed with a secret key. This token is sent to the browser and stored. On every subsequent request, the browser sends this token in the Authorization header. Our JWT filter decodes it, verifies the signature, extracts the role, and sets the security context — all without querying the database for every request."

**Q: What is the difference between MongoDB and Qdrant? Why use both?**
> "MongoDB stores structured data — user profiles, document metadata (filename, upload time, processing status). Qdrant stores mathematical vectors — the AI embeddings for fast semantic search. They serve completely different purposes. MongoDB is for data persistence. Qdrant is for semantic search. We cannot do semantic search in MongoDB efficiently, and we don't need MongoDB-style queries in Qdrant."

**Q: How do you prevent one user from accessing another user's documents?**
> "Two-layer isolation. First, JWT authentication ensures only the logged-in user can access their own API endpoints. Second, Qdrant collections are namespaced by userId — 'user_{userId}_documents'. When searching, we only search within the current user's collection. So even if two users upload the same document, their embeddings are in completely separate collections."

**Q: What happens if the Groq API is down?**
> "We have a fallback mechanism. If the primary LLM (Groq/Llama-3) fails, the system automatically retries with Google Gemini. This ensures high availability for AI features. If both fail, an appropriate error message is shown to the user."

**Q: How does chunking work and why is it necessary?**
> "LLMs have a token limit — Llama-3 can process maximum 8,192 tokens at once. A 200-page textbook has hundreds of thousands of tokens. We cannot send the entire book to the LLM. Chunking splits the document into 500-token pieces with 50-token overlap (overlap ensures context isn't lost at chunk boundaries). We then retrieve only the most relevant chunks for any given query — typically top 10 — which fits within the LLM's context window."

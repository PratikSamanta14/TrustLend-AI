# TrustLend-AI

> **AI-powered loan document fairness analyzer for the Indian lending ecosystem**

TrustLend AI is a full-stack web application that helps borrowers understand, audit, and compare loan documents in seconds. It combines OCR document extraction, Retrieval-Augmented Generation (RAG) grounded in actual RBI regulatory texts, and rule-based fairness scoring to produce plain-English verdicts on whether a loan is fair, needs review, or is outright predatory.

---

## Table of Contents

1. [Why TrustLend?](#why-trustlend)
2. [Feature Overview](#feature-overview)
3. [System Architecture](#system-architecture)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Knowledge Base](#knowledge-base)
7. [Backend Deep Dive](#backend-deep-dive)
8. [Frontend Deep Dive](#frontend-deep-dive)
9. [API Reference](#api-reference)
10. [Fairness Scoring Algorithm](#fairness-scoring-algorithm)
11. [RAG Pipeline](#rag-pipeline)
12. [Setup & Installation](#setup--installation)
13. [Environment Variables](#environment-variables)
14. [Running the Application](#running-the-application)
15. [Known Issues & Limitations](#known-issues--limitations)

---

## Why TrustLend?

Millions of Indian borrowers sign loan agreements they do not fully understand. Hidden charges, non-compliant penal interest clauses, and predatory terms buried in legal language cause significant financial harm. At the same time, Indian lending regulations have become substantially stronger — the RBI Fair Practices Code, the 2023 Penal Charges Circular, and the 2024 Key Facts Statement (KFS) mandate — but awareness and enforcement at the individual level remain low.

TrustLend bridges that gap. It reads your loan document so you don't have to decode legalese, checks it against the actual RBI rulebook, and tells you in plain English what is fine, what is risky, and which loan offer is better.

---

## Feature Overview

### Analyze
Upload a loan document (PDF or image). The system:
- Extracts all text via OCR (Tesseract + pdf2image)
- Retrieves the most relevant RBI regulatory passages from the vector store
- Sends the document text + regulatory context to Gemini 2.5 Flash
- Returns a structured breakdown: interest rate, hidden charges, risky clauses, penalty clauses, RBI compliance issues, and a borrower-friendly summary
- Computes a Fairness Score (0–100) with a categorized breakdown

### Compare
Upload two loan documents side-by-side. The system runs both through the full pipeline independently and then produces:
- Side-by-side fairness scores
- A winner verdict (A / B / tie) with score differential
- Up to 5 plain-English sentences explaining the key differences

### AI Chat
An in-app chat interface where users can ask natural-language questions about an uploaded loan document. Quick-question chips cover the most common queries (interest rate, hidden charges, risky clauses, RBI compliance, plain-language summary, penalty clauses).

### Dashboard
A home screen that surfaces recent analysis history, quick-action navigation, and headline statistics (documents analyzed, average fairness score, flags raised, compliance rate).

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BROWSER (React + Vite)                         │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │
│  │  Home    │  │ Analyze  │  │ Compare  │  │  Chat    │  │Dashboard│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────────┘  │
│       │              │              │              │                     │
│       └──────────────┴──────────────┴──────────────┘                   │
│                              │  Axios (REST)                            │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │ HTTP /api/*
┌──────────────────────────────▼──────────────────────────────────────────┐
│                     FLASK BACKEND (Python 3.x)                          │
│                                                                         │
│   ┌─────────────────────┐        ┌──────────────────────┐              │
│   │  Blueprint: analyze │        │  Blueprint: compare  │              │
│   │  POST /api/analyze  │        │  POST /api/compare   │              │
│   └──────────┬──────────┘        └──────────┬───────────┘              │
│              │                              │                           │
│              └──────────────┬───────────────┘                          │
│                             │                                           │
│              ┌──────────────▼──────────────────────┐                   │
│              │         Service Pipeline             │                   │
│              │                                      │                   │
│              │  1. ocr_service.extract_text()       │                   │
│              │     ├─ PDF → pdf2image → Tesseract   │                   │
│              │     └─ PNG/JPG → Pillow → Tesseract  │                   │
│              │                                      │                   │
│              │  2. rag_service.retrieve_with_       │                   │
│              │     citations(text, k=8)             │                   │
│              │     └─ ChromaDB similarity search    │                   │
│              │        (all-MiniLM-L6-v2 embeddings) │                   │
│              │                                      │                   │
│              │  3. llm_service.analyze_loan_terms() │                   │
│              │     └─ Gemini 2.5 Flash              │                   │
│              │        (RAG context + loan text)     │                   │
│              │        → structured JSON             │                   │
│              │                                      │                   │
│              │  4. fairness_service.calculate_      │                   │
│              │     fairness(analysis_data)          │                   │
│              │     └─ rule-based score 0–100        │                   │
│              └─────────────────────────────────────┘                   │
│                                                                         │
│   ┌────────────────────────────────────────────┐                        │
│   │  ChromaDB (persistent local vector store)  │                        │
│   │  Collection: trustlend_kb                  │                        │
│   │  Embedding: all-MiniLM-L6-v2              │                        │
│   │  Chunks: ~800 chars, 120 overlap           │                        │
│   └────────────────────────────────────────────┘                        │
│                                                                         │
│   ┌────────────────────────────────────────────┐                        │
│   │  Knowledge Base (8 RBI/regulatory .txt)   │                        │
│   │  01 RBI Fair Practices Code               │                        │
│   │  02 RBI Penal Charges Circular (2023)     │                        │
│   │  03 RBI KFS Guidelines (2024)             │                        │
│   │  04 India Interest Rate Benchmarks        │                        │
│   │  05 Predatory Clause Glossary             │                        │
│   │  06 NBFC & Digital Lending Guidelines     │                        │
│   │  07 Fair Clause Reference Templates       │                        │
│   │  08 Master Scoring Checklist              │                        │
│   └────────────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Google Gemini API  │
                    │  (gemini-2.5-flash) │
                    └─────────────────────┘
```

### Data Flow — Single Document Analysis

```
User uploads PDF/image
        │
        ▼
Flask saves file to /uploads/
        │
        ▼
ocr_service.extract_text(filepath)
  ├─ PDF: pdf2image converts pages → PIL images → pytesseract
  └─ Image: PIL.Image.open → pytesseract
        │
        ▼ raw text (string)
        │
rag_service.retrieve_with_citations(text, k=8)
  ├─ Truncates to first 2000 chars as query
  ├─ ChromaDB.similarity_search(query, k=8)
  ├─ Deduplicates by first-80-char fingerprint
  └─ Returns (context_string, citations_list)
        │
        ▼ (raw_text + rag_context + citations)
        │
llm_service.analyze_loan_terms(text)
  ├─ Builds prompt with regulatory context injected
  ├─ Calls Gemini 2.5 Flash GenerativeModel
  ├─ Strips markdown fences from response
  ├─ JSON.parse → result dict
  └─ Attaches kb_citations to result
        │
        ▼ analysis dict
        │
fairness_service.calculate_fairness(analysis)
  ├─ Starts at score = 100
  ├─ Deducts for interest rate bands
  ├─ Deducts 20 if hidden charges detected
  ├─ Deducts 5 × (number of penalty clauses)
  ├─ Deducts 10 × (number of risky terms)
  ├─ Clamps to [0, 100]
  └─ Maps to verdict: Fair / Needs Review / Unfair
        │
        ▼
Response JSON:
  { analysis, fairness, filename }
        │
        ▼
React renders ResultsCard + FairnessMeter
```

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Web framework | Flask + Flask-CORS |
| OCR | Tesseract OCR via `pytesseract`, PDF rasterization via `pdf2image` (Poppler) |
| LLM | Google Gemini 2.5 Flash (`google-generativeai`) |
| Embeddings | `all-MiniLM-L6-v2` via `sentence-transformers` + LangChain HuggingFaceEmbeddings |
| Vector store | ChromaDB (persistent local) via `langchain-community` |
| Text splitting | LangChain `RecursiveCharacterTextSplitter` (chunk: 800, overlap: 120) |
| Config | `python-dotenv` |
| WSGI server | Gunicorn (production) |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| Routing | React Router DOM 7 |
| Animation | Framer Motion 12 |
| HTTP client | Axios |
| Icons | Lucide React |
| Charts | Recharts |
| Gemini (client-side) | `@google/generative-ai` SDK (Chat page) |

---

## Project Structure

```
trustlend-ai-premium/
│
├── trustlend-backend/
│   ├── app/
│   │   ├── __init__.py              # Flask app factory, CORS, blueprint registration
│   │   ├── config.py                # Config classes (Dev / Prod), env loading
│   │   ├── routes/
│   │   │   ├── analyze.py           # POST /api/analyze — single document pipeline
│   │   │   └── compare.py           # POST /api/compare — dual document pipeline
│   │   ├── services/
│   │   │   ├── ocr_service.py       # Tesseract + pdf2image text extraction
│   │   │   ├── llm_service.py       # Gemini 2.5 Flash prompt + RAG injection
│   │   │   ├── rag_service.py       # ChromaDB vector store, KB ingestion, retrieval
│   │   │   └── fairness_service.py  # Rule-based fairness scoring (0–100)
│   │   └── utils/
│   │       ├── file_utils.py        # Secure file saving, extension validation
│   │       └── response.py          # Standardized success/error JSON helpers
│   ├── knowledge base/              # Raw RBI regulatory .txt files (8 documents)
│   │   ├── 01_rbi_fair_practices_code.txt
│   │   ├── 02_rbi_penal_charges_2023.txt
│   │   ├── 03_rbi_kfs_guidelines_2024.txt
│   │   ├── 04_interest_rate_benchmarks.txt
│   │   ├── 05_predatory_clause_glossary.txt
│   │   ├── 06_nbfc_digital_lending_guidelines.txt
│   │   ├── 07_fair_clause_templates.txt
│   │   └── 08_master_scoring_checklist.txt
│   ├── uploads/                     # Runtime uploaded documents (gitignored)
│   ├── chroma_db/                   # ChromaDB persistent store (generated, gitignored)
│   ├── ingest_kb.py                 # One-time KB ingestion script
│   ├── run.py                       # Flask entry point
│   ├── requirements.txt
│   ├── .env                         # Secrets (gitignored)
│   └── .gitignore
│
└── trustlend-frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx             # Landing page with animated hero, stats, features
    │   │   ├── Analyze.jsx          # Single document upload + results view
    │   │   ├── Compare.jsx          # Dual document comparison view
    │   │   ├── Chat.jsx             # AI chat interface with document context
    │   │   └── Dashboard.jsx        # Overview with recent docs and quick actions
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── FileUpload.jsx   # Drag-and-drop file picker
    │   │   │   ├── ResultsCard.jsx  # Tabbed analysis output card
    │   │   │   └── FairnessMeter.jsx# Animated circular fairness gauge
    │   │   └── layout/
    │   │       ├── AppLayout.jsx    # Shell with sidebar + main content
    │   │       ├── Navbar.jsx       # Top navigation bar
    │   │       └── Sidebar.jsx      # Collapsible side navigation
    │   ├── hooks/
    │   │   └── useTheme.js          # Dark/light theme toggle with localStorage
    │   ├── services/
    │   │   └── api.js               # Axios wrapper for /api/analyze and /api/compare
    │   ├── styles/
    │   │   └── globals.css          # CSS custom properties, theming, typography
    │   ├── App.jsx                  # Router setup, AnimatePresence page transitions
    │   └── main.jsx                 # React DOM entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Knowledge Base

The RAG system is grounded in eight curated regulatory documents stored in `trustlend-backend/knowledge base/`. These are ingested once into ChromaDB using `ingest_kb.py`.

| File | Content |
|---|---|
| `01_rbi_fair_practices_code.txt` | RBI Fair Practices Code (2003) — core borrower protection principles |
| `02_rbi_penal_charges_2023.txt` | RBI Penal Charges Circular (Aug 2023) — ban on capitalizing penal interest |
| `03_rbi_kfs_guidelines_2024.txt` | RBI KFS Guidelines (Apr 2024) — mandatory Key Facts Statement from Oct 2024 |
| `04_interest_rate_benchmarks.txt` | Indian interest rate benchmarks (personal loan, home loan, NBFC, microfinance) |
| `05_predatory_clause_glossary.txt` | Glossary of predatory clauses: balloon payments, cross-default, mandatory arbitration, etc. |
| `06_nbfc_digital_lending_guidelines.txt` | NBFC and digital lending platform-specific guidelines |
| `07_fair_clause_templates.txt` | Reference templates for compliant, borrower-fair contract clauses |
| `08_master_scoring_checklist.txt` | Synthesized master scoring guide derived from all circulars |

Each document is split into ~800-character chunks with 120-character overlap using `RecursiveCharacterTextSplitter`. Every chunk is embedded with `all-MiniLM-L6-v2` and stored in ChromaDB with metadata (`source`, `label`, `chunk_index`).

---

## Backend Deep Dive

### `ocr_service.py`

Handles text extraction from both PDF and image inputs.

- **PDFs**: converted page-by-page to PIL images via `pdf2image` (which wraps Poppler), then each page image is run through `pytesseract.image_to_string()`. Output is concatenated with page separators (`--- Page N ---`).
- **Images** (PNG/JPG/JPEG): opened directly with `PIL.Image.open()`, then run through Tesseract.
- Supports optional `TESSERACT_CMD` and `POPPLER_PATH` environment variables for Windows compatibility.

### `rag_service.py`

Manages the full lifecycle of the knowledge base vector store.

**Ingestion** (`build_knowledge_base()`):
1. Reads all `.txt` files from `knowledge_base/`
2. Splits each into overlapping chunks
3. Embeds with `all-MiniLM-L6-v2` (downloaded on first run, ~90 MB)
4. Writes to ChromaDB at `chroma_db/`

**Retrieval** (`retrieve_with_citations(loan_text, k=8)`):
1. Truncates loan text to 2000 characters as the similarity query
2. Calls `ChromaDB.similarity_search(query, k=8)`
3. Deduplicates results by an 80-character prefix fingerprint
4. Returns a formatted context string and a structured citations list (source file, label, excerpt)

Singletons (`_embeddings`, `_vectorstore`) are cached in module-level globals to avoid reloading the embedding model on every request.

### `llm_service.py`

Orchestrates the Gemini 2.5 Flash call.

1. Calls `retrieve_with_citations()` to get RAG context
2. Constructs a detailed system prompt that:
   - Provides the regulatory context block
   - Specifies interest rate benchmark comparisons by loan type
   - Requires `KB ref:` citations in every finding
   - Mandates detection of KFS/APR disclosure and post-2024 non-compliant penal interest
   - Strictly specifies the output JSON schema
3. Passes up to 30,000 characters of the extracted loan text
4. Strips markdown fences from the response and parses JSON
5. Attaches the RAG `kb_citations` list to the result dict

The fallback response on any error returns a safe structure with `"fallback": true`, preventing crashes downstream.

### `fairness_service.py`

Pure rule-based scoring, no AI involved.

| Check | Deduction |
|---|---|
| Interest rate > 30% | −40 |
| Interest rate > 20% | −20 |
| Interest rate > 15% | −10 |
| Hidden charges detected | −20 |
| Each penalty clause | −5 |
| Each risky term | −10 |

Score is clamped to `[0, 100]`. Verdicts: **Fair** (≥ 80), **Needs Review** (50–79), **Unfair** (< 50).

### `compare.py`

Runs the full pipeline (OCR → RAG → LLM → Fairness) independently on two uploaded documents. The `_build_verdict()` function:
- Declares a tie if score difference ≤ 3
- Otherwise declares the higher-scoring loan the winner
- `_diff_sentences()` generates up to 5 structured comparison sentences covering interest rate, hidden charges, risky term count, penalty clause count, RBI violation count, and tenure

---

## Frontend Deep Dive

### Routing

React Router DOM 7 handles five routes:

| Path | Page | Purpose |
|---|---|---|
| `/` | `Home` | Animated landing page |
| `/analyze` | `Analyze` | Single document upload and analysis |
| `/compare` | `Compare` | Side-by-side loan comparison |
| `/chat` | `Chat` | AI chat with document context |
| `/dashboard` | `Dashboard` | Analytics overview |

All routes are wrapped in `AnimatePresence` + `PageWrapper` for smooth fade/slide transitions via Framer Motion.

### Theming

`useTheme.js` persists dark/light preference to `localStorage` and sets `data-theme` on `<html>`. All colors are defined as CSS custom properties in `styles/globals.css` and consumed throughout — no hardcoded hex values in components. The palette centers on cyan (`--accent-cyan`) and purple (`--accent-purple`) accents on glassmorphism surfaces.

### Key Components

**`FileUpload.jsx`** — Drag-and-drop zone that accepts PDF, PNG, and JPG. Shows file name and size after selection. Validates file type client-side before submission.

**`ResultsCard.jsx`** — Tabbed card that presents the full analysis output. Tabs cover: Overview, Hidden Charges, Penalty Clauses, Risky Terms, RBI Compliance, and KB Citations. Each tab renders its list with color-coded severity indicators.

**`FairnessMeter.jsx`** — Animated circular arc gauge. Animates from 0 to the final score on mount using a requestAnimationFrame loop. Color transitions from red (Unfair) through amber (Needs Review) to green (Fair) based on score thresholds.

**`Chat.jsx`** — Chat interface with message history, typing indicator (three bouncing dots), quick-question chips, and optional document attachment. Sends the current conversation to Gemini client-side via the `@google/generative-ai` SDK when no document is attached; routes through the backend `/api/analyze` pipeline when a document is provided.

---

## API Reference

Base URL: `http://localhost:5000`

### `GET /health`

Health check.

**Response:**
```json
{ "status": "healthy" }
```

---

### `POST /api/analyze`

Analyze a single loan document.

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | file | PDF or image (PNG/JPG). Max 16 MB. |

**Response (success):**
```json
{
  "status": "success",
  "data": {
    "filename": "SECURED_MICROFINANCE_TERM_LOAN_AGREEMENT.pdf",
    "analysis": {
      "interest_rate": 24.0,
      "loan_amount": 50000.0,
      "tenure_months": 24,
      "hidden_charges_detected": true,
      "hidden_charges_details": [
        "Processing fee 3% not disclosed upfront [KB ref: RBI KFS Guidelines 2024]"
      ],
      "penalty_clauses": [
        "2% per month penal interest added to EMI [KB ref: RBI Penal Charges Circular Aug 2023]"
      ],
      "risky_terms": [
        "Mandatory arbitration clause waiving borrower's right to civil court [KB ref: Predatory Clause Glossary]"
      ],
      "rbi_compliance_issues": [
        "No KFS / APR disclosure found — mandatory from Oct 2024 [KB ref: RBI KFS Guidelines Apr 2024]"
      ],
      "summary": "This microfinance loan carries a 24% interest rate ...",
      "kb_citations": [
        {
          "source_file": "02_rbi_penal_charges_2023.txt",
          "source_label": "RBI Penal Charges Circular (Aug 2023)",
          "excerpt": "Penal charges must NOT be capitalised or added to the outstanding loan amount..."
        }
      ]
    },
    "fairness": {
      "score": 30,
      "verdict": "Unfair",
      "breakdown": [
        "High interest rate (24%): -20",
        "Hidden or excessive charges detected: -20",
        "2 penalty clauses found: -10",
        "2 risky terms found: -20"
      ]
    }
  },
  "message": "Document analyzed successfully"
}
```

---

### `POST /api/compare`

Compare two loan documents.

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file_a` | file | First loan document |
| `file_b` | file | Second loan document |

**Response (success):**
```json
{
  "status": "success",
  "data": {
    "loan_a": { "filename": "...", "analysis": {...}, "fairness": {...} },
    "loan_b": { "filename": "...", "analysis": {...}, "fairness": {...} },
    "verdict": {
      "winner": "B",
      "winner_label": "LoanOffer_Finserv.pdf",
      "score_diff": 23,
      "key_differences": [
        "[B] Loan B has a lower interest rate (14% vs 24%).",
        "[B] Loan B has no hidden charges detected, while the other does.",
        "[B] Loan B has fewer risky clauses (0 vs 2)."
      ]
    }
  },
  "message": "Comparison complete."
}
```

---

## Fairness Scoring Algorithm

```
score = 100

IF interest_rate > 30%  →  score -= 40
ELIF interest_rate > 20%  →  score -= 20
ELIF interest_rate > 15%  →  score -= 10

IF hidden_charges_detected  →  score -= 20

FOR each penalty_clause:  score -= 5

FOR each risky_term:  score -= 10

score = max(0, score)

IF score >= 80   →  verdict = "Fair"
IF score >= 50   →  verdict = "Needs Review"
IF score <  50   →  verdict = "Unfair"
```

The scoring logic is intentionally deterministic and auditable — it runs independently from the LLM, so even if Gemini produces an unusually generous analysis, the scoring reflects objective counts of flagged issues.

---

## RAG Pipeline

```
[Knowledge Base .txt files]
          │
          │  ingest_kb.py (run once)
          ▼
RecursiveCharacterTextSplitter
  chunk_size=800, chunk_overlap=120
          │
          ▼
HuggingFaceEmbeddings (all-MiniLM-L6-v2)
  normalize_embeddings=True, device=cpu
          │
          ▼
ChromaDB (collection: trustlend_kb)
  persisted at: trustlend-backend/chroma_db/
          │
          │  At inference time
          ▼
retrieve_with_citations(loan_text, k=8)
  query = loan_text[:2000]
  docs = db.similarity_search(query, k=8)
  dedup by 80-char prefix
          │
          ▼
context_string + citations_list
          │
          ▼
Injected into Gemini prompt as
"REGULATORY REFERENCE CONTEXT" block
```

The RAG layer ensures that Gemini's findings are grounded in actual RBI text rather than general training knowledge, which may be outdated or inaccurate for India-specific regulations. Every flagged issue in the LLM output is expected to carry a `[KB ref: ...]` suffix pointing back to the specific regulatory source.

---

## Setup & Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- Tesseract OCR installed on system
- Poppler utilities (for PDF rasterization)

**Install Tesseract:**
```bash
# Ubuntu / Debian
sudo apt install tesseract-ocr

# macOS
brew install tesseract

# Windows: download installer from https://github.com/UB-Mannheim/tesseract/wiki
```

**Install Poppler:**
```bash
# Ubuntu / Debian
sudo apt install poppler-utils

# macOS
brew install poppler

# Windows: download binaries and set POPPLER_PATH in .env
```

### Backend Setup

```bash
cd trustlend-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Rename knowledge base folder (remove space if present)
mv "knowledge base" knowledge_base

# Ingest the knowledge base into ChromaDB (run ONCE)
# First run downloads the all-MiniLM-L6-v2 model (~90 MB)
python ingest_kb.py
```

### Frontend Setup

```bash
cd trustlend-frontend

npm install
```

---

## Environment Variables

Create `trustlend-backend/.env`:

```env
# Required
GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional — Flask
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# Optional — Windows only
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
POPPLER_PATH=C:/poppler/bin
```

Get a Gemini API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

---

## Running the Application

### Start the Backend

```bash
cd trustlend-backend
source venv/bin/activate

# Development
python run.py

# Production (with Gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

The Flask server starts on `http://localhost:5000`.

### Start the Frontend

```bash
cd trustlend-frontend
npm run dev
```

The Vite dev server starts on `http://localhost:5173`. API calls are proxied to `localhost:5000` through Axios's `baseURL: '/api'`.

> **Note:** Ensure the Vite config proxies `/api` to Flask:
> ```js
> // vite.config.js
> server: {
>   proxy: {
>     '/api': 'http://localhost:5000'
>   }
> }
> ```

---

## Known Issues & Limitations

### Field Name Mismatch (Frontend ↔ Backend — Compare Route)

The frontend `api.js` sends compare files as `file1` and `file2`:
```js
form.append('file1', file1);
form.append('file2', file2);
```

But the backend `compare.py` expects `file_a` and `file_b`:
```python
if 'file_a' not in request.files or 'file_b' not in request.files:
```

**Fix:** Update `api.js` to use `file_a` / `file_b`, or update the backend to accept `file1` / `file2`.

### Security Gaps in the Prototype

- The backend does not enforce authentication on any endpoint. Any client can submit documents.
- Uploaded files are stored without name sanitization beyond extension checking. Production deployments should use `werkzeug.utils.secure_filename` and store files in a non-web-accessible path.
- The `GEMINI_API_KEY` is used only server-side, which is correct. Do not expose it in the frontend environment.
- The `chroma_db/` and `uploads/` directories should be excluded from version control (already in `.gitignore`).

### OCR Quality

OCR accuracy depends on document scan quality. Handwritten documents, low-resolution scans, or documents with complex multi-column layouts may yield degraded text and consequently lower analysis accuracy. Consider pre-processing images (deskew, denoise, binarize) for production use.

### Knowledge Base Folder Name

The included folder is named `knowledge base` (with a space). The `rag_service.py` and `ingest_kb.py` both reference `knowledge_base` (with an underscore). Rename the folder before running ingestion:
```bash
mv "knowledge base" knowledge_base
```

### ChromaDB Persistence

After running `ingest_kb.py`, the `chroma_db/` folder must be present for the RAG layer to function. If it is missing or corrupted, re-run `python ingest_kb.py`. The first run also downloads the `all-MiniLM-L6-v2` embedding model (~90 MB) from Hugging Face.

### RAG Disabled Gracefully

If ChromaDB is unavailable at startup (e.g., first run before ingestion), `rag_service` import fails silently and `RAG_ENABLED = False` is set in `llm_service.py`. Analysis will still work but without regulatory grounding — findings will rely solely on Gemini's training knowledge.

---

## License

This project is a portfolio / research prototype built for the Indian lending context. It is not a substitute for professional legal or financial advice. Always consult a qualified financial advisor before signing any loan agreement.
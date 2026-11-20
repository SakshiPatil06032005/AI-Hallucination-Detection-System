# AI-Powered Hallucination Detection & Fact Verification System

An evidence-based AI system that detects hallucinations in AI-generated content by extracting factual claims, retrieving relevant evidence, and verifying claims using Large Language Models (LLMs).

## Overview

The AI Hallucination Detection System analyzes user-provided text, breaks it into individual factual claims, and verifies each claim against evidence retrieved from a local knowledge base and web search.

Powered by Google's Gemini API, the system provides claim-level verdicts, confidence estimates, hallucination risk scores, explanations, and supporting or contradicting sources.

## Key Features

- **Claim Extraction:** Extracts individual factual claims from user-provided content using Gemini.
- **Evidence-Based Verification:** Validates claims against retrieved supporting and contradicting evidence.
- **Hybrid Search:** Combines Gemini embeddings, cosine similarity, BM25-style keyword ranking, and Reciprocal Rank Fusion (RRF).
- **Web Search Integration:** Discovers relevant evidence dynamically using DuckDuckGo.
- **Multilingual Support:** Supports English, Hindi, and Marathi.
- **Claim-Level Analysis:** Provides verdicts, confidence scores, risk assessments, and explanations for individual claims.
- **Source Citations:** Displays evidence with source metadata and clickable URLs.
- **Analysis History:** Stores private analysis history using SQLite and SQLAlchemy.
- **PDF Reports:** Generates downloadable analysis reports.
- **Interactive Dashboard:** Displays analysis results, analytics, and evidence through a responsive interface.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript |
| Backend | Python, FastAPI |
| AI / LLM | Google Gemini API |
| Embeddings | Gemini Embeddings |
| Retrieval | Cosine Similarity, BM25, RRF |
| Database | SQLite, SQLAlchemy |
| Validation | Pydantic |
| APIs | REST APIs |
| Web Search | DuckDuckGo / DDGS |
| Testing | Pytest, Vitest, React Testing Library |

## System Architecture

1. **User Input:** User submits text or a document through the React interface.
2. **Claim Extraction:** Gemini identifies independently verifiable factual claims.
3. **Evidence Retrieval:** The backend retrieves relevant information from the local knowledge base and web search.
4. **Hybrid Ranking:** Semantic and keyword search results are combined using Reciprocal Rank Fusion.
5. **Fact Verification:** Gemini evaluates each claim against the retrieved evidence.
6. **Risk Assessment:** The system generates verdicts, confidence estimates, hallucination risk scores, and explanations.
7. **Result Visualization:** React displays claim-level analysis, evidence, citations, and downloadable reports.

## Project Structure

The following is a suggested structure. Adjust it to match your actual folders.

```text
AI-Hallucination-Detector/
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
├── .gitignore
└── .env.example
```

## Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git
- Google Gemini API Key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Hallucination-Detector
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Activate the virtual environment:

**Windows:**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and configure your API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI server using the actual entry-point module in your project. For example:

```bash
uvicorn main:app --reload
```

Backend documentation (when running):

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL displayed in your terminal.

> Configure the frontend API base URL to point to your running FastAPI backend.

## Testing

Backend tests:

```bash
pytest
```

Frontend tests:

```bash
npm test
```

Use the test scripts defined in your actual `package.json`.

## Security

- Store API keys in environment variables.
- Never commit `.env` files or secret credentials.
- Keep private analysis history protected.
- Use `.env.example` to document required configuration variables without exposing secrets.

## Future Improvements

- Expand the knowledge base and evidence sources.
- Improve evidence ranking and verification accuracy.
- Add support for more languages.
- Optimize retrieval and claim verification performance.
- Deploy the application for public access.

## Author

**Sakshi Patil**

Computer Engineering | AI & Machine Learning

Government College of Engineering, Jalgaon


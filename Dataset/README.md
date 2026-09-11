# 📊 FitBuddy Knowledge Base & Data Directory

This directory outlines the datasets and reference documents utilized to power the **FitBuddy Retrieval-Augmented Generation (RAG)** vector database. The knowledge base comprises over **3,200 curated chunks** spanning exercise biomechanics, dietary calories, structured workout programs, and general fitness FAQs.

---

## 📂 Data Sources & Components

| Dataset / File | Format | Approximate Chunks / Rows | Description |
| :--- | :---: | :---: | :--- |
| **`megaGymDataset.csv`** | CSV | 2,918 items | Comprehensive exercise directory detailing workout titles, target body parts, equipment requirements, execution steps, and difficulty levels. |
| **`fitness_faq.csv`** | CSV | ~30 items | Frequently asked questions addressing common workout queries, recovery, and form corrections. |
| **`thai_food_calories.csv`** | CSV | ~30 items | Nutritional breakdown and caloric estimates for common Thai street food and daily meals. |
| **`workout_programs.csv`** | CSV | ~30 items | Structured training splits (e.g., Push/Pull/Legs, Full-Body, Upper/Lower). |
| **`Calories.pdf`** | PDF | ~100 chunks | Reference document detailing caloric expenditure, basal metabolic rate (BMR), and macronutrient tracking. |
| **`document.pdf`** | PDF | ~111 chunks | Supplementary exercise physiology and anatomical movement principles. |

---

## 🧹 Data Cleaning & Pre-processing Pipeline

The ingestion pipeline (implemented in `FitBuddy_Final.ipynb`) applies systematic transformation steps:

1. **Exercise Data Sanitization (`megaGymDataset.csv`)**:
   - Dropped non-informative columns (e.g., `Rating`, `RatingDesc`).
   - Imputed missing attributes (`Equipment` defaulted to *'Body Only'*, missing descriptions filled with placeholders).
   - **Bilingual Anatomical Mapping**: Mapped standard English anatomical terms (`Lats`, `Quadriceps`, `Hamstrings`, etc.) into localized Thai descriptions to optimize semantic retrieval accuracy for Thai user queries.
   - Converted records into structured `langchain_core.documents.Document` instances with metadata tagging.

2. **FAQ & Nutrition Tabular Ingestion**:
   - Loaded using `CSVLoader` with UTF-8 encoding.
   - Transformed row-by-row into independent documents for precise chunk-level indexing.

3. **PDF Parsing & Text Chunking**:
   - Ingested using `PyPDFLoader`.
   - Chunked via `RecursiveCharacterTextSplitter` with:
     - `chunk_size = 700` characters
     - `chunk_overlap = 100` characters
   - Preserves semantic boundary continuity across multi-page fitness guides.

---

## ⚡ Vector Storage & Embedding Setup

- **Embedding Model**: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (50-layer multilingual mapping, optimized for mixed Thai/English queries).
- **Vector Store**: **FAISS (Facebook AI Similarity Search)** in-memory vector index.
- **Retrieval Strategy**: Top-$k$ similarity search ($k = 6$) feeding retrieved contexts directly into the RAG Prompt Template.

---

> **Note**: For copyright and repository size considerations, original large-scale raw data files may be excluded from version control. Sample records and pre-processing scripts are provided to reproduce the pipeline.
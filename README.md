# 🧠 GK Daily Insight Hub – Backend

This is the backend service for **GK Daily Insight Hub**, a full-stack AI-powered platform that fetches daily Indian news, summarizes it for UPSC aspirants, and stores the output in Supabase. The backend scrapes top news articles via RSS, summarizes them using Hugging Face models, and saves them to a Supabase table for frontend display.

---

## 🚀 Features

- 📥 Fetches daily articles from top Indian newspapers (e.g. *The Hindu*, *Indian Express*)
- 🤖 Summarizes using Hugging Face’s `bart-large-cnn` model
- 🗃️ Stores data in **Supabase** (`summaries` table)
- 🔒 Uses Supabase Service Role Key for secure DB access
- 🕒 Supports scheduled ingestion with **Railway Cron** or Supabase Scheduler
- 🌐 Exposes a minimal Express API (`GET /ingest`) for manual trigger

---

## 🧱 Tech Stack

- **Node.js** + **Express**
- **Supabase** (PostgreSQL + Auth)
- **Hugging Face LLM's and Groq Cloud API's**
- **RSS Parser** + `node-readability` for web scraping
- **Railway** for deployment + cron automation

---

## 📦 Installation

```bash
git clone https://github.com/VarunYenni/gk-insights-backend
cd gk-insight-backend
npm install
# 🚀 Unified AI Suite

![Next.js](https://img.shields.io/badge/Next.js-16.1.7-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)

A powerful, 4-in-1 AI productivity suite built with Next.js App Router, Tailwind CSS, and Supabase. Designed to supercharge your career and content consumption.

🔗 **[Live Demo: ai-resume-maker-one.vercel.app](https://ai-resume-maker-one.vercel.app)**

## ✨ Features

1. **📄 AI Resume Builder**
   - Fill out an intuitive form and let our AI generate professional bullet points.
   - Instantly export your tailored resume.
2. **📺 YouTube AI Summarizer**
   - Skip the fluff. Paste any YouTube URL and get a beautifully formatted Executive Overview, coupled with Key Takeaways (powered by Groq/Llama-3).
3. **💼 AI Job Search**
   - Automatically scrape current job listings using Firecrawl and match them instantly against your skills.
4. **📝 Cloud Notes Saver**
   - A highly secure, cloud-synced markdown editor to organize your ideas, backed by Supabase Row Level Security (RLS).

## 🛠️ Tech Stack & Integrations

- **Frontend:** Next.js 16, React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend/Database:** Supabase (PostgreSQL), Supabase Auth.
- **Authentication:** NextAuth.js (Google OAuth).
- **AI/APIs:** Groq (`llama-3.3-70b-versatile`), Firecrawl (Web Scraping).
- **Deployment:** Vercel.

## 🚀 Getting Started Locally

### 1. Clone & Install
```bash
git clone https://github.com/akshayaakshu2383-ai/ai-resume-maker.git
cd ai-resume-maker
npm install
```

### 2. Environment Variables
Create a `.env.local` file with the following keys:
```env
# AI & Scraping
AI_API_KEY="your_groq_api_key"
AI_MODEL="llama-3.3-70b-versatile"
FIRECRAWL_API_KEY="your_firecrawl_api_key"

# NextAuth & Google 
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_SECRET="random_32_char_string"
NEXTAUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### 3. Supabase Schema
Before running the app, ensure your Supabase SQL Editor has the necessary tables configured:
```sql
-- Create Notes Table & Enable RLS
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes" ON notes FOR ALL USING (auth.uid()::text = user_id::text);

-- Do the same for `resumes` and `profiles` tables.
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

# 🎓 RAG-Based AI Agent for UIU Students

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-blue" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen" />
  <img src="https://img.shields.io/badge/RAG-FAISS-orange" />
  <img src="https://img.shields.io/badge/LLM-GPT--4o--mini-purple" />
</p>

## 🌐 Repository

**GitHub Repository:**
[uiuBot Repository](https://github.com/SayeebMahir/uiuBot?utm_source=chatgpt.com)

---

## 📖 Project Overview

Students frequently spend a significant amount of time searching through university websites, notices, policies, and academic resources to find answers regarding scholarships, tuition waivers, courses, faculty members, admissions, academic regulations, and other university services.

The **RAG-Based AI Agent for UIU Students** is an intelligent university assistant designed to simplify this process through conversational AI. Instead of manually navigating multiple webpages, students can ask questions in natural language and receive accurate, context-aware responses instantly.

The system leverages **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from United International University (UIU) web resources and other trusted university-related online sources. The retrieved information is then provided to **GPT-4o Mini**, which generates a clear, human-friendly response grounded in the retrieved context.

This approach significantly reduces information retrieval time while improving accessibility and user experience for students.

---

## 🎯 Objectives

The primary objectives of this project are:

* Provide instant access to university-related information
* Reduce the time spent searching through websites
* Improve accessibility of academic resources
* Deliver accurate responses using Retrieval-Augmented Generation (RAG)
* Minimize AI hallucinations through context-grounded generation
* Create a centralized AI assistant for UIU students

---

## ✨ Key Features

### 🤖 Intelligent University Assistant

* Natural language conversation
* Context-aware responses
* Student-friendly explanations

### 📚 Retrieval-Augmented Generation (RAG)

* Retrieves relevant information before generating answers
* Reduces hallucination compared to traditional chatbots
* Generates responses grounded in university resources

### 🎓 University Information Support

The chatbot can answer questions regarding:

* Scholarships
* Tuition Waivers
* Admissions
* Faculty Members
* Academic Regulations
* Course Information
* Departments
* Academic Calendar
* Student Services
* University Policies

### 🔍 Semantic Search

* Understands user intent
* Retrieves information beyond exact keyword matching
* Improves search relevance using vector embeddings

### 🔐 Secure User Authentication

* JWT Authentication
* Email OTP Verification
* Two-Factor Authentication (2FA)
* HTTP-only Secure Cookies

---

## 🏗️ System Architecture

```text
User Question
      │
      ▼
React Frontend
      │
      ▼
Node.js + Express Backend
      │
      ▼
Query Embedding
      │
      ▼
FAISS Vector Database
      │
      ▼
Relevant Document Retrieval
(UIU Website + University Sources)
      │
      ▼
Context Construction
      │
      ▼
GPT-4o Mini
      │
      ▼
Generated Response
      │
      ▼
Student
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication & Security

* JWT Authentication
* Email OTP Verification
* Two-Factor Authentication (2FA)
* Helmet
* Rate Limiting
* Secure Cookies
* CORS Protection

### AI Components

* OpenAI GPT-4o Mini
* Retrieval-Augmented Generation (RAG)
* FAISS Vector Store
* Semantic Search
* Document Chunking
* Embedding-Based Retrieval

### Data Sources

* United International University (UIU) Website
* University Notices
* Academic Information Pages
* Scholarship and Waiver Information
* Faculty Information Pages
* Other Trusted University Resources

---

## 🔄 RAG Pipeline

1. User submits a question.
2. Query is converted into embeddings.
3. FAISS performs similarity search.
4. Relevant university information is retrieved.
5. Retrieved context is combined with the user query.
6. GPT-4o Mini generates a grounded response.
7. Final answer is presented to the student.

This pipeline ensures that answers are based on actual university information rather than relying solely on the language model's internal knowledge.

---

## 🚀 Future Enhancements

* Automatic UIU website crawling
* Real-time university notice updates
* Source citation display
* Bengali language support
* Voice-based interaction
* Personalized student dashboard
* Course recommendation system
* Academic advisor assistant
* Multi-university support

---

## 👨‍💻 Developed By

**Sayeeb Mahir**

Department of Computer Science & Engineering (CSE)

United International University (UIU)

Bangladesh

---

## ⭐ Project Vision

To build a reliable AI-powered university assistant that enables students to access accurate academic and administrative information instantly, improving productivity, accessibility, and the overall student experience.

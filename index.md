# My 2026 Dev Setup: The "Smart Monolith" Environment
> **Location:** WSL 2 (Ubuntu) on Windows 11  
> **Focus:** Data Science, ML Ops, and Scalable Backends

## 🚀 The Philosophy
As I move through my Master’s in Data Science and handle **7+ active repositories** this year, I've shifted away from over-engineered microservices. I now focus on **Smart Architecture**: high-performance modular systems that are easy to maintain but ready to scale.

---

## 💻 Hardware & OS
- **OS:** Windows 11 with **WSL 2 (Ubuntu)** integration.
- **Why WSL 2?** It provides a native Linux kernel for Docker and high-performance I/O, which is critical for fine-tuning BERT models and handling large SQL datasets.

---

## 🛠️ The Tech Stack
| Category | Tools |
| :--- | :--- |
| Languages | Python (AI/ML), Go (High-performance backend), Node.js |
| Databases | PostgreSQL (Managed via Docker), SQLModel |
| AI/ML | BERT (NLP), ONNX (Inference), FastAPI |
| DevOps | Docker Desktop, Git CLI, Miniconda |

---

## 🐳 Docker Workflow
I use **Docker Desktop with WSL integration** to keep my machine "clean."
- **Database on Demand:** I don't install Postgres on Windows; I spin it up in a container only when I'm working on the *Customer Feedback System* or *AI Resume Builder*.
- **Model Portability:** Using **ONNX** inside Docker ensures that my inference environment is identical from my local machine to the cloud.

---

## 📈 2026 Momentum: 5 Repositories & Counting
This setup has allowed me to contribute to 7 major projects already this year:
1. **AI Resume Analyzer:** Node.js + Puppeteer for PDF generation. **private for now**
2. **Customer Feedback Intelligence:** BERT-powered analysis with a FastAPI/ONNX backend.
3. **Knowledge Bot:** Specialized AI agent for searching answer on internet.
4. **House Price Prediction:** full stack ML project.
5. **Heart Disease Predictor:** Classification model.


---



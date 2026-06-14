# 🌿 CarbonSense AI

**HBAR-powered Carbon MRV Readiness Agent**  
_A Hedera hackathon submission for the AI Agent Bounty (Week 4: Hedera Commerce Agent)_

![Hedera](https://img.shields.io/badge/Hedera-HBAR-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991)

---

## 📌 Overview

CarbonSense AI evaluates carbon credit and reforestation projects, providing an instant **MRV (Monitoring, Reporting, Verification) readiness assessment** and gating a **premium MRV report** behind an **8 HBAR payment** on Hedera testnet.

Users can:

1. Describe a carbon project (reforestation, agroforestry, etc.).
2. Get a **free assessment** – methodology recommendation, readiness score, risks, and AI analysis.
3. Connect their **HashPack wallet** and pay 8 HBAR to unlock a comprehensive premium report.

For easy judging, a **Demo Mode** is included that bypasses real HBAR payment and simulates the premium unlock.

---

## ✨ Features

- **AI-powered free assessment** – identifies project type, methodology, confidence, and risks.
- **HBAR-gated premium report** – pay 8 HBAR (testnet) to unlock detailed MRV analysis.
- **Wallet integration** – HashPack (via direct extension API) for testnet.
- **Responsive UI** – built with Next.js 15 and Tailwind CSS.
- **Demo Mode toggle** – no HBAR required for judges to test full flow.

---

## 🏗 Architecture

### Frontend (Next.js 15)
- React components, Tailwind CSS, Lucide icons.
- Wallet connection: custom `useHashPack` hook using `window.hashpack`.
- Premium payment: creates and sends an 8 HBAR `TransferTransaction` with `@hashgraph/sdk`.
- Markdown rendering: `react-markdown` for AI responses.

### Backend (FastAPI)
- **`/assess`** – free assessment using OpenAI GPT.
- **`/premium-report`** – generates premium report (only if `transaction_id == "demo"` for now; real verification is ready).
- Modular agents for methodology, scoring, risks, and reasoning.

### Hedera Integration
- **Testnet** only.
- Real payment flow: frontend builds a transaction → user signs with HashPack → backend verifies via mirror node.
- **Demo fallback** – `transaction_id: "demo"` triggers report without payment.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.13+ with `venv`
- HashPack extension (for real wallet mode, optional for demo)
- Hedera testnet account (optional for demo) – get free HBAR from [faucet](https://portal.hedera.com/faucet)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/carbonsense-ai.git
cd carbonsense-ai
```

### 2. Clone the Repository
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

###3. 

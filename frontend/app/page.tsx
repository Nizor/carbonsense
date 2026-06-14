"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Leaf,
  Lock,
  ShieldCheck,
  Wallet,
  TrendingUp,
  AlertTriangle,
  FileText,
  FlaskConical,
} from "lucide-react";
import { useHashPack } from "@/hooks/useHashPack";

export default function Home() {
  const [description, setDescription] = useState("");
  const [assessment, setAssessment] = useState<any>(null);
  const [premiumReport, setPremiumReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [useDemoMode, setUseDemoMode] = useState(true); // demo mode enabled by default

  const {
    accountId,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isAvailable,
    checking,
  } = useHashPack();

  const API = "http://127.0.0.1:8000";

  async function handleWalletConnect() {
    try {
      await connectWallet();
      // If connection succeeds, automatically switch to real mode
      setUseDemoMode(false);
    } catch (err) {
      console.error(err);
      alert("Connection failed. You can continue in Demo Mode.");
    }
  }

  async function assessProject() {
    if (!description.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post(`${API}/assess`, { description });
      setAssessment(response.data);
    } catch (err) {
      console.error(err);
      alert("Assessment failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function unlockPremium() {
    if (!useDemoMode && !accountId) {
      alert("Connect your wallet first or enable Demo Mode.");
      return;
    }
    if (!description.trim()) {
      alert("Enter a project description first.");
      return;
    }
    try {
      setPremiumLoading(true);

      let transactionId = "";
      if (useDemoMode) {
        transactionId = "demo";
      } else {
        // Real HBAR payment would go here, but we skip for now (HashPack detection not working)
        alert("Real HBAR payment requires working HashPack. Please enable Demo Mode for now.");
        setPremiumLoading(false);
        return;
      }

      const verifyRes = await axios.post(`${API}/premium-report`, {
        description: description,
        transaction_id: transactionId,
      });

      if (verifyRes.data.success) {
        setPremiumReport(verifyRes.data.report);
      } else {
        alert("Payment verification failed: " + (verifyRes.data.message || "Unknown error"));
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Payment failed.");
    } finally {
      setPremiumLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Leaf size={34} className="text-green-700" />
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                CarbonSense AI
              </h1>
            </div>
            <p className="text-gray-700 mt-3 text-lg">
              HBAR-powered Carbon MRV Readiness Agent
            </p>
          </div>

          {/* Wallet & Demo Mode */}
          <div className="flex flex-col items-end gap-2">
            {/* Demo Mode Toggle */}
            <label className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full shadow">
              <FlaskConical size={16} className="text-purple-600" />
              <span className="font-medium">Demo Mode</span>
              <input
                type="checkbox"
                checked={useDemoMode}
                onChange={(e) => setUseDemoMode(e.target.checked)}
                className="toggle toggle-sm"
              />
            </label>

            {/* Wallet Section (only visible if demo mode is off) */}
            {!useDemoMode && (
              !accountId ? (
                checking ? (
                  <button disabled className="bg-gray-400 text-white px-5 py-3 rounded-xl">
                    Checking...
                  </button>
                ) : !isAvailable ? (
                  <div className="text-center">
                    <p className="text-red-600 text-sm">HashPack not detected</p>
                    <a
                      href="https://www.hashpack.app/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 underline text-xs"
                    >
                      Install
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleWalletConnect}
                    disabled={isConnecting}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow"
                  >
                    <Wallet size={18} />
                    {isConnecting ? "Connecting..." : "Connect HashPack"}
                  </button>
                )
              ) : (
                <div className="border border-gray-300 rounded-xl px-5 py-3 bg-white shadow-md">
                  <p className="text-sm text-gray-600">Connected Wallet</p>
                  <p className="font-semibold text-gray-800">{accountId}</p>
                  <button onClick={disconnectWallet} className="text-xs text-red-600 hover:underline">
                    Disconnect
                  </button>
                </div>
              )
            )}
            {useDemoMode && (
              <div className="text-xs text-gray-500 bg-yellow-50 px-3 py-1 rounded-full">
                ⚡ Demo: No HBAR required
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <textarea
            className="w-full border border-gray-300 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            rows={6}
            placeholder="Describe your reforestation, afforestation or agroforestry project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={assessProject}
            disabled={loading || !description.trim()}
            className="mt-5 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl disabled:opacity-50 transition shadow"
          >
            {loading ? "Analyzing..." : "Assess Project"}
          </button>
        </div>

        {/* Free Assessment Results */}
        {assessment && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-3xl font-bold text-gray-800">Free Assessment</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Readiness Score</p>
                <p className="text-4xl font-bold text-gray-900">{assessment.readiness_score}%</p>
              </div>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-gray-200 h-4 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-700"
                style={{ width: `${assessment.readiness_score}%` }}
              />
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FileText size={16} /> Project Type
                </p>
                <h3 className="font-bold text-xl text-gray-800 mt-1">{assessment.project_type}</h3>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <TrendingUp size={16} /> Recommended Methodology
                </p>
                <h3 className="font-bold text-xl text-gray-800 mt-1">{assessment.methodology}</h3>
              </div>
            </div>

            {/* Risks */}
            <div className="mt-8">
              <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-600" /> Risk Assessment
              </h3>
              <ul className="space-y-2">
                {assessment.risks.map((risk: string, idx: number) => (
                  <li key={idx} className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 text-gray-700">
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Analysis with Markdown */}
            <div className="mt-8">
              <h3 className="font-bold text-xl text-gray-800 mb-3">AI Analysis</h3>
              <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 text-gray-700 prose prose-sm max-w-none">
                <ReactMarkdown>{assessment.analysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Premium Unlock Section */}
        {assessment && !premiumReport && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={24} className="text-green-700" />
              <h2 className="text-3xl font-bold text-gray-800">Premium MRV Report</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Unlock compliance analysis, carbon estimates, monitoring plans and mitigation strategies.
            </p>
            <button
              onClick={unlockPremium}
              disabled={premiumLoading || (!useDemoMode && !accountId)}
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl flex items-center gap-2 disabled:opacity-50 transition shadow"
            >
              <ShieldCheck />
              {premiumLoading ? "Processing..." : useDemoMode ? "Demo: Unlock Report" : "Pay 8 HBAR"}
            </button>
            {!useDemoMode && !accountId && (
              <p className="text-sm text-red-600 mt-3">Connect wallet first.</p>
            )}
          </div>
        )}

        {/* Premium Report Display with Markdown */}
        {premiumReport && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Premium MRV Report</h2>
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-gray-700 prose prose-sm max-w-none">
              <ReactMarkdown>{premiumReport}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
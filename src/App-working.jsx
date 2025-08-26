// src/App.jsx
import { useState, useEffect } from "react";

// tiny inline Countdown to verify runtime
function Countdown({ seconds = 10 }) {
  const [t, setT] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setT((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-bold">{t}s</span>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#fff7eb] text-[#1f1f1f] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Timeleft Demo — sanity check</h1>
        <p className="text-sm text-gray-600 mb-6">
          If you see this, React + Tailwind are working. Next we’ll paste real components.
        </p>

        <div className="rounded-2xl p-6 bg-white shadow">
          <div className="mb-3 text-sm text-gray-700">Countdown should tick:</div>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-red-600 text-white">
            ⏳ <Countdown seconds={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

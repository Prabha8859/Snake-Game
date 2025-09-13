import React, { useState } from "react";

export default function AgreementScreen({ onAgree, onCancel }) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrolled(scrollTop > 20);
  };

  const gameModesData = [
    { name: "Easy", snakes: 1, multiplier: "1.01x - 2.00x", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    { name: "Medium", snakes: 3, multiplier: "1.11x - 4.00x", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
    { name: "Hard", snakes: 5, multiplier: "1.38x - 7.50x", color: "text-orange-400", bgColor: "bg-orange-500/10" },
    { name: "Expert", snakes: 7, multiplier: "3.82x - 10.00x", color: "text-red-400", bgColor: "bg-red-500/10" },
    { name: "Master", snakes: 9, multiplier: "17.31x - 18.00x", color: "text-purple-400", bgColor: "bg-purple-500/10" }
  ];

  const gameRules = [
    "Set your bet (wager amount)",
    "Roll 2 dice",
    "The total of the dice decides how far you move on the 12-space board",
    "Multipliers increase your bet winnings",
    "Snakes make you lose"
  ];

  const bettingOptions = [
    { name: "Auto Bet", description: "game plays automatically" },
    { name: "Instant Bet", description: "skips animations for faster play" }
  ];

  const termsConditions = [
    "Players must be 18+ years of age to play.",
    "This game is for entertainment purposes only.",
    "Wagering involves real money — play responsibly.",
    "The outcome of every round is determined by RNG (Random Number Generator).",
    "Once a bet is placed, it cannot be cancelled or refunded.",
    "Auto Bet and Instant Bet follow the same fairness rules.",
    "Maximum winnings are capped as per platform limits.",
    "By clicking Agree, you accept these rules and confirm you understand the risks.",
    "Stakeholders are not responsible for losses due to player decisions or disconnections.",
    "Please gamble responsibly — set limits and stop when needed.",
    "If you or someone you know has a gambling problem, seek help immediately."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Header */}
      <div className={`sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'bg-slate-200/10 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              HighStakes Dice
            </h1>
            <p className="text-lg text-slate-300 mt-2 font-medium">How to Play</p>
            <div className="flex justify-center mt-3">
              <div className="w-20  bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="container mx-auto px-4 pb-32 max-w-2xl overflow-y-auto max-h-screen"
        onScroll={handleScroll}
      >
        <div className="space-y-8">
          
          {/* Game Rules Section */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-white">Game Rules</h2>
            </div>
            <div className="grid gap-4">
              {gameRules.map((rule, index) => (
                <div key={index} className="flex items-start group">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:bg-orange-400 transition-colors"></div>
                  <p className="text-slate-200 leading-relaxed group-hover:text-white transition-colors">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Game Modes Section */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-white">Game Modes</h2>
            </div>
            
            <div className="grid gap-3">
              {gameModesData.map((mode, index) => (
                <div key={index} className={`${mode.bgColor} border border-slate-600/30 rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`${mode.color} font-bold text-lg`}>{mode.name}</span>
                      <span className="text-slate-400 ml-3">{mode.snakes} snake{mode.snakes > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-300 font-mono text-sm">{mode.multiplier}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⚡</div>
                <p className="text-orange-300 font-semibold">More snakes = higher risk but higher rewards</p>
              </div>
            </div>
          </div>

          {/* Betting Options Section */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-white">Betting Options</h2>
            </div>
            
            <div className="grid gap-4">
              {bettingOptions.map((option, index) => (
                <div key={index} className="flex items-start bg-slate-700/40 rounded-xl p-4 hover:bg-slate-700/60 transition-colors group">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-blue-300 group-hover:text-blue-200">{option.name}</span>
                    <span className="text-slate-300 ml-2">→ {option.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions Section */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-white">Terms & Conditions</h2>
            </div>
            
            <div className="max-h-80 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {termsConditions.map((term, index) => (
                <div key={index} className="flex items-start group">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:bg-red-300 transition-colors"></div>
                  <p className="text-slate-200 leading-relaxed text-sm group-hover:text-white transition-colors">{term}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent backdrop-blur-lg border-t border-slate-700/50">
        <div className="container mx-auto px-4 pt-2">
          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={onCancel}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 
                       py-2 px-6 rounded-2xl font-bold text-lg text-white shadow-2xl transform transition-all duration-300 
                       hover:scale-105 active:scale-95 border border-red-400/30 hover:shadow-red-500/25"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </span>
            </button>
            <button
              onClick={onAgree}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 
                        px-6 rounded-2xl font-bold text-lg text-white shadow-2xl transform transition-all duration-300 
                       hover:scale-105 active:scale-95 border border-green-400/30 hover:shadow-green-500/25"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Agree
              </span>
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-slate-400">
              By continuing, you acknowledge that you have read and understood our terms
            </p>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #475569 #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
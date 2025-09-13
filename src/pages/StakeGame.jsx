import React, { useState } from "react";
import { Settings, BarChart3, Star, ExternalLink } from "lucide-react";

import AgreementScreen from "./AgreementScreen";

export default function CasinoGameUI() {
  // Agreement state
  const [accepted, setAccepted] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  
  // === Game states ===
  const [betAmount, setBetAmount] = useState("");
  const [totalProfit, setTotalProfit] = useState("0.00");
  const [isManual, setIsManual] = useState(true);
  const [gameState, setGameState] = useState("betting"); // betting, ready, rolling, result
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(2);
  const pathOrder = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4];
  const [stepCount, setStepCount] = useState(0); 
  const [playerPosition, setPlayerPosition] = useState(pathOrder[0]);
  const [isRolling, setIsRolling] = useState(false);
  const [multiplier, setMultiplier] = useState("1.00x");
  const [isWinning, setIsWinning] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showProfitFields, setShowProfitFields] = useState(false);

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
          <h1 className="text-white text-2xl font-bold text-center">You have exited the game.</h1>
        </div>
      </div>
    );
  }

  if (!accepted) {
    return (
      <AgreementScreen
        onAgree={() => setAccepted(true)}
        onCancel={() => setCancelled(true)}
      />
    );
  }

  // Sound effects functions
  const playSound = (type) => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      switch(type) {
        case 'dice':
          // Dice rolling sound - quick beeps
          oscillator.frequency.setValueAtTime(800, context.currentTime);
          oscillator.frequency.setValueAtTime(600, context.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(400, context.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.3);
          break;
          
        case 'move':
          // Player movement sound - soft tick
          oscillator.frequency.setValueAtTime(300, context.currentTime);
          gainNode.gain.setValueAtTime(0.05, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.1);
          break;
          
        case 'win':
          // Win sound - ascending notes
          oscillator.frequency.setValueAtTime(523, context.currentTime);
          oscillator.frequency.setValueAtTime(659, context.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(784, context.currentTime + 0.4);
          gainNode.gain.setValueAtTime(0.15, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.6);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.6);
          break;
          
        case 'lose':
          // Lose sound - descending notes
          oscillator.frequency.setValueAtTime(400, context.currentTime);
          oscillator.frequency.setValueAtTime(300, context.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(200, context.currentTime + 0.4);
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.6);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.6);
          break;
      }
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  // board multipliers
  const gridMultipliers = {
    0: "Start",
    1: "4.00x",
    2: "2.50x",
    3: "1.40x",
    4: "4.00x",
    5: "dice1",
    6: "dice2",
    7: "1.11x",
    8: "2.50x",
    9: "1.00x",
    10: "1.00x",
    11: "lose",
    12: "1.40x",
    13: "1.11x",
    14: "lose",
    15: "lose",
  };

  // Dice pip drawing
  const getDiceDisplay = (value) => {
    const dots = [];
    const dotPositions = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    for (let i = 0; i < 9; i++) {
      dots.push(
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            dotPositions[value]?.includes(i)
              ? "bg-slate-800"
              : "bg-transparent"
          }`}
        />
      );
    }
    return <div className="grid grid-cols-3 gap-1 w-6 h-6">{dots}</div>;
  };

  // Roll dice and move
  // const [playerPosition, setPlayerPosition] = useState(0); // Start = 0

const rollDice = () => {
  if (gameState !== "ready") return;
  setIsRolling(true);
  setGameState("rolling");

  const finalDice1 = Math.floor(Math.random() * 6) + 1;
  const finalDice2 = Math.floor(Math.random() * 6) + 1;
  const diceSum = finalDice1 + finalDice2;

  const rollInterval = setInterval(() => {
    setDice1(Math.floor(Math.random() * 6) + 1);
    setDice2(Math.floor(Math.random() * 6) + 1);
  }, 100);

  setTimeout(() => {
    clearInterval(rollInterval);
    setDice1(finalDice1);
    setDice2(finalDice2);

    let stepsMoved = 0;
    let currentStep = stepCount; // 0 → start

    const moveInterval = setInterval(() => {
      if (currentStep < pathOrder.length) {
        currentStep++; // step +1
        setStepCount(currentStep);
        setPlayerPosition(pathOrder[currentStep - 1]); 
        stepsMoved++;
      }

      if (stepsMoved === diceSum || currentStep === pathOrder.length) {
        clearInterval(moveInterval);
        setTimeout(() => {
          calculateResult(pathOrder[currentStep - 1]);
        }, 600);
      }
    }, 400);

    setIsRolling(false);
  }, 2000);
};

  // calculate win/loss
  const calculateResult = (position) => {
    const multiplierValue = gridMultipliers[position];
    let finalMultiplier = "1.00x";
    let isWin = false;

    if (multiplierValue === "lose") {
      finalMultiplier = "0.00x";
      isWin = false;
    } else if (
      multiplierValue &&
      multiplierValue !== "dice1" &&
      multiplierValue !== "dice2" &&
      multiplierValue !== "Start"
    ) {
      finalMultiplier = multiplierValue;
      isWin = parseFloat(multiplierValue) > 1;
    } else {
      finalMultiplier = "1.00x";
      isWin = true;
    }

    setMultiplier(finalMultiplier);
    setIsWinning(isWin);

    const betValue = parseFloat(betAmount) || 0;
    const multiplierNum = parseFloat(finalMultiplier) || 0;
    const profit = (betValue * multiplierNum - betValue).toFixed(2);

    setTotalProfit(profit);
    setCurrentBalance((prev) => prev + parseFloat(profit));
    
    // Play win/lose sound
    if (isWin && parseFloat(profit) > 0) {
      playSound('win');
    } else {
      playSound('lose');
    }
    
    setGameState("result");
  };

  const handleBetClick = () => {
    const betValue = parseFloat(betAmount) || 0;
    if (betValue < 10) {
      alert("Minimum bet amount is $10.00");
      return;
    }
    if (betValue > currentBalance && currentBalance > 0) {
      alert("Insufficient balance");
      return;
    }
    
    // If balance is 0, allow the bet to create the balance
    if (currentBalance === 0) {
      setCurrentBalance(betValue);
    } else {
      setCurrentBalance((prev) => prev - betValue);
    }
    
    setShowProfitFields(true);
    setGameState("ready");
  };

 const handleNewRound = () => {
  setShowProfitFields(false);
  setTotalProfit("0.00");
  setBetAmount("");
  setStepCount(0); // reset step count
  setPlayerPosition(pathOrder[0]); // reset position to Start
  setMultiplier("1.00x");
  setIsWinning(false);
  setGameState("betting");
};


  const getPositionStyle = (index) => {
    if (index === playerPosition && gameState === "result") {
      return isWinning
        ? "ring-4 ring-green-400 bg-gradient-to-br from-green-500 to-green-600 animate-pulse shadow-lg shadow-green-400/50"
        : "ring-4 ring-red-400 bg-gradient-to-br from-red-500 to-red-600 animate-pulse shadow-lg shadow-red-400/50";
    }
    if (index === playerPosition) {
      return "ring-4 ring-blue-400 bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-400/50";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-4 pb-20">
      <div className="flex gap-8 max-w-7xl mx-auto h-full">
        {/* Left Panel */}
        <div className="w-80 bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-6 space-y-6 h-fit shadow-2xl border border-slate-600/30 backdrop-blur-sm">
          {/* Balance */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 text-center shadow-xl border border-slate-600/40">
            <div className="text-slate-400 text-sm font-medium mb-1">Demo Balance</div>
            <div className="text-white font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ${currentBalance.toFixed(2)}
            </div>
            {currentBalance === 0 && (
              <div className="text-xs text-slate-400 mt-1">Enter bet amount to start</div>
            )}
          </div>

          {/* Manual/Auto */}
          <div className="bg-slate-600/50 rounded-xl p-1.5 flex shadow-inner border border-slate-500/30">
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                isManual 
                  ? "bg-gradient-to-r from-slate-500 to-slate-400 text-white shadow-lg transform scale-105" 
                  : "text-slate-300 hover:text-white hover:bg-slate-600/30"
              }`}
              onClick={() => setIsManual(true)}
            >
              Manual
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                !isManual 
                  ? "bg-gradient-to-r from-slate-500 to-slate-400 text-white shadow-lg transform scale-105" 
                  : "text-slate-300 hover:text-white hover:bg-slate-600/30"
              }`}
              onClick={() => setIsManual(false)}
            >
              Auto
            </button>
          </div>

          {/* Bet Amount */}
          <div className="space-y-3">
            <label className="text-slate-300 text-sm font-semibold">Bet Amount</label>
            <div className="relative">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-3 rounded-xl border border-slate-500/50 shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 font-semibold text-lg"
                placeholder="Min: $10.00"
                min="10"
                step="0.01"
                disabled={gameState !== "betting"}
              />
              <div className="absolute right-3 top-3 text-slate-400 text-sm font-bold">$</div>
            </div>
          </div>

          {/* Profit */}
          {showProfitFields && (
            <div className="space-y-3">
              <label className="text-slate-300 text-sm font-semibold">
                Total Profit ({multiplier})
              </label>
              <input
                type="text"
                value={totalProfit}
                readOnly
                className={`w-full px-4 py-3 rounded-xl border shadow-inner font-bold text-lg transition-all duration-300 ${
                  parseFloat(totalProfit) >= 0
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white border-green-400/50 shadow-lg shadow-green-400/20"
                    : "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-400/50 shadow-lg shadow-red-400/20"
                }`}
              />
            </div>
          )}

          {/* Controls */}
          {gameState === "betting" && (
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-green-400/30 border border-green-400/50 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={handleBetClick}
            >
              Place Bet
            </button>
          )}
          {gameState === "ready" && (
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-blue-400/30 border border-blue-400/50 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={rollDice}
            >
              🎲 Roll Dice
            </button>
          )}
          {gameState === "rolling" && (
            <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-yellow-400/30 border border-yellow-400/50 animate-pulse">
              🎲 Rolling...
            </button>
          )}
          {gameState === "result" && (
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-purple-400/30 border border-purple-400/50 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={handleNewRound}
            >
              🎯 New Round
            </button>
          )}
        </div>

        {/* Game Grid */}
        <div className="flex-1 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-8 flex items-center justify-center shadow-2xl border border-slate-600/30 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {/* Top Row */}
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-blue-400 text-2xl font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(0)}`}
              >
                ▶
              </button>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(1)}`}
              >
                4.00x
              </button>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(2)}`}
              >
                2.50x
              </button>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(3)}`}
              >
                1.40x
              </button>

              {/* Second Row */}
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(4)}`}
              >
                4.00x
              </button>
              <div
                className={`w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center shadow-lg border border-slate-400/50 ${
                  isRolling ? "animate-spin" : ""
                } ${getPositionStyle(5)} transition-all duration-300`}
              >
                {getDiceDisplay(dice1)}
              </div>
              <div
                className={`w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center shadow-lg border border-slate-400/50 ${
                  isRolling ? "animate-spin" : ""
                } ${getPositionStyle(6)} transition-all duration-300`}
              >
                {getDiceDisplay(dice2)}
              </div>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(7)}`}
              >
                1.11x
              </button>

              {/* Third Row */}
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(8)}`}
              >
                2.50x
              </button>
              <div
                className={`col-span-2 w-full h-20 rounded-xl flex flex-col items-center justify-center shadow-lg border transition-all duration-500 ${
                  gameState === "result"
                    ? isWinning
                      ? "bg-gradient-to-r from-green-600 to-green-700 border-green-400/50 shadow-green-400/30"
                      : "bg-gradient-to-r from-red-600 to-red-700 border-red-400/50 shadow-red-400/30"
                    : "bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500/50"
                }`}
              >
                {gameState === "result" ? (
                  <>
                    <span className="text-white font-bold text-lg">
                      {isWinning ? "🎉 You Are Winner!" : "💥 You Lose!"}
                    </span>
                    <span className="text-white text-sm font-semibold">
                      {multiplier} | Profit: ${totalProfit}
                    </span>
                  </>
                ) : (
                  <span className="text-white font-bold text-lg">1.00x</span>
                )}
              </div>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg border border-red-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(11)}`}
              >
                <span className="text-2xl">💀</span>
              </button>

              {/* Bottom Row */}
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(12)}`}
              >
                1.40x
              </button>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-slate-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(13)}`}
              >
                1.11x
              </button>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg border border-red-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(14)}`}
              >
                <span className="text-2xl">💀</span>
              </button>
              <button
                className={`w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg border border-red-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(15)}`}
              >
                <span className="text-2xl">💀</span>
              </button>
            </div>

            {/* Dice Sum */}
            {gameState !== "betting" && (
              <div className="text-center mt-6 bg-slate-600/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-500/30">
                <div className="text-slate-200 font-semibold">
                  🎲 Dice Sum: <span className="text-yellow-400 font-bold">{dice1 + dice2}</span> | 
                  📍 Position: <span className="text-blue-400 font-bold">{playerPosition}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-600/50 px-6 py-4 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex gap-6">
            <Settings className="w-6 h-6 text-slate-400 hover:text-white cursor-pointer transition-colors duration-300 hover:scale-110" />
            <BarChart3 className="w-6 h-6 text-slate-400 hover:text-white cursor-pointer transition-colors duration-300 hover:scale-110" />
            <Star className="w-6 h-6 text-slate-400 hover:text-white cursor-pointer transition-colors duration-300 hover:scale-110" />
            <ExternalLink className="w-6 h-6 text-slate-400 hover:text-white cursor-pointer transition-colors duration-300 hover:scale-110" />
          </div>
          <div className="text-slate-400 text-sm font-medium bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-600/30">
            🎮 Demo Game - No Real Money
          </div>
          <button className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 px-6 py-2 rounded-xl text-white text-sm font-semibold shadow-lg border border-slate-500/50 transition-all duration-300 hover:scale-105">
            ⚖️ Fairness
          </button>
        </div>
      </div>
    </div>
  );
}
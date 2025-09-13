
import React, { useState } from "react";
import { Settings, BarChart3, Star, ExternalLink, Sun, Moon, Flame, Zap, TrendingUp } from "lucide-react";
import diceSound from "../assets/sounds/dice-142528.mp3";
import moveSound from "../assets/sounds/stacktokensound.mp3";
import winSound from "../assets/sounds/winsound.mp3";
import loseSound from "../assets/sounds/dangersound.mp3";
import AgreementScreen from "./AgreementScreen";

export default function CasinoGameUI() {
  const [accepted, setAccepted] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // === Game states ===
  const [betAmount, setBetAmount] = useState("");
  const [totalProfit, setTotalProfit] = useState("0.00");
  const [isManual, setIsManual] = useState(true);
  const [gameState, setGameState] = useState("betting"); 
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

  // Theme configurations
  const themes = {
    dark: {
      background: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900",
      cardBg: "bg-gradient-to-b from-slate-700 to-slate-800",
      gridBg: "bg-gradient-to-br from-slate-700 to-slate-800",
      buttonBg: "bg-gradient-to-br from-slate-600 to-slate-700",
      textPrimary: "text-white",
      textSecondary: "text-slate-300",
      textMuted: "text-slate-400",
      border: "border-slate-600/30",
      buttonBorder: "border-slate-500/50",
      inputBg: "bg-gradient-to-r from-slate-600 to-slate-700",
      balanceBg: "bg-gradient-to-r from-slate-800 to-slate-700",
    },
    light: {
      background: "bg-gradient-to-br from-blue-50 via-white to-blue-100",
      cardBg: "bg-gradient-to-b from-white to-gray-100",
      gridBg: "bg-gradient-to-br from-white to-gray-100",
      buttonBg: "bg-gradient-to-br from-gray-200 to-gray-300",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-600",
      border: "border-gray-300/50",
      buttonBorder: "border-gray-400/50",
      inputBg: "bg-gradient-to-r from-gray-100 to-gray-200",
      balanceBg: "bg-gradient-to-r from-gray-100 to-gray-200",
    }
  };

  const currentTheme = themes[isDarkTheme ? 'dark' : 'light'];

  if (cancelled) {
    return (
      <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4`}>
        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-2xl p-6 sm:p-8 ${currentTheme.border} shadow-2xl max-w-md w-full`}>
          <h1 className={`${currentTheme.textPrimary} text-xl sm:text-2xl font-bold text-center`}>You have exited the game.</h1>
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

   // Sound effects functions (using audio API)
 // Sound effects functions (using imported mp3 files)
const playSound = (type) => {
  let soundFile;

  switch (type) {
    case "dice":
      soundFile = diceSound;
      break;
    case "move":
      soundFile = moveSound;
      break;
    case "win":
      soundFile = winSound;
      break;
    case "lose":
      soundFile = loseSound;
      break;
    default:
      return;
  }

  try {
    const audio = new Audio(soundFile);
    audio.volume = 0.6; // set volume (0.0 to 1.0)
    audio.play().catch((err) => {
      console.warn("Audio play blocked:", err);
    });
  } catch (error) {
    console.log("Audio not supported");
  }
};

  // Board multipliers with all position updates
  const gridMultipliers = {
    0: "Start",     // Start position
    1: "4.00x",     // Top row - multiplier
    2: "2.50x",     // Top row - multiplier
    3: "1.40x",     // Top row - multiplier
    4: "4.00x",     // Left side - multiplier
    5: "dice1",     // Dice 1 position
    6: "dice2",     // Dice 2 position
    7: "lose",      // Right side - LOSE
    8: "lose",      // Left bottom - LOSE
    9: "1.00x",     // Center area
    10: "1.00x",    // Center area
    11: "1.11x",    // Right bottom - multiplier
    12: "1.40x",    // Bottom row - multiplier
    13: "lose",     // Bottom row - LOSE
    14: "2.50x",    // Bottom row - multiplier
    15: "lose",     // Bottom right corner - LOSE
  };

  // Fire Animation Component
  const FireAnimation = ({ isActive, isWinFire = false }) => {
    if (!isActive) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`animate-bounce ${isWinFire ? 'text-yellow-400' : 'text-red-500'}`}>
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
        </div>
        <div className={`absolute animate-ping ${isWinFire ? 'text-orange-400' : 'text-red-400'}`}>
          <Flame className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div className={`absolute animate-spin ${isWinFire ? 'text-yellow-300' : 'text-red-300'}`}>
          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>
    );
  };

  // Win Fire Animation Component
  const WinFireAnimation = ({ isActive }) => {
    if (!isActive) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-green-400 animate-bounce">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
        </div>
        <div className="absolute text-yellow-400 animate-ping">
          <Flame className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div className="absolute text-green-300 animate-spin">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <div className="absolute text-yellow-300 animate-pulse">
          <Star className="w-2 h-2 sm:w-3 sm:h-3" />
        </div>
      </div>
    );
  };

  // Dice pip drawing function
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
          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
            dotPositions[value]?.includes(i)
              ? isDarkTheme ? "bg-slate-800" : "bg-gray-800"
              : "bg-transparent"
          }`}
        />
      );
    }
    return <div className="grid grid-cols-3 gap-0.5 sm:gap-1 w-4 h-4 sm:w-6 sm:h-6">{dots}</div>;
  };

  // Roll dice and move player
  const rollDice = () => {
    if (gameState !== "ready") return;
    setIsRolling(true);
    setGameState("rolling");

    const finalDice1 = Math.floor(Math.random() * 6) + 1;
    const finalDice2 = Math.floor(Math.random() * 6) + 1;
    const diceSum = finalDice1 + finalDice2;

    playSound('dice');

    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      setDice1(finalDice1);
      setDice2(finalDice2);

      let stepsMoved = 0;
      let currentStep = stepCount;

      // Move player step by step
      const moveInterval = setInterval(() => {
        playSound('move');
        
        if (currentStep < pathOrder.length && stepsMoved < diceSum) {
          currentStep++;
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

  // Calculate win/loss result
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

  // Handle bet placement
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

  // Start new round
  const handleNewRound = () => {
    setShowProfitFields(false);
    setTotalProfit("0.00");
    setBetAmount("");
    setStepCount(0);
    setPlayerPosition(pathOrder[0]);
    setMultiplier("1.00x");
    setIsWinning(false);
    setGameState("betting");
  };

  // Get position styling based on player position and game state
  const getPositionStyle = (index) => {
    const baseShadow = isDarkTheme 
      ? "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
      : "shadow-[0_8px_32px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]";
    
    if (index === playerPosition && gameState === "result") {
      return isWinning
        ? `ring-2 sm:ring-4 ring-green-400 bg-gradient-to-br from-green-500 to-green-600 animate-pulse ${baseShadow} shadow-green-400/50`
        : `ring-2 sm:ring-4 ring-red-400 bg-gradient-to-br from-red-500 to-red-600 animate-pulse ${baseShadow} shadow-red-400/50`;
    }
    if (index === playerPosition) {
      return `ring-2 sm:ring-4 ring-blue-400 bg-gradient-to-br from-blue-600 to-blue-700 ${baseShadow} shadow-blue-400/50`;
    }
    return baseShadow;
  };

  // Enhanced button shadow styles
  const getButtonShadow = (variant = 'default') => {
    const shadows = {
      default: isDarkTheme 
        ? "shadow-[0_10px_40px_rgba(0,0,0,0.4),0_6px_20px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2)]"
        : "shadow-[0_10px_40px_rgba(0,0,0,0.2),0_6px_20px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)]",
      green: "shadow-[0_12px_48px_rgba(34,197,94,0.4),0_8px_24px_rgba(34,197,94,0.3),0_4px_12px_rgba(34,197,94,0.2)]",
      blue: "shadow-[0_12px_48px_rgba(59,130,246,0.4),0_8px_24px_rgba(59,130,246,0.3),0_4px_12px_rgba(59,130,246,0.2)]",
      yellow: "shadow-[0_12px_48px_rgba(245,158,11,0.4),0_8px_24px_rgba(245,158,11,0.3),0_4px_12px_rgba(245,158,11,0.2)]",
      purple: "shadow-[0_12px_48px_rgba(147,51,234,0.4),0_8px_24px_rgba(147,51,234,0.3),0_4px_12px_rgba(147,51,234,0.2)]",
      red: "shadow-[0_12px_48px_rgba(239,68,68,0.4),0_8px_24px_rgba(239,68,68,0.3),0_4px_12px_rgba(239,68,68,0.2)]"
    };
    return shadows[variant];
  };

  // Check if position should show fire animation
  const shouldShowFireAnimation = (position) => {
    return gameState === "result" && position === playerPosition;
  };

  // Check if it's a win or lose fire
  const isWinPosition = (position) => {
    const multiplierValue = gridMultipliers[position];
    if (multiplierValue === "lose") return false;
    if (multiplierValue && multiplierValue !== "dice1" && multiplierValue !== "dice2" && multiplierValue !== "Start") {
      return parseFloat(multiplierValue) >= 1;
    }
    return true;
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} p-2 sm:p-4 pb-16 sm:pb-20`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className={`p-3 rounded-full ${currentTheme.cardBg} ${currentTheme.border} ${getButtonShadow()} hover:scale-110 transition-all duration-300 backdrop-blur-sm`}
        >
          {isDarkTheme ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Mobile Layout - Stack vertically */}
      <div className="block lg:hidden">
        {/* Top Control Panel for Mobile */}
        <div className={`${currentTheme.cardBg} rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 mb-4 ${getButtonShadow()} ${currentTheme.border} backdrop-blur-sm`}>
          {/* Balance Display */}
          <div className={`${currentTheme.balanceBg} rounded-xl p-3 sm:p-4 text-center ${getButtonShadow()} ${currentTheme.border}`}>
            <div className={`${currentTheme.textMuted} text-xs sm:text-sm font-medium mb-1`}>Demo Balance</div>
            <div className={`${currentTheme.textPrimary} font-bold text-lg sm:text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent`}>
              ${currentBalance.toFixed(2)}
            </div>
            {currentBalance === 0 && (
              <div className={`text-xs ${currentTheme.textMuted} mt-1`}>Enter bet amount to start</div>
            )}
          </div>

          {/* Manual/Auto Toggle */}
          <div className={`${isDarkTheme ? 'bg-slate-600/50' : 'bg-gray-300/50'} rounded-xl p-1.5 flex shadow-inner ${currentTheme.border}`}>
            <button
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                isManual 
                  ? `${isDarkTheme ? 'bg-gradient-to-r from-slate-500 to-slate-400' : 'bg-gradient-to-r from-gray-600 to-gray-500'} ${currentTheme.textPrimary} ${getButtonShadow()} transform scale-105` 
                  : `${currentTheme.textSecondary} hover:${currentTheme.textPrimary} ${isDarkTheme ? 'hover:bg-slate-600/30' : 'hover:bg-gray-400/30'}`
              }`}
              onClick={() => setIsManual(true)}
            >
              Manual
            </button>
            <button
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                !isManual 
                  ? `${isDarkTheme ? 'bg-gradient-to-r from-slate-500 to-slate-400' : 'bg-gradient-to-r from-gray-600 to-gray-500'} ${currentTheme.textPrimary} ${getButtonShadow()} transform scale-105` 
                  : `${currentTheme.textSecondary} hover:${currentTheme.textPrimary} ${isDarkTheme ? 'hover:bg-slate-600/30' : 'hover:bg-gray-400/30'}`
              }`}
              onClick={() => setIsManual(false)}
            >
              Auto
            </button>
          </div>

          {/* Bet Amount and Profit in Row for Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Bet Amount Input */}
            <div className="space-y-2 sm:space-y-3">
              <label className={`${currentTheme.textSecondary} text-xs sm:text-sm font-semibold`}>Bet Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className={`w-full ${currentTheme.inputBg} ${currentTheme.textPrimary} px-3 sm:px-4 py-2 sm:py-3 rounded-xl ${currentTheme.buttonBorder} shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 font-semibold text-sm sm:text-lg ${getButtonShadow()}`}
                  placeholder="Min: $10.00"
                  min="10"
                  step="0.01"
                  disabled={gameState !== "betting"}
                />
                <div className={`absolute right-2 sm:right-3 top-2 sm:top-3 ${currentTheme.textMuted} text-xs sm:text-sm font-bold`}>$</div>
              </div>
            </div>

            {/* Profit Display */}
            {showProfitFields && (
              <div className="space-y-2 sm:space-y-3">
                <label className={`${currentTheme.textSecondary} text-xs sm:text-sm font-semibold`}>
                  Total Profit ({multiplier})
                </label>
                <input
                  type="text"
                  value={totalProfit}
                  readOnly
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border shadow-inner font-bold text-sm sm:text-lg transition-all duration-300 ${
                    parseFloat(totalProfit) >= 0
                      ? `bg-gradient-to-r from-green-600 to-green-700 text-white border-green-400/50 ${getButtonShadow('green')}`
                      : `bg-gradient-to-r from-red-600 to-red-700 text-white border-red-400/50 ${getButtonShadow('red')}`
                  }`}
                />
              </div>
            )}
          </div>

          {/* Game Control Buttons */}
          {gameState === "betting" && (
            <button
              className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-lg ${getButtonShadow('green')} border border-green-400/50 transition-all duration-300 hover:scale-105 active:scale-95`}
              onClick={handleBetClick}
            >
              Place Bet
            </button>
          )}
          {gameState === "ready" && (
            <button
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-lg ${getButtonShadow('blue')} border border-blue-400/50 transition-all duration-300 hover:scale-105 active:scale-95`}
              onClick={rollDice}
            >
              🎲 Roll Dice
            </button>
          )}
          {gameState === "rolling" && (
            <button className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-3 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-lg ${getButtonShadow('yellow')} border border-yellow-400/50 animate-pulse`}>
              🎲 Rolling...
            </button>
          )}
          {gameState === "result" && (
            <button
              className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 py-3 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-lg ${getButtonShadow('purple')} border border-purple-400/50 transition-all duration-300 hover:scale-105 active:scale-95`}
              onClick={handleNewRound}
            >
              🎯 New Round
            </button>
          )}
        </div>

        {/* Game Grid Area for Mobile */}
        <div className={`${currentTheme.gridBg} rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex items-center justify-center ${getButtonShadow()} ${currentTheme.border} backdrop-blur-sm`}>
          <div className="w-full max-w-sm">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              
              {/* TOP ROW */}
              {/* Position 0 - Start */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center text-blue-400 text-lg sm:text-2xl font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(0)}`}
              >
                ▶
                <WinFireAnimation isActive={shouldShowFireAnimation(0) && isWinPosition(0)} />
                <FireAnimation isActive={shouldShowFireAnimation(0) && !isWinPosition(0)} />
              </button>
              
              {/* Position 1 - 4.00x */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold text-xs sm:text-base ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(1)}`}
              >
                4.00x
                <WinFireAnimation isActive={shouldShowFireAnimation(1) && isWinPosition(1)} />
                <FireAnimation isActive={shouldShowFireAnimation(1) && !isWinPosition(1)} />
              </button>
              
              {/* Position 2 - 2.50x */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold text-xs sm:text-base ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(2)}`}
              >
                2.50x
                <WinFireAnimation isActive={shouldShowFireAnimation(2) && isWinPosition(2)} />
                <FireAnimation isActive={shouldShowFireAnimation(2) && !isWinPosition(2)} />
              </button>
              
              {/* Position 3 - 1.40x */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold text-xs sm:text-base ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(3)}`}
              >
                1.40x
                <WinFireAnimation isActive={shouldShowFireAnimation(3) && isWinPosition(3)} />
                <FireAnimation isActive={shouldShowFireAnimation(3) && !isWinPosition(3)} />
              </button>

              {/* SECOND ROW */}
              {/* Position 4 - 4.00x */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold text-xs sm:text-base ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(4)}`}
              >
                4.00x
                <WinFireAnimation isActive={shouldShowFireAnimation(4) && isWinPosition(4)} />
                <FireAnimation isActive={shouldShowFireAnimation(4) && !isWinPosition(4)} />
              </button>
              
              {/* Position 5 - Dice 1 */}
              <div
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${isDarkTheme ? 'bg-gradient-to-br from-slate-200 to-slate-300' : 'bg-gradient-to-br from-white to-gray-100'} rounded-lg sm:rounded-xl flex items-center justify-center border border-slate-400/50 ${
                  isRolling ? "animate-spin" : ""
                } ${getPositionStyle(5)} transition-all duration-300`}
              >
                {getDiceDisplay(dice1)}
                <WinFireAnimation isActive={shouldShowFireAnimation(5) && isWinPosition(5)} />
                <FireAnimation isActive={shouldShowFireAnimation(5) && !isWinPosition(5)} />
              </div>
              
              {/* Position 6 - Dice 2 */}
              <div
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${isDarkTheme ? 'bg-gradient-to-br from-slate-200 to-slate-300' : 'bg-gradient-to-br from-white to-gray-100'} rounded-lg sm:rounded-xl flex items-center justify-center border border-slate-400/50 ${
                  isRolling ? "animate-spin" : ""
                } ${getPositionStyle(6)} transition-all duration-300`}
              >
                {getDiceDisplay(dice2)}
                <WinFireAnimation isActive={shouldShowFireAnimation(6) && isWinPosition(6)} />
                <FireAnimation isActive={shouldShowFireAnimation(6) && !isWinPosition(6)} />
              </div>
              
              {/* Position 7 - LOSE */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center border border-red-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(7)}`}
              >
                <span className="text-lg sm:text-2xl">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(7)} />
              </button>

              {/* THIRD ROW */}
              {/* Position 8 - LOSE */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center border border-red-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(8)}`}
              >
                <span className="text-lg sm:text-2xl">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(8)} />
              </button>
              
              {/* Position 9 & 10 - Center Result Area */}
              <div
                className={`relative col-span-2 w-full h-14 sm:h-20 rounded-lg sm:rounded-xl flex flex-col items-center justify-center border transition-all duration-500 ${getButtonShadow()} ${
                  gameState === "result"
                    ? isWinning
                      ? `bg-gradient-to-r from-green-600 to-green-700 border-green-400/50 ${getButtonShadow('green')}`
                      : `bg-gradient-to-r from-red-600 to-red-700 border-red-400/50 ${getButtonShadow('red')}`
                    : `${currentTheme.buttonBg} ${currentTheme.buttonBorder}`
                }`}
              >
                {gameState === "result" ? (
                  <>
                    <span className="text-white font-bold text-xs sm:text-lg">
                      {isWinning ? "🎉 You Win!" : "💥 You Lose!"}
                    </span>
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {multiplier} | ${totalProfit}
                    </span>
                  </>
                ) : (
                  <span className={`${currentTheme.textPrimary} font-bold text-sm sm:text-lg`}>1.00x</span>
                )}
                {gameState === "result" && (
                  <>
                    <WinFireAnimation isActive={isWinning} />
                    <FireAnimation isActive={!isWinning} />
                  </>
                )}
              </div>
              
              {/* Position 11 - 1.11x */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold text-xs sm:text-base ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(11)}`}
              >
                1.11x
                <WinFireAnimation isActive={shouldShowFireAnimation(11) && isWinPosition(11)} />
                <FireAnimation isActive={shouldShowFireAnimation(11) && !isWinPosition(11)} />
              </button>

              {/* BOTTOM ROW */}
              {/* Position 12 - 1.40x */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold text-xs sm:text-base ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(12)}`}
              >
                1.40x
                <WinFireAnimation isActive={shouldShowFireAnimation(12) && isWinPosition(12)} />
                <FireAnimation isActive={shouldShowFireAnimation(12) && !isWinPosition(12)} />
              </button>
              
              {/* Position 13 - LOSE */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center border border-red-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(13)}`}
              >
                <span className="text-lg sm:text-2xl">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(13)} />
              </button>
              
              {/* Position 14 - 2.50x */}
              <button
                className={`relative w-14 h-14 sm:w-20 sm:h-20 ${currentTheme.buttonBg} rounded-lg sm:rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold text-xs sm:text-base ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(14)}`}
              >
                2.50x
                <WinFireAnimation isActive={shouldShowFireAnimation(14) && isWinPosition(14)} />
                <FireAnimation isActive={shouldShowFireAnimation(14) && !isWinPosition(14)} />
              </button>
              
                {/* Position 15 - LOSE */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(15)}`}
              >
                <span className="text-2xl text-white">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(15)} />
              </button>
            </div>

            {/* Dice Sum & Position Info */}
            {gameState !== "betting" && (
              <div className={`text-center mt-4 sm:mt-6 ${isDarkTheme ? 'bg-slate-600/30' : 'bg-white/30'} backdrop-blur-sm rounded-xl p-3 sm:p-4 ${getButtonShadow()} ${currentTheme.border}`}>
                <div className={`${currentTheme.textSecondary} font-semibold text-xs sm:text-base`}>
                  🎲 Sum: <span className="text-yellow-400 font-bold">{dice1 + dice2}</span> | 
                  📍 Pos: <span className="text-blue-400 font-bold">{playerPosition}</span> | 
                  🎯 Val: <span className="text-purple-400 font-bold">{gridMultipliers[playerPosition]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex gap-8 max-w-7xl mx-auto h-full">
        {/* Left Control Panel */}
        <div className={`w-80 ${currentTheme.cardBg} rounded-3xl p-6 space-y-6 h-fit ${getButtonShadow()} ${currentTheme.border} backdrop-blur-sm`}>
          {/* Balance Display */}
          <div className={`${currentTheme.balanceBg} rounded-xl p-4 text-center ${getButtonShadow()} ${currentTheme.border}`}>
            <div className={`${currentTheme.textMuted} text-sm font-medium mb-1`}>Demo Balance</div>
            <div className={`${currentTheme.textPrimary} font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent`}>
              ${currentBalance.toFixed(2)}
            </div>
            {currentBalance === 0 && (
              <div className={`text-xs ${currentTheme.textMuted} mt-1`}>Enter bet amount to start</div>
            )}
          </div>

          {/* Manual/Auto Toggle */}
          <div className={`${isDarkTheme ? 'bg-slate-600/50' : 'bg-gray-300/50'} rounded-xl p-1.5 flex shadow-inner ${currentTheme.border}`}>
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                isManual 
                  ? `${isDarkTheme ? 'bg-gradient-to-r from-slate-500 to-slate-400' : 'bg-gradient-to-r from-gray-600 to-gray-500'} ${currentTheme.textPrimary} ${getButtonShadow()} transform scale-105` 
                  : `${currentTheme.textSecondary} hover:${currentTheme.textPrimary} ${isDarkTheme ? 'hover:bg-slate-600/30' : 'hover:bg-gray-400/30'}`
              }`}
              onClick={() => setIsManual(true)}
            >
              Manual
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                !isManual 
                  ? `${isDarkTheme ? 'bg-gradient-to-r from-slate-500 to-slate-400' : 'bg-gradient-to-r from-gray-600 to-gray-500'} ${currentTheme.textPrimary} ${getButtonShadow()} transform scale-105` 
                  : `${currentTheme.textSecondary} hover:${currentTheme.textPrimary} ${isDarkTheme ? 'hover:bg-slate-600/30' : 'hover:bg-gray-400/30'}`
              }`}
              onClick={() => setIsManual(false)}
            >
              Auto
            </button>
          </div>

          {/* Bet Amount Input */}
          <div className="space-y-3">
            <label className={`${currentTheme.textSecondary} text-sm font-semibold`}>Bet Amount</label>
            <div className="relative">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className={`w-full ${currentTheme.inputBg} ${currentTheme.textPrimary} px-4 py-3 rounded-xl ${currentTheme.buttonBorder} shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 font-semibold text-lg ${getButtonShadow()}`}
                placeholder="Min: $10.00"
                min="10"
                step="0.01"
                disabled={gameState !== "betting"}
              />
              <div className={`absolute right-3 top-3 ${currentTheme.textMuted} text-sm font-bold`}>$</div>
            </div>
          </div>

          {/* Profit Display */}
          {showProfitFields && (
            <div className="space-y-3">
              <label className={`${currentTheme.textSecondary} text-sm font-semibold`}>
                Total Profit ({multiplier})
              </label>
              <input
                type="text"
                value={totalProfit}
                readOnly
                className={`w-full px-4 py-3 rounded-xl border shadow-inner font-bold text-lg transition-all duration-300 ${
                  parseFloat(totalProfit) >= 0
                    ? `bg-gradient-to-r from-green-600 to-green-700 text-white border-green-400/50 ${getButtonShadow('green')}`
                    : `bg-gradient-to-r from-red-600 to-red-700 text-white border-red-400/50 ${getButtonShadow('red')}`
                }`}
              />
            </div>
          )}

          {/* Game Control Buttons */}
          {gameState === "betting" && (
            <button
              className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-4 rounded-xl text-white font-bold text-lg ${getButtonShadow('green')} border border-green-400/50 transition-all duration-300 hover:scale-105 active:scale-95`}
              onClick={handleBetClick}
            >
              Place Bet
            </button>
          )}
          {gameState === "ready" && (
            <button
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-4 rounded-xl text-white font-bold text-lg ${getButtonShadow('blue')} border border-blue-400/50 transition-all duration-300 hover:scale-105 active:scale-95`}
              onClick={rollDice}
            >
              🎲 Roll Dice
            </button>
          )}
          {gameState === "rolling" && (
            <button className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-4 rounded-xl text-white font-bold text-lg ${getButtonShadow('yellow')} border border-yellow-400/50 animate-pulse`}>
              🎲 Rolling...
            </button>
          )}
          {gameState === "result" && (
            <button
              className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 py-4 rounded-xl text-white font-bold text-lg ${getButtonShadow('purple')} border border-purple-400/50 transition-all duration-300 hover:scale-105 active:scale-95`}
              onClick={handleNewRound}
            >
              🎯 New Round
            </button>
          )}
        </div>

        {/* Game Grid Area */}
        <div className={`flex-1 ${currentTheme.gridBg} rounded-3xl p-8 flex items-center justify-center ${getButtonShadow()} ${currentTheme.border} backdrop-blur-sm`}>
          <div className="w-full max-w-lg">
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              
              {/* TOP ROW */}
              {/* Position 0 - Start */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center text-blue-400 text-2xl font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(0)}`}
              >
                ▶
                <WinFireAnimation isActive={shouldShowFireAnimation(0) && isWinPosition(0)} />
                <FireAnimation isActive={shouldShowFireAnimation(0) && !isWinPosition(0)} />
              </button>
              
              {/* Position 1 - 4.00x */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(1)}`}
              >
                4.00x
                <WinFireAnimation isActive={shouldShowFireAnimation(1) && isWinPosition(1)} />
                <FireAnimation isActive={shouldShowFireAnimation(1) && !isWinPosition(1)} />
              </button>
              
              {/* Position 2 - 2.50x */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(2)}`}
              >
                2.50x
                <WinFireAnimation isActive={shouldShowFireAnimation(2) && isWinPosition(2)} />
                <FireAnimation isActive={shouldShowFireAnimation(2) && !isWinPosition(2)} />
              </button>
              
              {/* Position 3 - 1.40x */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(3)}`}
              >
                1.40x
                <WinFireAnimation isActive={shouldShowFireAnimation(3) && isWinPosition(3)} />
                <FireAnimation isActive={shouldShowFireAnimation(3) && !isWinPosition(3)} />
              </button>

              {/* SECOND ROW */}
              {/* Position 4 - 4.00x */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(4)}`}
              >
                4.00x
                <WinFireAnimation isActive={shouldShowFireAnimation(4) && isWinPosition(4)} />
                <FireAnimation isActive={shouldShowFireAnimation(4) && !isWinPosition(4)} />
              </button>
              
              {/* Position 5 - Dice 1 */}
              <div
                className={`relative w-20 h-20 ${isDarkTheme ? 'bg-gradient-to-br from-slate-200 to-slate-300' : 'bg-gradient-to-br from-white to-gray-100'} rounded-xl flex items-center justify-center border border-slate-400/50 ${
                  isRolling ? "animate-spin" : ""
                } ${getPositionStyle(5)} transition-all duration-300`}
              >
                {getDiceDisplay(dice1)}
                <WinFireAnimation isActive={shouldShowFireAnimation(5) && isWinPosition(5)} />
                <FireAnimation isActive={shouldShowFireAnimation(5) && !isWinPosition(5)} />
              </div>
              
              {/* Position 6 - Dice 2 */}
              <div
                className={`relative w-20 h-20 ${isDarkTheme ? 'bg-gradient-to-br from-slate-200 to-slate-300' : 'bg-gradient-to-br from-white to-gray-100'} rounded-xl flex items-center justify-center border border-slate-400/50 ${
                  isRolling ? "animate-spin" : ""
                } ${getPositionStyle(6)} transition-all duration-300`}
              >
                {getDiceDisplay(dice2)}
                <WinFireAnimation isActive={shouldShowFireAnimation(6) && isWinPosition(6)} />
                <FireAnimation isActive={shouldShowFireAnimation(6) && !isWinPosition(6)} />
              </div>
              
              {/* Position 7 - LOSE */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105  ${getPositionStyle(7)}`}
              >
                <span className="text-2xl">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(7)} />
              </button>

              {/* THIRD ROW */}
              {/* Position 8 - LOSE */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105  ${getPositionStyle(8)}`}
              >
                <span className="text-2xl text-white">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(8)} />
              </button>
              
              {/* Position 9 & 10 - Center Result Area */}
              <div
                className={`relative col-span-2 w-full h-20 rounded-xl flex flex-col items-center justify-center border transition-all duration-500 ${getButtonShadow()} ${
                  gameState === "result"
                    ? isWinning
                      ? `bg-gradient-to-r from-green-600 to-green-700 border-green-400/50 ${getButtonShadow('green')}`
                      : `bg-gradient-to-r from-red-600 to-red-700 border-red-400/50 ${getButtonShadow('red')}`
                    : `${currentTheme.buttonBg} ${currentTheme.buttonBorder}`
                }`}
              >
                {gameState === "result" ? (
                  <>
                    <span className="text-white font-bold text-lg">
                      {isWinning ? "😄 You Are Winner!" : "😭 You Lose!"}
                    </span>
                    <span className="text-white text-sm font-semibold">
                      {multiplier} | Profit: ${totalProfit}
                    </span>
                  </>
                ) : (
                  <span className={`${currentTheme.textPrimary} font-bold text-lg`}>1.00x</span>
                )}
                {gameState === "result" && (
                  <>
                    <WinFireAnimation isActive={isWinning} />
                    <FireAnimation isActive={!isWinning} />
                  </>
                )}
              </div>
              
              {/* Position 11 - 1.11x */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(11)}`}
              >
                1.11x
                <WinFireAnimation isActive={shouldShowFireAnimation(11) && isWinPosition(11)} />
                <FireAnimation isActive={shouldShowFireAnimation(11) && !isWinPosition(11)} />
              </button>

              {/* BOTTOM ROW */}
              {/* Position 12 - 1.40x */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(12)}`}
              >
                1.40x
                <WinFireAnimation isActive={shouldShowFireAnimation(12) && isWinPosition(12)} />
                <FireAnimation isActive={shouldShowFireAnimation(12) && !isWinPosition(12)} />
              </button>
              
              {/* Position 13 - LOSE */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(13)}`}
              >
                <span className="text-2xl text-white">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(13)} />
              </button>
              
              {/* Position 14 - 2.50x */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.textPrimary} font-bold ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(14)}`}
              >
                2.50x
                <WinFireAnimation isActive={shouldShowFireAnimation(14) && isWinPosition(14)} />
                <FireAnimation isActive={shouldShowFireAnimation(14) && !isWinPosition(14)} />
              </button>
              
              {/* Position 15 - LOSE */}
              <button
                className={`relative w-20 h-20 ${currentTheme.buttonBg} rounded-xl flex items-center justify-center ${currentTheme.buttonBorder} hover:shadow-xl transition-all duration-300 hover:scale-105 ${getPositionStyle(15)}`}
              >
                <span className="text-2xl text-white">💀</span>
                <FireAnimation isActive={shouldShowFireAnimation(15)} />
              </button>
            </div>

            {/* Dice Sum & Position Info */}
            {gameState !== "betting" && (
              <div className={`text-center mt-6 ${isDarkTheme ? 'bg-slate-600/30' : 'bg-white/30'} backdrop-blur-sm rounded-xl p-4 ${getButtonShadow()} ${currentTheme.border}`}>
                <div className={`${currentTheme.textSecondary} font-semibold`}>
                  🎲 Dice Sum: <span className="text-yellow-400 font-bold">{dice1 + dice2}</span> | 
                  📍 Position: <span className="text-blue-400 font-bold">{playerPosition}</span> | 
                  🎯 Value: <span className="text-purple-400 font-bold">{gridMultipliers[playerPosition]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${isDarkTheme ? 'bg-gradient-to-r from-slate-900 to-slate-800' : 'bg-gradient-to-r from-white to-gray-100'} border-t ${isDarkTheme ? 'border-slate-600/50' : 'border-gray-300/50'} px-3 sm:px-6 py-3 sm:py-4 backdrop-blur-xl ${getButtonShadow()}`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex gap-3 sm:gap-6">
            <Settings className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.textMuted} hover:${currentTheme.textPrimary} cursor-pointer transition-colors duration-300 hover:scale-110`} />
            <BarChart3 className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.textMuted} hover:${currentTheme.textPrimary} cursor-pointer transition-colors duration-300 hover:scale-110`} />
            <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.textMuted} hover:${currentTheme.textPrimary} cursor-pointer transition-colors duration-300 hover:scale-110`} />
            <ExternalLink className={`w-5 h-5 sm:w-6 sm:h-6 ${currentTheme.textMuted} hover:${currentTheme.textPrimary} cursor-pointer transition-colors duration-300 hover:scale-110`} />
          </div>
          <div className={`${currentTheme.textMuted} text-xs sm:text-sm font-medium ${isDarkTheme ? 'bg-slate-800/50' : 'bg-white/50'} px-2 sm:px-3 py-1 rounded-lg ${currentTheme.border}`}>
            🎮 Demo Game - No Real Money
          </div>
          <button className={`${isDarkTheme ? 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500' : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400'} px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl ${currentTheme.textPrimary} text-xs sm:text-sm font-semibold ${getButtonShadow()} ${currentTheme.buttonBorder} transition-all duration-300 hover:scale-105`}>
            ⚖️ Fairness
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { ICONS } from './constants';
import { AppState, UserSegment } from './types';
import { runSimulation } from './services/engine';
import { InputSection } from './components/InputSection';
import { MetricsGrid } from './components/MetricsGrid';
import { EnergyChart } from './components/charts/EnergyChart';
import { BatteryChart } from './components/charts/BatteryChart';
import { SavingsChart } from './components/charts/SavingsChart';

// Initial default state
const DEFAULT_STATE: AppState = {
  latitude: 12.97, // Bengaluru
  longitude: 77.59,
  solarCapacityKW: 50,
  batteryCapacityKWh: 100,
  segment: UserSegment.TECH_PARK,
  gridTariff: 10.0,
};

function App() {
  const [inputs, setInputs] = useState<AppState>(DEFAULT_STATE);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Recalculate simulation whenever inputs change
  const simulationResults = useMemo(() => {
    return runSimulation(inputs);
  }, [inputs]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Dashboard Background: Bluish-Green Gradients */}
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50/30 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/30 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        
        {/* Navigation Bar: Glassmorphism with Teal tint */}
        <header className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-teal-100/50 dark:border-teal-900/30 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo with matching Teal/Emerald gradient */}
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-teal-500/20">
                {ICONS.Leaf}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SolarCharge CarbonFi</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">EV Optimization & Carbon Credit Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               {/* Grid Status Indicator */}
               <div className="hidden md:flex items-center gap-2 bg-teal-50/50 dark:bg-slate-800 px-3 py-1 rounded-full border border-teal-100 dark:border-slate-700">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-xs font-semibold text-teal-700 dark:text-slate-300">Grid Connected</span>
               </div>
               
               {/* Theme Toggle */}
               <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-teal-50/50 dark:bg-slate-800 text-teal-600 dark:text-slate-400 hover:bg-teal-100 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-teal-100 dark:hover:border-slate-600"
                aria-label="Toggle Dark Mode"
               >
                 {isDarkMode ? ICONS.Sun : ICONS.Moon}
               </button>

               <button className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-teal-600 dark:to-emerald-600 hover:shadow-lg dark:hover:shadow-teal-500/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:-translate-y-0.5">
                 Export Report
               </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Configuration (3/12 cols) */}
            <div className="lg:col-span-3">
              <InputSection inputs={inputs} setInputs={setInputs} />
              
              {/* Contextual Tip */}
              <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800/50 p-4 rounded-xl shadow-sm">
                <div className="flex gap-3">
                  <div className="text-cyan-600 dark:text-cyan-400 mt-1">{ICONS.Sun}</div>
                  <div>
                     <h4 className="text-sm font-bold text-cyan-900 dark:text-cyan-200 mb-1">Recommendation</h4>
                     <p className="text-xs text-cyan-800 dark:text-cyan-200/80 leading-relaxed">
                       Based on your <strong>{inputs.segment === UserSegment.TECH_PARK ? 'Daytime Peak' : 'Usage'}</strong>, consider increasing battery storage to <strong>{(inputs.solarCapacityKW * 2.5).toFixed(0)} kWh</strong> to capture more afternoon solar for evening discharge.
                     </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dashboard (9/12 cols) */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* Top Level KPIs */}
              <MetricsGrid summary={simulationResults.summary} />

              {/* Chart Section 1: Energy Mix */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Solar Generation vs EV Demand</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Real-time optimization of solar consumption</p>
                  </div>
                  <div className="flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span> Solar
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span> Demand
                    </div>
                  </div>
                </div>
                <EnergyChart data={simulationResults.hourlyData} darkMode={isDarkMode} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section 2: Financials */}
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50 transition-colors duration-300">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cost Savings Analysis</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Grid Import costs with and without Solar</p>
                  </div>
                  <SavingsChart data={simulationResults.hourlyData} darkMode={isDarkMode} />
                </div>

                 {/* Chart Section 3: Battery */}
                 <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50 transition-colors duration-300">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Battery State of Charge (SOC)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Optimized charging/discharging cycle</p>
                  </div>
                  <BatteryChart data={simulationResults.hourlyData} capacity={inputs.batteryCapacityKWh} darkMode={isDarkMode} />
                </div>
              </div>

              {/* Bottom ROI Section */}
              <div className="bg-slate-900 dark:bg-black rounded-2xl p-8 text-white relative overflow-hidden border border-slate-800 dark:border-slate-800 shadow-2xl">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                     <div>
                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Projected Annual ROI</h3>
                        <p className="text-slate-400 max-w-lg">
                          By combining electricity savings and carbon credit revenue, your station achieves faster breakeven.
                        </p>
                     </div>
                     <div className="text-right">
                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Annual Net Benefit</div>
                        <div className="text-4xl font-bold text-emerald-400 drop-shadow-sm">₹{(simulationResults.summary.totalDailyBenefit * 365).toLocaleString()}</div>
                        <div className="text-xs text-emerald-300 bg-emerald-900/50 border border-emerald-800 px-2 py-1 rounded inline-block mt-2">
                          + {(simulationResults.summary.dailyCarbonCredits * 365).toFixed(1)} tons CO₂ Offset
                        </div>
                     </div>
                  </div>
                  {/* Decorative background element */}
                  <div className="absolute -right-20 -bottom-40 w-80 h-80 bg-emerald-500 rounded-full opacity-10 blur-3xl"></div>
                  <div className="absolute -left-20 -top-40 w-60 h-60 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
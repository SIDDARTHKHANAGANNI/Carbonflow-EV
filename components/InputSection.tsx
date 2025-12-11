import React from 'react';
import { AppState, UserSegment } from '../types';
import { getTariffForSegment } from '../services/engine';
import { ICONS } from '../constants';

interface Props {
  inputs: AppState;
  setInputs: React.Dispatch<React.SetStateAction<AppState>>;
}

export const InputSection: React.FC<Props> = ({ inputs, setInputs }) => {
  
  const handleSegmentChange = (s: UserSegment) => {
    setInputs(prev => ({
      ...prev,
      segment: s,
      gridTariff: getTariffForSegment(s)
    }));
  };

  const handleChange = (field: keyof AppState, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full transition-colors duration-300">
      <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
        {ICONS.Settings}
        <h2 className="font-bold text-lg">Station Configuration</h2>
      </div>

      <div className="space-y-6">
        {/* Location Simulation */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Location (Simulated NASA Data)</label>
          <div className="flex gap-2">
            <div className="relative w-full">
               <input 
                type="number" 
                value={inputs.latitude} 
                onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-slate-100 transition-colors"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">Lat</span>
            </div>
            <div className="relative w-full">
               <input 
                type="number" 
                value={inputs.longitude} 
                onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-slate-100 transition-colors"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">Lon</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            NASA Power API Connected
          </div>
        </div>

        {/* Customer Segment */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Customer Segment</label>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleSegmentChange(UserSegment.TECH_PARK)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all duration-300 group
                ${inputs.segment === UserSegment.TECH_PARK 
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <div className={inputs.segment === UserSegment.TECH_PARK ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}>
                {ICONS.TechPark}
              </div>
              <div className="text-left">
                <div className="font-medium">Tech Park / Commercial</div>
                <div className="text-xs opacity-75">High Day Demand • ₹10.0/kWh</div>
              </div>
            </button>
            <button 
              onClick={() => handleSegmentChange(UserSegment.INSTITUTION)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all duration-300 group
                ${inputs.segment === UserSegment.INSTITUTION 
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <div className={inputs.segment === UserSegment.INSTITUTION ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}>
                {ICONS.Institution}
              </div>
              <div className="text-left">
                <div className="font-medium">Institution / Hospital</div>
                <div className="text-xs opacity-75">Mixed Usage • ₹8.5/kWh</div>
              </div>
            </button>
            <button 
              onClick={() => handleSegmentChange(UserSegment.RESIDENTIAL)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all duration-300 group
                ${inputs.segment === UserSegment.RESIDENTIAL 
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
               <div className={inputs.segment === UserSegment.RESIDENTIAL ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}>
                {ICONS.Home}
              </div>
              <div className="text-left">
                <div className="font-medium">Residential Complex</div>
                <div className="text-xs opacity-75">Overnight Charging • ₹6.5/kWh</div>
              </div>
            </button>
          </div>
        </div>

        {/* Technical Specs */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">System Specs</label>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-300">Solar Capacity</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{inputs.solarCapacityKW} kW</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="1"
                value={inputs.solarCapacityKW}
                onChange={(e) => handleChange('solarCapacityKW', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-300">Battery Storage</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{inputs.batteryCapacityKWh} kWh</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" step="5"
                value={inputs.batteryCapacityKWh}
                onChange={(e) => handleChange('batteryCapacityKWh', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
           <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-lg text-center shadow-lg border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Current Grid Tariff</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ₹{inputs.gridTariff.toFixed(1)}
                <span className="text-sm font-normal text-slate-400 ml-1">/kWh</span>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
import { AppState, HourlyDataPoint, SimulationResult, UserSegment } from '../types';

// Constants for simulation
const INDIA_AVG_CO2_PER_KWH = 0.82; // kg CO2 per kWh (Grid intensity)
const CARBON_CREDIT_PRICE_PER_TON_INR = 1500; // Conservative voluntary market price in Rupees
const CHARGER_EFFICIENCY = 0.95;

// Default tariffs based on segment
export const getTariffForSegment = (segment: UserSegment): number => {
  switch (segment) {
    case UserSegment.TECH_PARK: return 10.0;
    case UserSegment.INSTITUTION: return 8.5;
    case UserSegment.RESIDENTIAL: return 6.5;
    default: return 9.0;
  }
};

/**
 * Simulates a 24-hour cycle of Solar Generation vs EV Demand
 * logic mimics NASA POWER data availability and typical usage patterns.
 */
export const runSimulation = (inputs: AppState): SimulationResult => {
  const hourlyData: HourlyDataPoint[] = [];
  let currentBatteryLevel = inputs.batteryCapacityKWh * 0.2; // Start day at 20%
  
  let totalGridCost = 0;
  let totalCostWithoutSolar = 0;
  let totalSolarUsedDirectly = 0;
  let totalBatteryDischarged = 0;

  for (let i = 0; i < 24; i++) {
    const hourLabel = `${i}:00`;
    
    // 1. Simulate Solar Curve (Gaussian-ish curve between 6am and 6pm)
    // Peak sun hours roughly 10am - 2pm.
    let solarGen = 0;
    if (i >= 6 && i <= 18) {
      // Simple parabola for solar curve simulation
      const peak = inputs.solarCapacityKW * 0.85; // Peak efficiency factor
      const normalizedTime = (i - 6) / 12; // 0 to 1
      solarGen = Math.max(0, peak * Math.sin(normalizedTime * Math.PI));
    }

    // 2. Simulate EV Demand
    // Tech parks: Morning arrivals (8-10am), Evening departures (5-7pm) + trickle
    // Residential: Overnight charging
    let evDemand = 0;
    
    // Base load (always on logic)
    evDemand += 2; 

    if (inputs.segment === UserSegment.TECH_PARK) {
      if (i >= 8 && i <= 11) evDemand += 15; // Morning rush
      if (i >= 16 && i <= 19) evDemand += 10; // Evening topups
      if (i > 11 && i < 16) evDemand += 5; // Day trickle
    } else if (inputs.segment === UserSegment.RESIDENTIAL) {
      if (i >= 18 || i <= 7) evDemand += 12; // Night charging
    } else {
      // Mixed/Institution
      if (i >= 9 && i <= 17) evDemand += 8;
    }
    
    // Add some randomness to make charts look organic
    evDemand = evDemand * (0.9 + Math.random() * 0.2);
    
    // 3. Energy Logic
    // Can we cover demand with Solar?
    let gridNeeded = 0;
    let batteryCharge = 0;
    let batteryDischarge = 0;

    const surplusSolar = Math.max(0, solarGen - evDemand);
    const deficitPower = Math.max(0, evDemand - solarGen);

    if (surplusSolar > 0) {
      // Charge Battery
      const spaceIBattery = inputs.batteryCapacityKWh - currentBatteryLevel;
      batteryCharge = Math.min(surplusSolar, spaceIBattery);
      currentBatteryLevel += batteryCharge;
      // Remaining surplus is exported (ignored for simplicity here or net metering)
    } else {
      // Need power. Check Battery first.
      // Simple logic: Discharge if battery > 20%
      const availableBattery = Math.max(0, currentBatteryLevel - (inputs.batteryCapacityKWh * 0.1)); // Keep 10% buffer
      
      if (availableBattery > deficitPower) {
        batteryDischarge = deficitPower;
        currentBatteryLevel -= batteryDischarge;
      } else {
        batteryDischarge = availableBattery;
        currentBatteryLevel -= availableBattery;
        gridNeeded = deficitPower - batteryDischarge;
      }
    }

    // Cost Calculation
    const costStepSolar = gridNeeded * inputs.gridTariff;
    const costStepNoSolar = evDemand * inputs.gridTariff;

    totalGridCost += costStepSolar;
    totalCostWithoutSolar += costStepNoSolar;
    totalSolarUsedDirectly += (solarGen - surplusSolar) + batteryCharge; // Used for EV or stored
    totalBatteryDischarged += batteryDischarge;

    hourlyData.push({
      hour: hourLabel,
      solarGeneration: parseFloat(solarGen.toFixed(2)),
      evDemand: parseFloat(evDemand.toFixed(2)),
      gridUsage: parseFloat(gridNeeded.toFixed(2)),
      batteryLevel: parseFloat(currentBatteryLevel.toFixed(2)),
      batteryCharge: parseFloat(batteryCharge.toFixed(2)),
      batteryDischarge: parseFloat(batteryDischarge.toFixed(2)),
      costWithSolar: parseFloat(costStepSolar.toFixed(2)),
      costWithoutSolar: parseFloat(costStepNoSolar.toFixed(2)),
    });
  }

  // Summary Calculations
  const totalSolarContribution = totalSolarUsedDirectly + totalBatteryDischarged; // Effective solar used
  const dailySolarSavings = totalCostWithoutSolar - totalGridCost;
  const dailyCO2Avoided = totalSolarContribution * INDIA_AVG_CO2_PER_KWH;
  const dailyCarbonCredits = dailyCO2Avoided / 1000; // 1 Credit = 1 Ton
  const dailyCarbonRevenue = dailyCarbonCredits * CARBON_CREDIT_PRICE_PER_TON_INR;
  
  const totalDemand = hourlyData.reduce((acc, curr) => acc + curr.evDemand, 0);

  return {
    hourlyData,
    summary: {
      dailyGridCost: parseFloat(totalGridCost.toFixed(2)),
      dailySolarSavings: parseFloat(dailySolarSavings.toFixed(2)),
      dailyCO2Avoided: parseFloat(dailyCO2Avoided.toFixed(2)),
      dailyCarbonCredits: parseFloat(dailyCarbonCredits.toFixed(4)),
      dailyCarbonRevenue: parseFloat(dailyCarbonRevenue.toFixed(2)),
      totalDailyBenefit: parseFloat((dailySolarSavings + dailyCarbonRevenue).toFixed(2)),
      solarSelfConsumption: parseFloat(totalSolarContribution.toFixed(2)),
      percentSelfPowered: totalDemand > 0 ? parseFloat(((totalSolarContribution / totalDemand) * 100).toFixed(1)) : 0
    }
  };
};
export enum UserSegment {
  TECH_PARK = 'TECH_PARK',
  INSTITUTION = 'INSTITUTION',
  RESIDENTIAL = 'RESIDENTIAL',
}

export interface AppState {
  latitude: number;
  longitude: number;
  solarCapacityKW: number;
  batteryCapacityKWh: number;
  segment: UserSegment;
  gridTariff: number; // Calculated based on segment or custom
}

export interface HourlyDataPoint {
  hour: string;
  solarGeneration: number;
  evDemand: number;
  gridUsage: number;
  batteryLevel: number; // SoC in kWh
  batteryDischarge: number;
  batteryCharge: number;
  costWithoutSolar: number;
  costWithSolar: number;
}

export interface FinancialSummary {
  dailyGridCost: number;
  dailySolarSavings: number; // Money saved on electricity bill
  dailyCO2Avoided: number; // kg
  dailyCarbonCredits: number; // units (approx)
  dailyCarbonRevenue: number; // ₹
  totalDailyBenefit: number; // Savings + Revenue
  solarSelfConsumption: number; // kWh
  percentSelfPowered: number; // %
}

export interface SimulationResult {
  hourlyData: HourlyDataPoint[];
  summary: FinancialSummary;
}
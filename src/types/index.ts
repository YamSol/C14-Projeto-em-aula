export interface VitalSigns {
  heartRate: number;
  oxygenSaturation: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
}

export interface PatientCreateData {
  name: string;
  age: number;
  condition: string;
  photo?: Express.Multer.File;
}

export interface PatientResponse {
  id: string;
  name: string;
  age: number;
  condition: string;
  photoUrl?: string;
  transmissionsCount: number;
  lastTransmission: string;
  createdAt: string;
  updatedAt: string;
  currentVitalSigns: VitalSigns;
}

export interface VitalSignsHistoryPoint {
  timestamp: string;
  vitalSigns: VitalSigns;
}

export interface PatientStats {
  averages: {
    last24h: VitalSigns;
    last7days: VitalSigns;
    lastMonth: VitalSigns;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

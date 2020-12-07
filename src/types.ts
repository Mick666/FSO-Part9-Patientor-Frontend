export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export type GenderIcon = 'mars' | 'venus' | 'genderless' | undefined;

export type HeartColor = 'green' | 'yellow' | 'orange' | 'red' | undefined;

export type NewEntry = 
    | Omit<HospitalEntry, 'id'> 
    | Omit<OccupationalHealthcareEntry, 'id'>  
    | Omit<HealthCheckEntry, 'id'> ;

export type NewHospitalEntry = Omit<HospitalEntry, 'id'> ;
export type NewOcccupationalHealthcareEntry = Omit<OccupationalHealthcareEntry, 'id'> ;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
}

export interface DetailedPatientInfo {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

export interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: Discharge;
}

interface Discharge {
    date: string;
    criteria: string;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: SickLeave;
}

interface SickLeave {
    startDate: string;
    endDate: string;
}

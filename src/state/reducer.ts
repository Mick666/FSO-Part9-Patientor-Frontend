import { State } from "./state";
import { Patient, DetailedPatientInfo, Diagnosis, Entry } from "../types";

export type Action =
  | {
    type: "SET_PATIENT_LIST";
    payload: Patient[];
  }
  | {
    type: "ADD_PATIENT";
    payload: Patient;
  }
  | {
    type: "ADD_DETAILED_INFO";
    payload: DetailedPatientInfo;
  }
  | {
    type: "ADD_DIAGNOSES";
    payload: Diagnosis[];
  }
  | {
    type: "ADD_ENTRY";
    payload: DetailedPatientInfo;
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_DETAILED_INFO":
      return {
        ...state,
        patientInfo: {
          ...state.patientInfo,
          [action.payload.id]: action.payload
        }
      };
      case "ADD_ENTRY":
        return {
          ...state,
          patientInfo: {
            ...state.patientInfo,
            [action.payload.id]: action.payload
          }
        };
    case "ADD_DIAGNOSES":
        return {
          ...state,
          diagnoses: {
            ...action.payload.reduce(
              (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
              {}
            ),
            ...state.diagnoses
          }
        };
    default:
      return state;
  }
};


export const setPatientList = (payload: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: payload
  };
};

export const addPatient = (payload: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: payload
  };
};

export const addEntry = (payload: DetailedPatientInfo): Action => {
  return {
    type: "ADD_ENTRY",
    payload: payload
  };
};

export const addDetailedInfo = (payload: DetailedPatientInfo): Action => {
  return {
    type: "ADD_DETAILED_INFO",
    payload: payload
  };
};

export const setDiagnoses = (payload: Diagnosis[]): Action => {
  return {
    type: "ADD_DIAGNOSES",
    payload: payload
  };
};

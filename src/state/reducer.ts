import { State } from "./state";
import { Patient, DetailedPatientInfo } from "../types";
import { log } from "console";

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

export const addDetailedInfo = (payload: DetailedPatientInfo): Action => {
  return {
    type: "ADD_DETAILED_INFO",
    payload: payload
  };
};

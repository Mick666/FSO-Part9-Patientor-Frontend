import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Icon, Segment, Button } from 'semantic-ui-react';
import { apiBaseUrl } from "../constants";
import {
  DetailedPatientInfo, Entry, Gender, GenderIcon,
  HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, HeartColor, NewEntry
} from '../types';
import AddHealthCheckModal from './EntryForms/AddHealthCheckEntry';
import AddHospitalEntryModal from './EntryForms/AddHospitalEntry';
import AddOccupationalHealthEntryModal from './EntryForms/AddOccupationalHealthEntry';

import { useStateValue } from "../state";
import { addDetailedInfo, addEntry } from '../state/reducer';

const getGenderIcon = (patientGender: Gender): GenderIcon => {
  switch (patientGender) {
    case 'male':
      return 'mars';
    case 'female':
      return 'venus';
    case 'other':
      return 'genderless';
    default:
      return undefined;
  }
};

const getHeartColor = (rating: number): HeartColor => {
  switch (rating) {
    case 0:
      return "green";
    case 1:
      return "yellow";
    case 2:
      return "orange";
    case 3:
      return "red";
    default:
      return undefined;
  }
};

const HospitalEntryTable: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  const [{ diagnoses },] = useStateValue();
  return (
    <Segment>
      <div style={{ display: "flex" }}><h3 style={{ paddingRight: "5px" }}>{entry.date}</h3> <Icon name='doctor' size="large" /></div>
      Doctor: {entry.specialist} <br />
      <i>{entry.description}</i> <br />
      <i>{`Discharged: ${entry.discharge.date}, ${entry.discharge.criteria}`}</i> <br />
      <ul>
        {entry.diagnosisCodes?.map((code, index) => {
          if (!diagnoses[code]) return <div>Loading...</div>;
          return (
            <li key={index}>{code} {diagnoses[code].name}</li>
          );
        })}
      </ul>
    </Segment>
  );
};

const HealthCheckTable: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <Segment>
      <div style={{ display: "flex" }}><h3 style={{ paddingRight: "5px" }}>{entry.date}</h3> <Icon name='stethoscope' size="large" /></div>
      Doctor: {entry.specialist} <br />
      <i>{entry.description}</i> <br />
      <Icon name='heart' color={getHeartColor(entry.healthCheckRating)} />
    </Segment>
  );
};


const OccupationalHealthcareTable: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <Segment>
      <div style={{ display: "flex" }}><h3 style={{ paddingRight: "5px" }}>{entry.date}</h3> <Icon name='industry' size="large" /></div>
      Doctor: {entry.specialist} <br />
      Employer: {entry.employerName} <br />
      <i>{entry.description}</i> <br />
      {entry.sickLeave ? `Sick leave: ${entry.sickLeave?.startDate}:${entry.sickLeave?.endDate}` : null}
    </Segment>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled type: ${JSON.stringify(value)}`
  );
};

const EntryDetails = (entry: Entry) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryTable entry={entry} />;
    case "HealthCheck":
      return <HealthCheckTable entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareTable entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientInfo: React.FC = () => {
  const [{ patientInfo }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalHospitalEntry, setModalHospitalOpen] = React.useState<boolean>(false);
  const [modalOccHealthEntry, setModalOccHealthOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (modalFunc: Function): void => modalFunc(true);

  const closeModals = (): void => {
    setModalOpen(false);
    setModalHospitalOpen(false);
    setModalOccHealthOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    try {
      const newEntryValues = values;
      if (newEntryValues.diagnosisCodes?.every(x => x === '')) delete newEntryValues.diagnosisCodes;
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        newEntryValues
      );
      const updatedPatient = patientInfo[id];
      updatedPatient.entries.push(newEntry);
      dispatch(addEntry(updatedPatient));
      closeModals();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const fetchPatientInfo = async () => {
    try {
      const { data: detailedPatientInfo } = await axios.get<DetailedPatientInfo>(
        `${apiBaseUrl}/patients/${id}`
      );
      dispatch(addDetailedInfo(detailedPatientInfo));
    } catch (e) {
      console.error(e);
    }
  };

  if (!patientInfo[id]) {
    fetchPatientInfo();
    return (
      <div>Loading...</div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h2>{patientInfo[id].name}</h2>
        <Icon
          name={getGenderIcon(patientInfo[id].gender)}
          size='large'
        />
      </div>
      <p>Occupation: {patientInfo[id].occupation}</p>
      <p>{patientInfo[id].dateOfBirth ? `DoB: ${patientInfo[id].dateOfBirth}` : ''}</p>
      <p>{patientInfo[id].ssn ? `SSN: ${patientInfo[id].ssn}` : ''}</p>
      <h4>Entries:</h4>
      {patientInfo[id].entries.map(entry => EntryDetails(entry))}
      <AddHealthCheckModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModals}
      />
      <Button onClick={() => openModal(setModalOpen)}>Add New Health Check Entry</Button>
      <AddHospitalEntryModal
        modalOpen={modalHospitalEntry}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModals}
      />
      <Button onClick={() => openModal(setModalOccHealthOpen)}>Add New Hospital Entry</Button> <br />
      <AddOccupationalHealthEntryModal
        modalOpen={modalOccHealthEntry}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModals}
      />
      <Button onClick={() => openModal(setModalOccHealthOpen)}>Add New Occupational Health Check Entry</Button>
    </div>
  );
};

export default PatientInfo;
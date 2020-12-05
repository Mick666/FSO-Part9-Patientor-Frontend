import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Icon, Segment } from 'semantic-ui-react';
import { apiBaseUrl } from "../constants";
import {
  DetailedPatientInfo, Entry, Gender, GenderIcon,
  HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, HeartColor
} from '../types';

import { useStateValue } from "../state";
import { addDetailedInfo } from '../state/reducer';

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
  console.log(entry);
  return (
    <Segment>
      <div style={{ display: "flex" }}><h3 style={{ paddingRight: "5px" }}>{entry.date}</h3> <Icon name='doctor' size="large" /></div>
      Doctor: {entry.specialist} <br />
      <i>{entry.description}</i> <br />
      <ul>
        {entry.diagnosisCodes?.map(code => {
          return (
            <li>{code} {diagnoses[code].name}</li>
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


const EntryDetails = (entry: Entry) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryTable entry={entry} />;
    case "HealthCheck":
      return <HealthCheckTable entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareTable entry={entry} />;
    default:
      return null;
  }
};

const PatientInfoTable = (entry: Entry) => {
  const [{ diagnoses },] = useStateValue();
  return (
    <div>
      <h3 >{entry.date}</h3> 
      <i>{entry.description}</i> <br />
      <ul>
        {entry.diagnosisCodes?.map(code => {
          return (
            <li>{code} {diagnoses[code].name}</li>
          );
        })}
      </ul>
    </div>
  );
};

const PatientInfo: React.FC = () => {
  const [{ patientInfo }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

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
      {patientInfo[id].entries.map(entry => PatientInfoTable(entry))}
    </div>
  );
};

export default PatientInfo;
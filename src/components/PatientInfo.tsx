import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { apiBaseUrl } from "../constants";
import { DetailedPatientInfo } from '../types';

import { useStateValue } from "../state";
import { addDetailedInfo } from '../state/reducer';


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
          <div style={{display: 'flex'}}>
            <h2>{patientInfo[id].name}</h2> 
            <Icon
              name={patientInfo[id].gender === 'male' ? 'mars' :
              patientInfo[id].gender === 'female' ? 'venus' : 'genderless'}
              size='large'
            />
          </div>
            <p>Occupation: {patientInfo[id].occupation}</p>
            <p>{patientInfo[id].dateOfBirth ? `DoB: ${patientInfo[id].dateOfBirth}` : ''}</p>
            <p>{patientInfo[id].ssn ? `SSN: ${patientInfo[id].ssn}` : ''}</p>
        </div>
    );
};

export default PatientInfo;
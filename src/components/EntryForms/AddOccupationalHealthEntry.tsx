import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, DiagnosisSelection } from "../../AddPatientModal/FormField";
import { NewOcccupationalHealthcareEntry } from '../../types';
import { useStateValue } from "../../state";
import { Modal, Segment } from 'semantic-ui-react';

interface Props {
    onSubmit: (values: NewOcccupationalHealthcareEntry) => void;
    onCancel: () => void;
}


export const AddOccupationalHealthEntry: React.FC<Props> = ({ onSubmit, onCancel }) => {
    const [{ diagnoses },] = useStateValue();

    const submitForm = (entryData: NewOcccupationalHealthcareEntry): void => {
        const newEntryValues = entryData;
        if (newEntryValues.sickLeave?.startDate === '' &&  newEntryValues.sickLeave?.endDate === '') delete newEntryValues.sickLeave;
        onSubmit(newEntryValues);
    };

    return (
        <Formik
            initialValues={{
                date: "",
                description: "",
                specialist: "",
                diagnosisCodes: [""],
                employerName: "",
                sickLeave: { startDate: "", endDate: "" },
                type: "OccupationalHealthcare"
            }}
            onSubmit={submitForm}
            validate={values => {
                const requiredError = "Field is required";
                const errors: { [field: string]: string } = {};
                if (!values.date) {
                    errors.date = requiredError;
                }
                if (!values.description) {
                    errors.description = requiredError;
                }
                if (!values.specialist) {
                    errors.specialist = requiredError;
                }
                if (!values.diagnosisCodes) {
                    errors.diagnosisCodes = requiredError;
                }
                if ((!values?.sickLeave?.startDate && values?.sickLeave?.endDate) || (values?.sickLeave?.startDate && !values?.sickLeave?.endDate)) {
                    errors.sickLeave = requiredError;
                }
                return errors;
            }}
        >
            {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
                return (
                    <Form className="form ui">
                        <Field
                            label="Date"
                            placeholder="Date"
                            name="date"
                            component={TextField}
                        />
                        <Field
                            label="Description"
                            placeholder="Description"
                            name="description"
                            component={TextField}
                        />
                        <Field
                            label="Specialist"
                            placeholder="Specialist"
                            name="specialist"
                            component={TextField}
                        />
                        <Field
                            label="Employer Name"
                            placeholder="Employer Name"
                            name="employerName"
                            component={TextField}
                        />
                        <Field
                            label="Sick Leave Start Date"
                            placeholder="Sick Leave Start Date"
                            name="sickLeave.startDate"
                            component={TextField}
                        />
                        <Field
                            label="Sick Leave End Date"
                            placeholder="Sick Leave End Date"
                            name="sickLeave.endDate"
                            component={TextField}
                        />
                        <DiagnosisSelection
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            diagnoses={Object.values(diagnoses)}
                        />
                        <Grid>
                            <Grid.Column floated="left" width={5}>
                                <Button type="button" onClick={onCancel} color="red">
                                    Cancel
                                </Button>
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <Button
                                    type="submit"
                                    floated="right"
                                    color="green"
                                    disabled={!dirty || !isValid}
                                >
                                    Add
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};


interface ModalProps {
    modalOpen: boolean;
    onClose: () => void;
    onSubmit: (values: NewOcccupationalHealthcareEntry) => void;
    error?: string;
}

const AddOccupationalHealthEntryModal = ({ modalOpen, onClose, onSubmit, error }: ModalProps) => (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
        <Modal.Header>Add a new hospital entry</Modal.Header>
        <Modal.Content>
            {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
            <AddOccupationalHealthEntry onSubmit={onSubmit} onCancel={onClose} />
        </Modal.Content>
    </Modal>
);

export default AddOccupationalHealthEntryModal;
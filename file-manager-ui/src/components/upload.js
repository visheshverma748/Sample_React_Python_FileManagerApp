import React from "react";
import { Form, Button } from 'formik-semantic-ui';
import { ErrorMessage, Field } from 'formik';
import { Grid, Header, Message } from 'semantic-ui-react';
import * as Yup from 'yup';
import { FileDropZone } from "./drop-zone";
import { config } from "../env";


const addFilesSchema = Yup.object().shape({
    files: Yup.array().min(1, 'Files are required')
})


export class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isErr: false
        }
    }

    _handleSubmit = (values, formikApi) => {
        const formData = new FormData();
        const { location: { pathname } } = window;

        values['files'].forEach(file => { formData.append('files', file) });
        formData.append("pathname", pathname);

        formikApi.setSubmitting(true);
        this.setState({ isErr: false })

        fetch(config.uploadfile, {
            method: 'POST',
            body: formData,
        }).then(res => res.json()).then((resp) => {
            const { msg } = resp;
            if (msg == "error") {
                throw new Error("error")
            }
            formikApi.setSubmitting(false);
            this.props.onCancel();
        }).catch(err => {
            formikApi.setSubmitting(false);
            this.setState({ isErr: true })
        })
    }


    render() {
        return (
            <Grid columns={2} stackable>
                <React.Fragment>
                    <Grid.Column>
                        {this.state.isErr && (
                            <Message negative>
                                <Message.Header>Error occured</Message.Header>
                                <p>Some files were not uploaded try again</p>
                            </Message>
                        )}
                        <Header as='h1'>Upload Files</Header>
                        <Form initialValues={{ files: [] }} validationSchema={addFilesSchema} onSubmit={this._handleSubmit}>
                            {({ setFieldValue }) => (
                                <React.Fragment>
                                    <div className="field">
                                        <label>Files</label>
                                        <Field name="files" component={FileDropZone} />
                                        <ErrorMessage name="files" className="sui-error-message" component="div" />
                                    </div>
                                    <Button.Submit fluid secondary style={{ borderRadius: 'inherit' }}>Upload</Button.Submit>
                                </React.Fragment>
                            )}
                        </Form>
                        <Button fluid onClick={this.props.onCancel} color="red" style={{ borderRadius: 'inherit', marginTop:'10px' }}>Cancel</Button>
                    </Grid.Column>
                </React.Fragment>
            </Grid>
        )
    }
}
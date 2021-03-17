import React from "react";
import { Form, Button, Input } from 'formik-semantic-ui';
import { Grid, Header } from 'semantic-ui-react';
import * as Yup from 'yup';
import { config } from "../env";
import { Message } from 'semantic-ui-react';


const addFilesSchema = Yup.object().shape({
    foldername: Yup.string().required('Required')
})


export class NewFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDuplicateError: false
        }
    }

    _handleSubmit = (values, formikApi) => {
        const { location: { pathname } } = window;
        const data = { pathname: pathname, foldername: values.foldername };
        formikApi.setSubmitting(true);
        this.setState({ isDuplicateError: false })
        fetch(config.createfile, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                const {msg} = data;
                if(msg==="error"){
                   throw new Error("Foldr exists");
                }
                formikApi.setSubmitting(false);
                this.props.onCancel();
            })
            .catch((error) => {
                formikApi.setSubmitting(false);
                this.setState({ isDuplicateError: true })
            });
    }


    render() {
        return (
            <Grid columns={2} stackable>
                <React.Fragment>
                    <Grid.Column>
                        {this.state.isDuplicateError && (
                            <Message negative>
                                <Message.Header>Error occured</Message.Header>
                                <p>Make sure duplicate name shouldn't exists and try again</p>
                            </Message>
                        )}
                        <Header as='h1'>Create Folder</Header>
                        <Form initialValues={{ foldername: '' }} validationSchema={addFilesSchema} onSubmit={this._handleSubmit}>
                            {({ setFieldValue }) => (
                                <React.Fragment>
                                    <Input name="foldername" label='Folder Name' inputProps={{ placeholder: 'Folder Name', style: { border: '2px solid black' } }} />
                                    <Button.Submit fluid secondary style={{ borderRadius: 'inherit'}}>Create</Button.Submit>
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
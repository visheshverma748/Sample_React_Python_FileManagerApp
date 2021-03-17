import React, { useEffect, useState } from 'react';
import { Icon, Table, Button, Header, Loader, Message } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { config } from "../env";


export function FileLists(props) {
    const { match: { url }, setCount, location: { pathname }, history } = props;
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isDelError, setIsDelError] = useState(false);
    const [isDownloadError, setIsDownLoadError] = useState(false);

    function fetchData() {
        setIsLoading(true);
        setIsError(false);

        setIsDelError(false);
        setIsDownLoadError(false);

        const fetchUrl = `${config.files}?path=${url}`;
        fetch(fetchUrl)
            .then((res) => res.json()).then((res) => {
                setIsLoading(false);
                setIsError(false);
                const resdata = res.data;
                setData(resdata);
                setCount(resdata.length);
            }).catch(err => {
                setIsLoading(false);
                setIsError(true);
            });
    }

    useEffect(fetchData, [url]);

    function goBack() {
        history.goBack();
    }

    function onDownLoadClick(filename, type) {
        setIsDownLoadError(false);
        let downloadFileName = "", fetchUrl = "";
        if (type == "folder") {
            downloadFileName = `${filename}.zip`;
            fetchUrl = `${config.downloadfolder}?path=${pathname}&fldname=${filename}`;
        } else {
            downloadFileName = filename;
            fetchUrl = `${config.downloadfile}?path=${pathname}&filename=${filename}`;
        }
        fetch(fetchUrl)
            .then(response => {
                response.blob().then(blob => {
                    setIsDownLoadError(false);
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = downloadFileName;
                    a.click();
                });
            }).catch(function (e) {
                setIsDownLoadError(true);
            })
    }

    function onDeleteClick(filename, type) {
        setIsDelError(false);
        let fetchUrl = "";
        if (type == "folder") {
            fetchUrl = `${config.deletefolder}?path=${pathname}&fldname=${filename}`;
        } else {
            fetchUrl = `${config.deletefile}?path=${pathname}&filename=${filename}`;
        }

        fetch(fetchUrl)
            .then(res => res.json())
            .then(resp => {
                const { msg } = resp;
                if (msg == "error") {
                    throw new Error("Error");
                }
                setIsDelError(false);
                fetchData()
            }).catch(err => {
                setIsDelError(true);
            })
    }


    function getBackBtn() {
        if (pathname !== "/") {
            return (
                <Button style={{ display: 'block', marginBottom: '20px' }} onClick={goBack} secondary icon>
                    <Icon name='arrow left' />
                </Button>
            )
        }
        return null;
    }

    if (isLoading) {
        return (
            <React.Fragment>
                {getBackBtn()}
                <Loader active inline />
            </React.Fragment>
        )
    } else if (isError) {
        return (
            <React.Fragment>
                {getBackBtn()}
                <Message negative>
                    <Message.Header>Error occured</Message.Header>
                    <p>Try again error happend</p>
                </Message>
            </React.Fragment>
        )
    } else if (data && data.length === 0) {
        return (
            <React.Fragment>
                {getBackBtn()}
                <Message>
                    <Message.Header>No Files found</Message.Header>
                    <p>Sorry you haven't added any file</p>
                </Message>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                {getBackBtn()}
                {isDownloadError && (
                    <Message negative>
                        <Message.Header>Error occured</Message.Header>
                        <p>Unable to Download file</p>
                    </Message>
                )}
                {isDelError && (
                    <Message negative>
                        <Message.Header>Error occured</Message.Header>
                        <p>Unable to delete file or folders</p>
                    </Message>
                )}
                <Table basic='very' celled collapsing>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Files</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data && data.length > 0 && data.map((record, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>
                                    <Header as='h4' image>
                                        {record.type === "folder" && <Icon name='folder' />}
                                        {record.type === "file" && <Icon name='file' />}

                                        <Header.Content>
                                            {record.type === "folder" && pathname == "/" && <Link to={record.name}> {record.name}</Link>}
                                            {record.type === "folder" && pathname !== "/" && <Link to={`${pathname}/${record.name}`}> {record.name}</Link>}
                                            {record.type === "file" && record.name}
                                            <Header.Subheader>{record.description}</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => onDownLoadClick(record.name, record.type)} secondary style={{ borderRadius: 'inherit' , marginRight:'5px'}}>
                                        <Icon name='download' />
                                            Download
                                    </Button>

                                    <Button onClick={() => onDeleteClick(record.name, record.type)} color="red" style={{ borderRadius: 'inherit' , marginLeft:'5px'}}>
                                        <Icon name='delete' />
                                            Delete
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </React.Fragment>
        )
    }
}

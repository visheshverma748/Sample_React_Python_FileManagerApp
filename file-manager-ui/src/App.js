import React, { useState } from "react";
import { UploadForm } from "./components/upload";
import { FileLists } from "./components/file-list";
import { NewFolder } from "./components/new-folder";
import { Header, Button, Icon } from 'semantic-ui-react';
import { BrowserRouter as Router, Route } from "react-router-dom";



export default function App() {
    const [isNewFolderActive, setIsNewFolderActive] = useState(false);
    const [isUploadActive, setisUploadActive] = useState(false);
    const [count, setCount] = useState(0);

    function toggleNewFolderActive() {
        if (isUploadActive) {
            setisUploadActive(false);
        }
        setIsNewFolderActive(!isNewFolderActive)
    }

    function toggleUploadActive() {
        if (isNewFolderActive) {
            toggleNewFolderActive(false);
        }
        setisUploadActive(!isUploadActive);
    }

    function getheaderTitle() {
        const title = window.location.pathname.split("/").pop();
        return (title || "YOUR FOLDERS").toUpperCase();
    }

    return (
        <div className="conatiner">

            <div className="header-container">
                <div className="header">
                    <Header as='h2'>
                        <Icon name='folder' />
                        <Header.Content>
                            {getheaderTitle()}
                            <Header.Subheader>Total Items - ({count})</Header.Subheader>
                        </Header.Content>
                    </Header>
                </div>
                <div className="actions">
                    {!isNewFolderActive && (
                        <Button onClick={toggleNewFolderActive} secondary style={{ borderRadius: 'inherit', marginRight: '10px' }}>
                            <Icon name='add' />
                            New Folder
                    </Button>
                    )}
                    {!isUploadActive && (
                        <Button onClick={toggleUploadActive} secondary style={{ borderRadius: 'inherit',marginLeft:'10px'}}>
                            <Icon name='upload' />
                            Upload Files
                        </Button>
                    )}
                </div>
            </div>

            <div className="data-conatiner">
                {isUploadActive && <UploadForm onCancel={toggleUploadActive} />}
                {isNewFolderActive && <NewFolder onCancel={toggleNewFolderActive} />}
                {!isUploadActive && !isNewFolderActive && (
                    <Router>
                        <Route path={"/*"} render={(props) => <FileLists setCount={setCount} {...props} />} />
                    </Router>
                )}
            </div>
        </div>
    )

}
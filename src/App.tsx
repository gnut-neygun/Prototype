import React from 'react';
import './App.css';
import {Graph} from "./features/graph/Graph";
import {MuiThemeProvider, unstable_createMuiStrictModeTheme} from "@material-ui/core";
import PersistentDrawerLeft from "./features/data_panel/DataPanel";

const theme = unstable_createMuiStrictModeTheme();
function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <PersistentDrawerLeft/>
                <Graph/>
            </div>
        </MuiThemeProvider>
    );
}

export default App;

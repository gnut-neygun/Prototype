import React from 'react';
import './App.css';
import {Graph} from "./features/graph/Graph";
import {MuiThemeProvider, unstable_createMuiStrictModeTheme} from "@material-ui/core";
import PersistentDrawerLeft from "./features/data_panel/DataPanel";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {SimultaneousKPI} from "./features/simul_kpi/SimultaneousKPI";
import {ExecutionKPI} from "./features/simul_kpi/ExecutionKPI";

const theme = unstable_createMuiStrictModeTheme();
function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <div className="App">
                    <PersistentDrawerLeft/>
                    <Switch>
                        <Route exact path="/">
                            <Graph/>
                        </Route>
                        <Route exact path="/simul">
                            <SimultaneousKPI/>
                        </Route>
                        <Route exact path="/execution">
                            <ExecutionKPI/>
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        </MuiThemeProvider>
    );
}

export default App;

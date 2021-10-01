import React from 'react';
import './App.css';
import {MuiThemeProvider, unstable_createMuiStrictModeTheme} from "@material-ui/core";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PersistentDrawerLeft from "./ui/left_side_panel/DataPanel";
import {Graph} from "./ui/main_content/graph/Graph";
import {ExecutionKPI} from "./ui/main_content/simul_kpi/ExecutionKPI";
import {JitterPlot} from "./ui/main_content/simul_kpi/JitterPlot";
import {BoxPlot} from "./ui/main_content/simul_kpi/BoxPlot";

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
                        <Route exact path="/simul/events">
                            <JitterPlot/>
                        </Route>
                        <Route exact path="/execution">
                            <ExecutionKPI/>
                        </Route>
                        <Route exact path="/simul/boxplot">
                            <BoxPlot/>
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        </MuiThemeProvider>
    );
}

export default App;

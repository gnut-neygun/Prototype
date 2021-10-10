import React from 'react';
import './App.css';
import {StyledEngineProvider, ThemeProvider, unstable_createMuiStrictModeTheme,} from "@mui/material";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PersistentDrawerLeft from "./ui/left_side_panel/DataPanel";
import {Graph} from "./ui/main_content/graph/Graph";
import {ExecutionKPI} from "./ui/main_content/simul_kpi/ExecutionKPI";
import {JitterPlot} from "./ui/main_content/simul_kpi/JitterPlot";
import {BoxPlot} from "./ui/main_content/simul_kpi/BoxPlot";
import {observer} from "mobx-react-lite";

const theme = unstable_createMuiStrictModeTheme();

export const App= observer(() =>{
  return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </StyledEngineProvider>
  );
})

export default App;

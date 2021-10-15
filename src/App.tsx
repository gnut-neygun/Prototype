import React from 'react';
import './App.css';
import {StyledEngineProvider, ThemeProvider, unstable_createMuiStrictModeTheme,} from "@mui/material";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Graph} from "./ui/main_content/graph/Graph";
import {ExecutionKPI} from "./ui/main_content/kpis/ExecutionKPI";
import {JitterPlot} from "./ui/main_content/kpis/JitterPlot";
import {BoxPlot} from "./ui/main_content/kpis/BoxPlot";
import {observer} from "mobx-react-lite";
import "./utilities/kotlinScopeFunction"
import {DataPanel} from "./ui/left_side_panel/DataPanel";
import {RegularityKPI} from "./ui/main_content/kpis/RegularityKPI";

const theme = unstable_createMuiStrictModeTheme();

export const App= observer(() =>{
  return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <div className="App">
              <DataPanel/>
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
                <Route exact path="/regularity/raw">
                  <RegularityKPI/>
                </Route>
              </Switch>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
  );
})

export default App;

import React from 'react';
import './App.css';
import {StyledEngineProvider, ThemeProvider, unstable_createMuiStrictModeTheme,} from "@mui/material";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Graph} from "./ui/main_content/graph/Graph";
import {ExecutionKPI} from "./ui/main_content/kpis/ExecutionKPI";
import {EventDistribution} from "./ui/main_content/kpis/EventDistribution";
import {ClusterDistribution} from "./ui/main_content/kpis/ClusterDistribution";
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
                <Route exact path="/events">
                  <EventDistribution/>
                </Route>
                <Route exact path="/execution">
                  <ExecutionKPI/>
                </Route>
                <Route exact path="/clusters">
                  <ClusterDistribution/>
                </Route>
                <Route exact path="/pairs">
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

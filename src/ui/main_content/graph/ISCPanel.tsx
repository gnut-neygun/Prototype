import {Accordion, AccordionDetails, AccordionSummary, Theme, Typography} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {ExpandMore} from "@mui/icons-material";
import React from "react";
import {SimultaneousPanel} from "./simul_components/SimultaneousPanel";
import {observer} from "mobx-react-lite";
import {RegularityPanel} from "./regularity_components/RegularityPanel";
import {DataConstraintPanel} from "./data_components/DataConstraintPanel";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }),
);

export const ISCPanel = observer(() => {
    const classes = useStyles();
    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className={classes.heading}>Simultaneous constraints</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <SimultaneousPanel/>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className={classes.heading}>Data constraints</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <DataConstraintPanel/>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel3a-content"
                id="panel3a-header"
            >
                <Typography className={classes.heading}>Regularity Constraints</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <RegularityPanel/>
            </AccordionDetails>
        </Accordion>
    </div>;
})

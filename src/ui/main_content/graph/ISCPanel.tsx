import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    createStyles,
    makeStyles,
    Theme,
    Typography
} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";
import React from "react";
import {SimultaneousPanel} from "./simul_data_components/SimultaneousPanel";

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

export function ISCPanel() {
    const classes = useStyles();
    return <div>
        <Accordion expanded>
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
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                    sit amet blandit leo lobortis eget.
                </Typography>
            </AccordionDetails>
        </Accordion>
        <Accordion disabled>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel3a-content"
                id="panel3a-header"
            >
                <Typography className={classes.heading}>Regularity Constraints</Typography>
            </AccordionSummary>
        </Accordion>
    </div>;
}

import {Theme, useTheme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import {Link} from 'react-router-dom';
import {ExpandMore} from "@mui/icons-material";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        }
        }
    )
);

export function NavigationMenu() {
    const classes = useStyles();
    const theme = useTheme();
    return <>
        <Accordion>
            <AccordionSummary
                aria-controls="panel1a-content"
                id="panel3a-header"
            >
                <Typography className={classes.heading}>
                    <Link to="/">Main graph</Link>
                </Typography>
            </AccordionSummary>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel3a-content"
                id="panel3a-header"
            >
                <Typography className={classes.heading}>Simultaneous Constraints</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ul>
                    <li>
                        <Link to="/simul/events">Event Distribution</Link>
                    </li>
                    <li>
                        <Link to="/simul/boxplot">Simultaneous Clusters</Link>
                    </li>
                </ul>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography className={classes.heading}>Execution constraints</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    <Link to="/execution">Execution Chart</Link>
                </Typography>
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
                <Typography>
                    <Link to="/regularity/raw">Regularity raw data</Link>
                </Typography>
            </AccordionDetails>
        </Accordion>
    </>
}

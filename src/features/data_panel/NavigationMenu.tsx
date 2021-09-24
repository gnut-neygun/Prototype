import {makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
            //Style goes here
        }
    )
);

export function NavigationMenu() {
    const classes = useStyles();
    const theme = useTheme();
    return <ul>
        <li>
            <Link to="/">Main</Link>
        </li>
        <li>
            <Link to="/simul">Simultaneous Chart</Link>
        </li>
        <li>
            <Link to="/execution">Execution Chart</Link>
        </li>
    </ul>
}

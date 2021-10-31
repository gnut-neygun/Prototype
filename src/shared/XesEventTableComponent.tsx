import * as React from 'react';
import {useState} from 'react';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import {XesEvent} from "../algorithm/parser/XESModels";
import {TableFooter, TextField} from "@mui/material";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'instance',
        numeric: false,
        disablePadding: true,
        label: 'Instance',
    },
    {
        id: 'activity',
        numeric: false,
        disablePadding: false,
        label: 'Activity',
    },
    {
        id: 'lifecycle',
        numeric: false,
        disablePadding: false,
        label: 'Lifecycle',
    },
    {
        id: 'resouce',
        numeric: false,
        disablePadding: false,
        label: 'Resource',
    },
    {
        id: 'Timestamp',
        numeric: true,
        disablePadding: false,
        label: 'Timestamp',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function XesEventTable(props: EnhancedTableProps) {
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler =
        (property: string) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const EnhancedTableToolbar = (props: {numSelected: number, title: string}) => {
    const {numSelected, title} = props;

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

export default function EnhancedTable(props: { data: XesEvent[] , title: string}) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>('time:timestamp');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //filters
    const [instanceFilter, setInstanceFilter] = useState<string>("")
    const [activityFilter, setActivityFilter] = useState<string>("")
    const [lifecycleFilter, setLifecycleFilter] = useState<string>("")
    const [resourceFilter, setResourceFilter] = useState<string>("")
    const [timeFilter, setTimeFilter] = useState<string>("")
    const rows = props.data;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: string,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
                <EnhancedTableToolbar numSelected={selected.length} title={props.title}/>
                <TableContainer>
                    <Table
                        sx={{minWidth: 750}}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <XesEventTable
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.slice()
                                .filter(e => (e.instance()?.includes(instanceFilter) ?? true) &&
                                    e.name().includes(activityFilter) &&
                                    (e?.lifecycle()?.includes(lifecycleFilter) ?? (resourceFilter === "")) &&
                                    (e?.resource()?.includes(resourceFilter) ?? (resourceFilter === "")) &&
                                    e.timeString().includes(timeFilter))
                                .sort(getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.toString()}
                                >
                                <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                                >
                            {row.instance()}
                                </TableCell>
                                <TableCell align="left">{row.name()}</TableCell>
                                <TableCell align="left">{row.lifecycle()?? ""}</TableCell>
                                <TableCell align="left">{row.resource() ?? ""}</TableCell>
                                <TableCell align="left">{row.timeString()}</TableCell>
                                </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell align="left">
                                    <TextField size="small" onChange={(event) => {
                                        setInstanceFilter(event.target.value)
                                    }}/>
                                </TableCell>
                                <TableCell align="left">
                                    <TextField size="small" onChange={(event) => {
                                        setActivityFilter(event.target.value)
                                    }}/>
                                </TableCell>
                                <TableCell align="left">
                                    <TextField size="small" onChange={(event) => {
                                        setLifecycleFilter(event.target.value)
                                    }}/>
                                </TableCell>
                                <TableCell align="left">
                                    <TextField size="small" onChange={(event) => {
                                        setResourceFilter(event.target.value)
                                    }}/>
                                </TableCell>
                                <TableCell align="left">
                                    <TextField size="small" onChange={(event) => {
                                        setTimeFilter(event.target.value)
                                    }}/>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                label="Dense padding"
            />
        </Box>
    );
}
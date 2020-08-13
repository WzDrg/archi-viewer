import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import NetworkDiagram from './NetworkDiagram';
import { Paper, FormControl, Select, MenuItem, FormGroup, Switch, FormControlLabel, FormLabel, TextField } from '@material-ui/core';
import { CoreServicesContext } from '../../Context';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export default function NetworkPage() {
    const classes = useStyles();
    const [age, setAge] = React.useState('');
    const [state] = React.useState({
        checkedA: true,
        checkedB: true,
    });
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    const [options, setOptions] = useState({
        softwareSystem: null,
        date: null,
        level: "C1",
        environment: null
    })

    const coreServices = useContext(CoreServicesContext);

    // Update the software system names state
    const [loadingSoftwareSystemNames, setLoadingSoftwareSystemNames] = useState(true);
    const [softwareSystemNames, setSoftwareSystemNames] = useState([""]);
    async function getSoftwareSystemNames() {
        try {
            setLoadingSoftwareSystemNames(true);
            const names = await coreServices.getSoftwareSystemNames();
            setSoftwareSystemNames(["", ...names]);
        } finally {
            setLoadingSoftwareSystemNames(false);
        }
    }
    useEffect(() => { getSoftwareSystemNames() }, []);

    // Update the network
    const [loadingNetwork, setLoadingNetwork] = useState(false);
    const [network, setNetwork] = useState({ nodes: [], links: [] });
    async function getNetwork() {
        try {
            //            console.log(`level: ${options.level}`);
            setLoadingNetwork(true);
            const network = await coreServices.getNetwork(options);
            setNetwork(network);
        } finally {
            setLoadingNetwork(false);
        }
    }
    useEffect(() => { getNetwork() }, [options]);

    const handleSoftwareSystem = (event) =>
        setOptions({ ...options, softwareSystem: event.target.value });
    const handleLevel = (event) =>
        setOptions({ ...options, level: event.target.value });

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Paper>
                <FormControl margin="normal" className={classes.formControl}>
                    <FormLabel>SoftwareSystem</FormLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={options.softwareSystem}
                        onChange={handleSoftwareSystem}
                        displayEmpty
                        className={classes.selectEmpty}>
                        {softwareSystemNames.map(name =>
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <TextField margin="normal" className={classes.formControl}
                    id="date"
                    label="Date"
                    type="date"
                    defaultValue="2017-05-24"
                />
                <FormControl margin="normal" className={classes.formControl}>
                    <FormLabel>Level</FormLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={options.level}
                        onChange={handleLevel}
                        className={classes.selectEmpty}>
                        <MenuItem key="C1" value="C1">Context</MenuItem>
                        <MenuItem key="C2" value="C2">Container</MenuItem>
                        <MenuItem key="C3" value="C3">Component</MenuItem>
                        <MenuItem key="D" value="D">Deployment</MenuItem>
                    </Select>
                </FormControl>
                <FormControl margin="normal" className={classes.formControl}>
                    <FormLabel>Environment</FormLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={age}
                        onChange={handleChange}
                        displayEmpty
                        className={classes.selectEmpty}>
                        <MenuItem key="TST" value="TST">Test</MenuItem>
                        <MenuItem key="ACC" value="ACC">Acceptation</MenuItem>
                        <MenuItem key="EXP" value="EXP">Exploitation</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
            <Paper elevation={3}>
                <NetworkDiagram network={network} />
            </Paper>
        </div>
    );
}

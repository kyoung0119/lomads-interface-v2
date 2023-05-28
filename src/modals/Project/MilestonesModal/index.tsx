import React, { useState, useEffect } from "react";

import { Paper, Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";

import CloseSVG from 'assets/svg/closeNew.svg'
import MilestoneSVG from 'assets/svg/milestone.svg'
import CurrencyInput from "components/CurrencyInput";
import Dropdown from "components/Dropdown";
import TextEditor from "components/TextEditor";

import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { useDAO } from "context/dao";
import { useSafeTokens } from "context/safeTokens";
import { CHAIN_INFO } from 'constants/chainInfo';
import { useWeb3Auth } from "context/web3Auth";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalConatiner: {
        width: 575,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '27px !important',
        marginTop: '60px !important'
    },
    modalTitle: {
        color: '#C94B32',
        fontSize: '30px !important',
        fontWeight: '400',
        lineHeight: '33px !important',
        marginTop: '20px !important',
        marginBottom: '8px !important'
    },
    modalSubtitle: {
        color: '#76808d',
        fontSize: '14px !important',
        fontStyle: 'italic',
        marginBottom: '35px !important'
    },
    label: {
        fontSize: '16px !important',
        lineHeight: '18px !important',
        color: '#76808d',
        fontWeight: '700 !important',
        marginBottom: '8px !important'
    },
    dropdown: {
        background: 'linear-gradient(180deg, #FBF4F2 0 %, #EEF1F5 100 %) !important',
        borderRadius: '10px',
    },
    divider: {
        width: 210,
        border: '2px solid #C94B32',
        margin: '35px 0 !important'
    },
    mileStonePaper: {
        width: 340,
        padding: '20px 22px !important',
        background: '#FFF !important',
        boxShadow: '0px 3px 3px rgba(27, 43, 65, 0.1), -1px -2px 3px rgba(201, 75, 50, 0.05) !important',
        borderRadius: '5px !important',
        marginBottom: '35px !important'
    },
    paperTitle: {
        fontSize: '16px !important',
        fontWeight: '700 !important',
        lineHeight: '18px !important',
        color: '#B12F15',
        marginBottom: '20px !important'
    }
}));

interface Props {
    open: boolean;
    closeModal(): any;
    list: any[];
    getMilestones(action: any): void;
    getCompensation(action: any): void;
    editMilestones: boolean;
}

export default ({ open, closeModal, list, getMilestones, editMilestones, getCompensation }: Props) => {
    const classes = useStyles();
    const { DAO } = useDAO();
    const { safeTokens } = useSafeTokens();
    const { chainId } = useWeb3Auth();

    const [milestones, setMilestones] = useState<any[]>(list.length > 0 ? list : [{ name: '', amount: '0', deadline: '', deliverables: '', complete: false }]);
    const [milestoneCount, setMilestoneCount] = useState<number>(list.length > 0 ? list.length : 1);
    const [amount, setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('');

    const [errorNames, setErrorNames] = useState<number[]>([]);
    const [errorAmount, setErrorAmount] = useState<number[]>([]);
    const [errorDeadline, setErrorDeadline] = useState<number[]>([]);
    const [errorCurrency, setErrorCurrency] = useState<boolean>(false);
    const [errorProjectValue, setErrorProjectValue] = useState<boolean>(false);

    useEffect(() => {
        var date = new Date();
        var tdate: any = date.getDate();
        var month: any = date.getMonth() + 1;
        if (tdate < 10) {
            tdate = "0" + tdate;
        }
        if (month < 10) {
            month = "0" + month
        }
        var year = date.getUTCFullYear();
        var minDate = year + "-" + month + "-" + tdate;

        let element = document.getElementById("datepicker");
        if (element) {
            element.setAttribute("min", minDate);
        }
    }, [])

    const onChangeNumberOfMilestones = (e: number) => {
        let n = e;
        setMilestoneCount(n);
        let array = [...milestones];

        if (array.length === 0) {
            for (var i = 0; i < n; i++) {
                array.push({ name: '', amount: '0', deadline: '', deliverables: '', complete: false });
            }
        }
        else if (n > array.length) {
            let count = n - array.length;
            for (var i = 0; i < count; i++) {
                array.push({ name: '', amount: '0', deadline: '', deliverables: '', complete: false });
            }
        }
        else if (n < array.length) {
            let count = array.length - n;
            for (var i = 0; i < count; i++) {
                array.pop();
            }
        }

        for (var i = 0; i < milestones.length; i++) {
            var el = document.getElementById(`inputBox${i}`);
            if (el) {
                el.style.background = '';
            }
        }

        setMilestones(array);
    };

    const handleChangeName = (e: string, index: number) => {
        if (errorNames.includes(index)) {
            setErrorNames(errorNames.filter((i) => i !== index));
        }
        const newArray = milestones.map((item, i) => {
            if (i === index) {
                return { ...item, name: e };
            } else {
                return item;
            }
        });
        setMilestones(newArray);
    }

    const handleChangeAmount = (e: string, index: number) => {
        let amt: number = parseInt(e);
        if (errorAmount.includes(index)) {
            setErrorAmount(errorAmount.filter((i) => i !== index));
        }
        if (amt <= 100) {
            const newArray = milestones.map((item, i) => {
                if (i === index) {
                    return { ...item, amount: amt };
                } else {
                    return item;
                }
            });
            setMilestones(newArray);
        }
    }

    const handleChangeDeadline = (e: any, index: number) => {
        if (errorDeadline.includes(index)) {
            setErrorDeadline(errorDeadline.filter((i) => i !== index));
        }
        const newArray = milestones.map((item, i) => {
            if (i === index) {
                return { ...item, deadline: e };
            } else {
                return item;
            }
        });
        setMilestones(newArray);
    }

    const handleChangeDeliverables = (e: any, index: number) => {
        let element = document.getElementById(`deliverables${index}`);
        if (element) {
            element.innerHTML = "";
        }
        const newArray = milestones.map((item, i) => {
            if (i === index) {
                return { ...item, deliverables: e };
            } else {
                return item;
            }
        });
        setMilestones(newArray);
    }

    const handleChangeCompensationAmount = (e: any) => {
        setAmount(parseFloat(e));
        setErrorProjectValue(false);
    }

    const handleChangeCurrency = (e: any) => {
        setCurrency(e);
        setErrorCurrency(false);
    }

    const handleSubmit = () => {
        let flag = 0;
        let total = 0;
        if (currency === '') {
            setErrorCurrency(true);
            let e = document.getElementById('currency-amt');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
                return;
            }
        }
        if (amount === 0) {
            setErrorProjectValue(true);
            let symbol = _find(safeTokens, tkn => tkn.tokenAddress === currency);
            symbol = _get(symbol, 'token.symbol', null);
            if (!symbol)
                symbol = currency === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS ? CHAIN_INFO[chainId]?.nativeCurrency?.symbol : 'SWEAT'
            let e = document.getElementById('currency-amt');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        for (let i = 0; i < milestones.length; i++) {
            let ob = milestones[i];
            total += parseFloat(ob.amount);
            if (ob.name === '') {
                flag = -1;
                if (!errorNames.includes(i)) {
                    setErrorNames([...errorNames, i])
                }
                let e = document.getElementById(`paper${i}`);
                if (e) {
                    e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
                }
                return;
            }
            else if (ob.amount === '') {
                flag = -1;
                if (!errorAmount.includes(i)) {
                    setErrorAmount([...errorAmount, i])
                }
                let e = document.getElementById(`paper${i}`);
                if (e) {
                    e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
                }
                return;
            }
            else if (ob.deadline === '') {
                flag = -1;
                if (!errorDeadline.includes(i)) {
                    setErrorDeadline([...errorDeadline, i])
                }
                let e = document.getElementById(`paper${i}`);
                if (e) {
                    e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
                }
                return;
            }
        }
        if (total !== 100) {
            var x = document.getElementById(`amount${milestones.length - 1}`);
            if (x) {
                x.innerHTML = 'Total Project Value should be 100 %';
            }
            for (var i = 0; i < milestones.length; i++) {
                if (!milestones[i].complete) {
                    var el = document.getElementById(`inputBox${i}`);
                    if (el) {
                        el.style.background = 'rgba(217, 83, 79, 0.75)';
                    }
                }
            }
            return;
        }
        if (flag !== -1) {
            let symbol = _find(safeTokens, tkn => tkn.tokenAddress === currency)
            symbol = _get(symbol, 'token.symbol', null)
            if (!symbol)
                symbol = currency === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS ? CHAIN_INFO[chainId]?.nativeCurrency?.symbol : 'SWEAT'

            if (editMilestones) {
                // dispatch(editProjectMilestone({ projectId: _get(Project, '_id', ''), daoUrl: _get(DAO, 'url', ''), payload: { milestones, compensation: { currency, amount, symbol } } }));
            }
            else {
                getCompensation({ currency: currency, amount, symbol })
                getMilestones(milestones);
                closeModal();
            }
        }
    }

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 1 }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={MilestoneSVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Project Milestones</Typography>
                    <Typography className={classes.modalSubtitle}>Organise and link payments to milestones</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%' }}>

                    <Box display="flex" flexDirection="column" sx={{ width: 310, marginBottom: '25px' }} id="currency-amt">
                        <Typography className={classes.label}>Total Workspace Value</Typography>
                        <CurrencyInput
                            value={amount}
                            onChange={(value: any) => handleChangeCompensationAmount(value)}
                            options={safeTokens}
                            dropDownvalue={currency}
                            onDropDownChange={(value: any) => {
                                handleChangeCurrency(value)
                            }}
                            variant="primary"
                            errorCurrency={errorCurrency}
                            errorProjectValue={errorProjectValue}
                        />
                    </Box>

                    <Box display="flex" flexDirection="column" sx={{ width: 310 }}>
                        <Typography className={classes.label}>Milestones</Typography>
                        <Dropdown
                            options={[1, 2, 3, 4, 5]}
                            defaultValue={milestoneCount}
                            onChange={(value) => onChangeNumberOfMilestones(value)}
                        />
                    </Box>

                    {milestones.length > 0 && <Box className={classes.divider}></Box>}

                    {
                        milestones && milestones.map((item, index) => {
                            return (
                                <Paper className={classes.mileStonePaper} sx={{ display: 'flex', flexDirection: 'column' }} key={index} id={`paper${index}`}>
                                    <Typography className={classes.paperTitle}>Milestone {index + 1}</Typography>

                                    {/* Milestone Name */}
                                    <Box>
                                        <TextInput
                                            label="Name"
                                            placeholder="Milestone Name"
                                            fullWidth
                                            value={item.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeName(e.target.value, index)}
                                            disabled={item.complete}
                                            error={errorNames.includes(index)}
                                            id={errorNames.includes(index) ? "outlined-error-helper-text" : ""}
                                            helperText={errorNames.includes(index) ? "Please enter name" : ""}
                                        />
                                    </Box>

                                    {/* Milestone amount % */}
                                    <Box display={"flex"} alignItems={'center'} sx={{ marginBottom: '20px' }}>
                                        <TextInput
                                            type="number"
                                            InputProps={{
                                                inputProps: {
                                                    max: 100, min: 0, step: 1,
                                                    onKeyDown: (event: any) => {
                                                        event.preventDefault();
                                                    },
                                                }
                                            }}
                                            sx={{ width: 90 }}
                                            value={item.amount}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAmount(e.target.value, index)}
                                            placeholder={`${100 / milestoneCount}`}
                                            disabled={item.complete}
                                            error={errorAmount.includes(index)}
                                            id={errorAmount.includes(index) ? "outlined-error-helper-text" : ""}
                                            helperText={errorAmount.includes(index) ? "Enter %" : ""}
                                        />
                                        <Typography sx={{ fontWeight: '700', fontSize: 16, color: '#76808D', marginLeft: '13.5px' }}>% of project value</Typography>
                                    </Box>

                                    {/* Milestone deadline */}
                                    <Box sx={{ marginBottom: '20px' }}>
                                        {
                                            errorDeadline.includes(index)
                                                ?
                                                <TextInput
                                                    sx={{ width: 172 }}
                                                    label="Due date"
                                                    type="date"
                                                    value={item.deadline}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeDeadline(e.target.value, index)}
                                                    disabled={item.complete}
                                                    error
                                                    id="outlined-error-helper-text"
                                                    helperText="Please enter deadline"
                                                />
                                                :
                                                <TextInput
                                                    sx={{ width: 172 }}
                                                    label="Due date"
                                                    type="date"
                                                    value={item.deadline}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeDeadline(e.target.value, index)}
                                                    disabled={item.complete}
                                                />
                                        }
                                    </Box>

                                    <Box>
                                        <TextEditor
                                            fullWidth
                                            height={90}
                                            placeholder=""
                                            label="Deliverables"
                                            value={item.deliverables}
                                            onChange={(value: string) => handleChangeDeliverables(value, index)}
                                            disabled={item.complete}
                                        />
                                    </Box>
                                </Paper>
                            )
                        })
                    }

                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%' }}>
                        <Button variant="outlined" sx={{ marginRight: '20px', width: '169px' }} onClick={closeModal}>CANCEL</Button>
                        <Button variant="contained" onClick={handleSubmit} sx={{ width: '184px' }}>ADD</Button>
                    </Box>

                </Box>
            </Box>
        </Drawer>
    )
}
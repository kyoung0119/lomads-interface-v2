import React, { useState, useEffect, useMemo } from "react";
import { find as _find, get as _get, debounce as _debounce, findIndex as _findIndex, } from 'lodash';
import { Typography, Box, Drawer, MenuItem } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import CurrencyInput from "components/CurrencyInput";

import CloseSVG from 'assets/svg/closeNew.svg'

import { useDAO } from "context/dao";
import { useAppDispatch } from "helpers/useAppDispatch";
import { useAppSelector } from "helpers/useAppSelector";

import { beautifyHexToken } from "utils";
import { useSafeTokens } from "context/safeTokens";

import TASKSVG from 'assets/svg/task.svg'
import { IoIosArrowBack } from 'react-icons/io'
import compensationStar from 'assets/svg/compensationStar.svg';
import editToken from 'assets/svg/editToken.svg';
import compensationIcon from 'assets/svg/compensation.svg';
import { assignTaskAction, rejectTaskMemberAction } from "store/actions/task";

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
        paddingTop: '27px !important',
    },
    modalTitle: {
        color: '#C94B32',
        fontSize: '30px !important',
        fontWeight: '400',
        lineHeight: '33px !important',
        marginTop: '20px !important',
        marginBottom: '8px !important'
    },
    controlBtn: {
        width: '50px',
        height: '40px',
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        background: '#FFFFFF !important',
        border: 'none !important',
        boxShadow: '5px 5px 4px rgba(27, 43, 65, 0.05), 3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '0px 20px 20px 0px !important',
        cursor: 'pointer'
    },
    linkBtn: {
        width: '400px',
        height: '40px',
        marginTop: '10px !important',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '100px !important',
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        border: 'none !important',
        color: '#C94B32 !important',
        fontSize: 16,
        cursor: 'pointer'
    },
    compensationBox: {
        width: '100%',
        height: '67px',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px !important',
        padding: '0 22px !important',
        marginBottom: '22px !important'
    }

}));

interface Props {
    open: boolean;
    hideBackdrop: boolean;
    closeModal(): void;
}

export default ({ open, hideBackdrop, closeModal }: Props) => {
    const classes = useStyles();
    const { DAO } = useDAO();
    const dispatch = useAppDispatch();
    // @ts-ignore
    const { Task } = useAppSelector(store => store.task);
    const { safeTokens } = useSafeTokens();

    const [activeSubmission, setActiveSubmission] = useState<any>(null);
    const [showModifyCompensation, setShowModifyCompensation] = useState<boolean>(false);
    const [showRejectSubmission, setShowRejectSubmission] = useState<boolean>(false);

    const [safeAddress, setSafeAddress] = useState<string>('');
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState<string>('');
    const [errorCurrency, setErrorCurrency] = useState<boolean>(false);
    const [errorTaskValue, setErrorTaskValue] = useState<boolean>(false);

    const taskSubmissions = useMemo(() => {
        if (Task)
            return _get(Task, 'members', []).filter((member: any) => member.submission && (member.status !== 'submission_accepted' && member.status !== 'submission_rejected'))
        return []
    }, [Task]);

    useEffect(() => {
        if (!activeSubmission && taskSubmissions.length > 0)
            setActiveSubmission(taskSubmissions[0])
    }, [taskSubmissions]);

    const handleBack = () => {
        if (activeSubmission) {
            const currIndex = _findIndex(taskSubmissions, (t: any) => t._id === activeSubmission._id)
            const prevSubmission = _get(taskSubmissions, `${currIndex - 1}`, undefined)
            if (prevSubmission)
                setActiveSubmission(prevSubmission)
        }
    }

    const handleNext = () => {
        if (activeSubmission) {
            const currIndex = _findIndex(taskSubmissions, (t: any) => t._id === activeSubmission._id)
            const nextSubmission = _get(taskSubmissions, `${currIndex + 1}`, undefined)
            if (nextSubmission)
                setActiveSubmission(nextSubmission)
        }
    }

    const handleChangeCompensationAmount = (e: any) => {
        setAmount(parseFloat(e));
        setErrorTaskValue(false);
    }

    const handleChangeCurrency = (e: any) => {
        setCurrency(e);
        setErrorCurrency(false);
    }

    const updateCompensation = () => {
        return (
            <Drawer
                PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
                anchor={'right'}
                open={showModifyCompensation}
                hideBackdrop={false}
            >
                <Box className={classes.modalConatiner}>
                    <Box sx={{ width: '100%', padding: '0 27px' }} display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography sx={{ fontSize: 14, color: '#76808D', fontStyle: 'italic' }}>{_get(Task, 'name', '')}</Typography>
                        <IconButton onClick={() => setShowModifyCompensation(false)}>
                            <img src={CloseSVG} />
                        </IconButton>
                    </Box>
                    <Box sx={{ width: '100%', height: '100%' }} display="flex" flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                        <img src={compensationIcon} />
                        <Typography sx={{ fontSize: 30, color: '#C94B32', margin: '35px 0' }}>Change compensation</Typography>

                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{ width: '400px' }}
                            display="flex" alignItems={"center"} justifyContent={"center"}
                        >
                            <TextInput
                                id="outlined-select-currency"
                                select
                                fullWidth
                                label="Treasury"
                                value={safeAddress}
                                onChange={(e: any) => setSafeAddress(e.target.value)}
                            >
                                {
                                    DAO?.safes?.map((safe: any) => {
                                        return (
                                            <MenuItem key={safe?.address} value={safe?.address}>{(safe?.name || "Multi-sig wallet") + " (" + beautifyHexToken(safe?.address) + ")"}</MenuItem>
                                        )
                                    })
                                }
                            </TextInput>
                        </Box>

                        <Box sx={{ width: '400px', marginTop: '20px' }} display="flex" flexDirection={"column"} alignItems={"center"}>
                            {/* <Box display={"flex"} alignItems={"center"} sx={{ marginBottom: '10px' }}>
                                <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Compensation</Typography>
                            </Box> */}
                            <CurrencyInput
                                value={amount}
                                onChange={(value: any) => handleChangeCompensationAmount(value)}
                                options={_get(safeTokens, safeAddress, [])}
                                dropDownvalue={currency}
                                onDropDownChange={(value: any) => {
                                    handleChangeCurrency(value)
                                }}
                                variant="primary"
                                errorCurrency={errorCurrency}
                                errorProjectValue={errorTaskValue}
                            />
                        </Box>

                    </Box>
                </Box>
            </Drawer>

        )
    }

    const renderRejectTask = () => {
        return (
            <Box></Box>
        )
    }

    const renderSingleSubmission = (submission: any) => {
        // if (!submission) return null;
        return (
            <Box sx={{ width: '400px', height: '100%' }} display="flex" flexDirection={"column"}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={TASKSVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Jool did the job!</Typography>
                </Box>

                <Box sx={{ width: '100%', margin: '35px 0' }}>
                    <Typography sx={{ fontSize: '16px', color: '#76808D', marginBottom: '14px', fontWeight: '700' }}>Note</Typography>
                    <Typography
                    // dangerouslySetInnerHTML={{ __html: _get(applicant, 'note', '') }}
                    >
                        Hi, its done ! ipsum dolor sit amet, consecteur adsipicing elit,sed diam.
                    </Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <Typography sx={{ fontSize: '16px', color: '#76808D', marginBottom: '14px', fontWeight: '700' }}>Check submission</Typography>
                    <button className={classes.linkBtn}>CODE GITHUB</button>
                    <button className={classes.linkBtn}>SCREEN CAPTURE</button>
                    <button className={classes.linkBtn}>ABC</button>
                    <button className={classes.linkBtn}>XYZ</button>
                </Box>

                <Box className={classes.compensationBox} display="flex" alignItems="center" justifyContent={"space-between"}>
                    <Box display="flex" alignItems="center">
                        <Typography sx={{ fontSize: 16, color: '#76808D', marginRight: '15px' }}>Compensation</Typography>
                        <img src={compensationStar} alt="compensation-star" style={{ marginRight: '7px' }} />
                        <Typography>24 + 3 points</Typography>
                    </Box>
                    <img src={editToken} alt="edit-icon" onClick={() => { setShowModifyCompensation(true); }} />
                </Box>

                <Box sx={{ width: '100%' }} display="flex" alignItems={"center"} justifyContent={"space-between"}>
                    <Button variant="outlined">REJECT</Button>
                    <Button variant="contained">APPROVE</Button>
                </Box>

            </Box>
        )
    }

    const renderTaskApproval = () => {
        return (
            <Drawer
                PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
                anchor={'right'}
                open={open}
                hideBackdrop={hideBackdrop}
            >
                <Box className={classes.modalConatiner}>
                    <Box sx={{ width: '100%', padding: '0 27px' }} display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Typography sx={{ fontSize: 14, color: '#76808D', fontStyle: 'italic' }}>{_get(Task, 'name', '')}</Typography>
                        <IconButton onClick={closeModal}>
                            <img src={CloseSVG} />
                        </IconButton>
                    </Box>
                    <Box sx={{ width: '100%', height: '100%' }} display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Box sx={{ height: '100%' }} display="flex" alignItems="center">
                            {
                                taskSubmissions.length > 1 &&
                                <button className={classes.controlBtn} onClick={handleBack}>
                                    <IoIosArrowBack size={20} color="#C94B32" />
                                </button>
                            }
                        </Box>
                        <Box sx={{ height: '100%' }}>
                            {renderSingleSubmission(activeSubmission)}
                        </Box>
                        <Box sx={{ height: '100%' }} display="flex" alignItems="center">
                            {
                                taskSubmissions.length > 1 &&
                                <button className={classes.controlBtn} style={{ transform: 'rotate(180deg)' }} onClick={handleNext}>
                                    <IoIosArrowBack size={20} color="#C94B32" />
                                </button>
                            }
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        )
    }

    if (showModifyCompensation)
        return updateCompensation()

    if (showRejectSubmission)
        return renderRejectTask()

    return renderTaskApproval()
}
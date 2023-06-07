import React, { useEffect, useState, useMemo } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { makeStyles } from '@mui/styles';
import { Grid, Box, Typography, Menu, MenuItem } from "@mui/material";

import { IoIosArrowBack } from 'react-icons/io';
import { BsCalendarCheck } from 'react-icons/bs';
import compensationStar from 'assets/svg/compensationStar.svg';
import editToken from 'assets/svg/editToken.svg';
import deleteIcon from 'assets/svg/deleteIcon.svg';
import Button from "components/Button";
import FullScreenLoader from "components/FullScreenLoader";

import { useWeb3Auth } from 'context/web3Auth';
import { useDAO } from "context/dao";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "helpers/useAppDispatch";
import { useAppSelector } from "helpers/useAppSelector";
import { getTaskAction } from "store/actions/task";

import {
    TelegramIcon,
    TwitterIcon,
    WhatsappIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";

import copyIcon from "assets/svg/copyIcon.svg";
import shareIcon from 'assets/svg/share.svg';
import moment from "moment";
import Avatar from "components/Avatar";
import CloseTaskModal from "modals/Tasks/CloseTaskModal";
import DeleteTaskModal from "modals/Tasks/DeleteTaskModal";
import ApplyTaskModal from "modals/Tasks/ApplyTaskModal";
import SubmitTaskModal from "modals/Tasks/SubmitTaskModal";
import ApplicantListModal from "modals/Tasks/ApplicantListModal";
import ReviewModal from "modals/Tasks/ReviewModal";
import useTask from "hooks/useTask";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
    },
    arrowContainer: {
        width: '5% !important',
        height: '100% !important',
        borderRadius: '5px !important',
        marginRight: '0.2rem !important',
        background: '#FFF !important',
        cursor: 'pointer !important'
    },
    nameContainer: {
        width: '95% !important',
        height: '100% !important',
        borderRadius: '5px !important',
        background: '#FFF !important',
        padding: '0 32px !important'
    },
    nameText: {
        fontSize: '22px !important',
        lineHeight: '25px !important',
        color: '#76808D'
    },
    secondContainer: {
        width: '100%',
        height: 74,
        marginBottom: '0.2rem',
        background: '#FFF',
        borderRadius: '5px',
        padding: '0 22px !important'
    },
    thirdContainer: {
        width: '100%',
        height: 415,
    },
    fourthContainer: {
        width: '100%',
        marginTop: '23.5px !important',
    },
    descContainer: {
        width: '30%',
        height: '100%',
        background: '#FFF',
        borderRadius: '5px',
        padding: '30px 28px !important',
        marginRight: '0.2rem'
    },
    detailsContainer: {
        width: '70%',
        height: '100%',
        background: 'linear-gradient(178.31deg, #C94B32 0.74%, #A54536 63.87%)',
        borderRadius: '5px',
        padding: '0 22px !important',
    },
    closeBtn: {
        width: '165px',
        height: '40px',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), - 3px - 3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px !important',
        fontSize: '14px !important',
        color: '#C94B32 !important',
        marginLeft: '22px !important'
    },
    iconContainer: {
        height: '40px',
        width: '40px',
        background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%) !important',
        borderRadius: '5px !important',
        cursor: 'pointer !important',
        marginLeft: '22px !important'
    },
}));

export default () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { account } = useWeb3Auth();
    const { DAO } = useDAO();
    const { taskId, daoURL } = useParams();
    // @ts-ignore
    const { setTaskLoading, Task: storeTask } = useAppSelector(store => store.task);
    const { transformTask } = useTask()

    const Task = useMemo(() => {
        if(storeTask)
            return transformTask(storeTask)
    }, [storeTask])

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openCloseModal, setOpenCloseModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [openApplyModal, setOpenApplyModal] = useState<boolean>(false);
    const [openSubmitModal, setOpenSubmitModal] = useState<boolean>(false);
    const [openApplicantsModal, setOpenApplicantsModal] = useState<boolean>(false);
    const [openReviewModal, setOpenReviewModal] = useState<boolean>(!false);

    useEffect(() => {
        if (DAO && taskId && (!Task || (Task && Task._id !== taskId)))
            dispatch(getTaskAction(taskId));
    }, [taskId, DAO]);

    const assignedUser = useMemo(() => {
        let user = _find(_get(Task, 'members', []), m => m.status === 'approved' || m.status === 'submission_accepted')
        if (user)
            return user.member
    }, [Task]);

    if (!Task || setTaskLoading || (taskId && (Task && Task._id !== taskId))) {
        return (
            <FullScreenLoader />
        )
    }

    const showSubmissions = () => {
        return <div>

        </div>
    }

    const renderBody = (body: string) => {
        switch(body) {
            case 'SHOW_SUBMISSIONS': 
                return showSubmissions()
            default:
                return null
        }
    }

    return (
        <Grid container className={classes.root}>

            <CloseTaskModal
                open={openCloseModal}
                closeModal={() => setOpenCloseModal(false)}
            />

            <DeleteTaskModal
                open={openDeleteModal}
                closeModal={() => setOpenDeleteModal(false)}
            />

            <ApplyTaskModal
                open={openApplyModal}
                closeModal={() => setOpenApplyModal(false)}
                hideBackdrop={false}
            />

            <SubmitTaskModal
                open={openSubmitModal}
                closeModal={() => setOpenSubmitModal(false)}
                hideBackdrop={false}
            />

            <ApplicantListModal
                open={openApplicantsModal}
                closeModal={() => setOpenApplicantsModal(false)}
                hideBackdrop={false}
            />

            <ReviewModal
                open={openReviewModal}
                closeModal={() => setOpenReviewModal(false)}
                hideBackdrop={false}
            />

            <Grid xs={10} item display="flex" flexDirection="column" sx={{ margin: '10vh 0' }}>

                <Box sx={{ width: '100%', height: '32px' }}>
                    <Typography>{_get(Task, 'project.name', '')}</Typography>
                </Box>

                <Box sx={{ width: '100%', height: 74, marginBottom: '0.2rem' }} display="flex" alignItems="center">
                    <Box className={classes.arrowContainer} display="flex" alignItems="center" justifyContent={"center"} onClick={() => navigate(-1)}>
                        <IoIosArrowBack size={20} color="#C94B32" />
                    </Box>
                    <Box className={classes.nameContainer} display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Box display="flex" alignItems="center">
                            <Typography className={classes.nameText}>{_get(Task, 'name', '')}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Box display="flex" alignItems="center">
                                { 
                                    <Typography sx={{ fontSize: '14px', color: Task?.visual?.color }}>{ Task?.visual?.status }</Typography>
                                }
                            </Box>
                            <Box sx={{ marginLeft: '22px', cursor: 'pointer' }}>
                                <img src={editToken} alt="edit-icon" />
                            </Box>
                            <Box sx={{ marginLeft: '22px', cursor: 'pointer' }} onClick={() => setOpenDeleteModal(true)}>
                                <img src={deleteIcon} alt="delete-icon" />
                            </Box>
                            <Button size="small" variant="contained" color="secondary" className={classes.closeBtn} onClick={() => setOpenCloseModal(true)}>
                                CLOSE TASK
                            </Button>
                            <Box
                                className={classes.iconContainer}
                                display="flex"
                                alignItems="center"
                                justifyContent={"center"}
                                onClick={handleClick}
                            >
                                <img src={shareIcon} alt="share-icon" style={{ width: 18, height: 18 }} />
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem style={{ marginLeft: 0, height: 40 }}>
                                    <TwitterShareButton style={{ width: '100%' }} url={`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/task/${taskId}/preview`}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <TwitterIcon size={32} />
                                            <div style={{ marginLeft: 16 }}>Twitter</div>
                                        </div>
                                    </TwitterShareButton>
                                </MenuItem>
                                <MenuItem style={{ marginLeft: 0, height: 40 }}>
                                    <TelegramShareButton style={{ width: '100%' }} url={`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/task/${taskId}/preview`}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <TelegramIcon size={32} />
                                            <div style={{ marginLeft: 16 }}>Telegram</div>
                                        </div>
                                    </TelegramShareButton>
                                </MenuItem>
                                <MenuItem style={{ marginLeft: 0, height: 40 }}>
                                    <WhatsappShareButton style={{ width: '100%' }} url={`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/task/${taskId}/preview`}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <WhatsappIcon size={32} />
                                            <div style={{ marginLeft: 16 }}>Whatsapp</div>
                                        </div>
                                    </WhatsappShareButton>
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/task/${taskId}/preview`)
                                }} style={{ marginLeft: 0, height: 40 }}>
                                    <div style={{}}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <img style={{ marginLeft: 8 }} src={copyIcon} />
                                            <div style={{ marginLeft: 24 }}>Copy to clipboard</div>
                                        </div>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Box>

                <Box className={classes.secondContainer} display="flex" alignItems="center" justifyContent={"flex-end"}>
                    {
                        _get(Task, 'compensation', null) && _get(Task, 'compensation.amount', 0) !== 0 &&
                        <>
                            <Typography sx={{ color: '#76808D', fontSize: '16px' }}>Compensation</Typography>
                            <Box display="flex" alignItems="center" justifyContent={"center"} sx={{ width: '127px', height: '35px', }}>
                                <img src={compensationStar} alt="compensation-star" style={{ marginRight: '7px' }} />
                                <Typography>{_get(Task, 'compensation.amount', '')} {_get(Task, 'compensation.symbol', '')}</Typography>
                            </Box>
                        </>
                    }
                    {
                        _get(Task, 'deadline', null) &&
                        <Box display="flex" alignItems="center" style={{ borderLeft: '1px solid rgba(118, 128, 141, 0.5)', paddingLeft: '20px' }}>
                            <Typography sx={{ color: '#4BA1DB', marginRight: '10px', fontSize: '16px' }}>Deadline</Typography>
                            <BsCalendarCheck color="#4BA1DB" />
                            <Typography sx={{ fontWeight: '700', color: '#4BA1DB', marginLeft: '6px', marginRight: '10px' }}>{moment(_get(Task, 'deadline', '')).format('L')}</Typography>
                        </Box>
                    }
                </Box>

                <Box className={classes.thirdContainer} display="flex" alignItems="center">
                    <Box className={classes.descContainer}>
                        <Typography sx={{ fontSize: 16, color: '#76808D' }}>Description</Typography>
                        <Typography
                            dangerouslySetInnerHTML={{ __html: _get(Task, 'description', '') }}
                            sx={{ fontSize: '14px', color: '#1B2B41' }}></Typography>
                    </Box>
                    <Box className={classes.detailsContainer} display="flex" flexWrap={"wrap"} alignItems="center" justifyContent={"center"}>
                        { renderBody(Task?.visual?.renderBody) }
                        {/* <Button size="small" variant="contained" color="secondary" className={classes.closeBtn} onClick={() => setOpenApplyModal(true)}>
                            APPLY
                        </Button>
                        <Button size="small" variant="contained" color="secondary" className={classes.closeBtn} onClick={() => setOpenSubmitModal(true)}>
                            SUBMIT
                        </Button>
                        <Button size="small" variant="contained" color="secondary" className={classes.closeBtn} onClick={() => setOpenApplicantsModal(true)}>
                            APPLICANTS
                        </Button>
                        <Button size="small" variant="contained" color="secondary" className={classes.closeBtn} onClick={() => setOpenReviewModal(true)}>
                            REVIEW
                        </Button> */}
                    </Box>
                </Box>

                <Box className={classes.fourthContainer} display="flex" alignItems="center" justifyContent={"space-between"}>
                    {
                        _get(Task, 'reviewer', '') &&
                        <Box display="flex" alignItems="center">
                            <Typography sx={{ fontSize: 16, opacity: '0.5', marginRight: '10px' }}>Reviewer</Typography>
                            <Avatar name={_get(Task, 'reviewer.name', '')} wallet={_get(Task, 'reviewer.wallet', '')} />
                        </Box>
                    }

                    {
                        assignedUser &&
                        <Box display="flex" alignItems="center">
                            <Typography sx={{ fontSize: 16, opacity: '0.5', marginRight: '10px' }}>Assigned</Typography>
                            <Avatar name={_get(assignedUser, 'name', '')} wallet={_get(assignedUser, 'wallet', '')} />
                        </Box>
                    }

                    {
                        Task.taskStatus !== 'open' && Task.contributionType === 'open' && Task.isSingleContributor &&
                        <Box display="flex" alignItems="center">
                            <Typography sx={{ fontSize: 16, opacity: '0.5', cursor: 'pointer' }}>SEE PREVIOUS APPLICANTS</Typography>
                        </Box>
                    }

                    <Box display="flex" alignItems="center">
                        <Typography sx={{ fontSize: 16, opacity: '0.5' }}>Created At {moment(Task.createdAt).format('L')} {moment(Task.createdAt).format('LT')}</Typography>
                    </Box>
                </Box>

            </Grid>
        </Grid>
    )
}
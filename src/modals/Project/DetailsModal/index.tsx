import React, { useState } from "react";

import { Paper, Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";
import TextEditor from 'components/TextEditor'

import CloseSVG from 'assets/svg/closeNew.svg'
import createProjectSvg from 'assets/svg/createProject.svg';

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
    paperContainer: {
        borderRadius: 5,
        padding: '26px 22px',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important'
    },
}));

interface Props {
    open: boolean;
    closeModal(): any;
}

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();
    const [name, setName] = useState<string>('');
    const [desc, setDesc] = useState<string>('');

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={createProjectSvg} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Project Details</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%', marginTop: '35px' }}>
                    <Paper className={classes.paperContainer} sx={{ width: 394 }}>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextInput
                                label="Name of the project"
                                placeholder="Super project"
                                fullWidth
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextEditor
                                fullWidth
                                height={90}
                                placeholder="Marketing BtoB"
                                label="Short description"
                                value={desc}
                                onChange={(value: string) => setDesc(value)}
                            />
                        </Box>
                        <Button
                            variant='contained'
                            disabled={name !== '' && desc !== '' ? false : true}
                            sx={{ width: 350 }}
                        >
                            SAVE
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Drawer>
    )
}
import * as actionTypes from '../actionTypes';

export const getTaskAction = (payload: string) => {
    return {
        type: actionTypes.GET_TASK_ACTION,
        payload
    }
}

export const createTaskAction = (payload: any) => {
    return {
        type: actionTypes.CREATE_TASK_ACTION,
        payload
    }
}

export const draftTaskAction = (payload: any) => {
    return {
        type: actionTypes.DRAFT_TASK_ACTION,
        payload
    }
}

export const archiveTaskAction = (payload: any) => {
    return {
        type: actionTypes.ARCHIVE_TASK_ACTION,
        payload
    }
}

export const deleteTaskAction = (payload: any) => {
    return {
        type: actionTypes.DELETE_TASK_ACTION,
        payload
    }
}

export const applyTaskAction = (payload: any) => {
    return {
        type: actionTypes.APPLY_TASK_ACTION,
        payload
    }
}

export const submitTaskAction = (payload: any) => {
    return {
        type: actionTypes.SUBMIT_TASK_ACTION,
        payload
    }
}

export const assignTaskAction = (payload: any) => {
    return {
        type: actionTypes.ASSIGN_TASK_ACTION,
        payload
    }
}

export const rejectTaskMemberAction = (payload: any) => {
    return {
        type: actionTypes.REJECT_TASK_MEMBER_ACTION,
        payload
    }
}
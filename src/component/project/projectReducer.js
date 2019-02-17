import {
    GET_PROJECT_SUCCESS,
    GET_PROJECT_ERROR,
    GET_PROJECT_VOTE_ITEMS_ERROR,
    GET_PROJECT_VOTE_ITEMS_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    INCREMENT_VOTE_LOCALY,
    SET_SELECTED_DATE
} from './projectActionTypes'
import { nowTimestamp } from '../../firebase'

const initState = {
    data: {
        contact: null,
        favicon: null,
        firebaseConfig: null,
        logoSmall: null,
        name: null,
        id: null,
        voteItems: null,
        sessionVotes: null,
        chipColors: []
    },
    selectedDate: '',
    projectLoadError: null,
    projectVotesError: null
}

const projectReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_PROJECT_SUCCESS:
            return {
                ...state,
                data: {
                    ...payload
                }
            }
        case GET_PROJECT_VOTE_ITEMS_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    voteItems: payload
                }
            }

        case GET_PROJECT_VOTE_RESULT_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    sessionVotes: payload
                }
            }
        case INCREMENT_VOTE_LOCALY:
            const vote = payload.vote
            const data = state.data

            let precedentData = null
            try {
                precedentData =
                    data.sessionVotes[vote.sessionId][vote.voteItemId]
            } catch (e) {
                precedentData = null
            }
            let newVoteValue
            if (vote.text) {
                newVoteValue = {
                    ...precedentData,
                    [vote.id]: {
                        ...vote,
                        text: vote.text,
                        updatedAt: nowTimestamp(),
                        createdAt: vote.createdAt || nowTimestamp()
                    }
                }
            } else {
                newVoteValue = precedentData + payload.amount
            }

            if (!data.sessionVotes || !data.sessionVotes[vote.sessionId]) {
                return {
                    ...state,
                    data: {
                        ...data,
                        sessionVotes: {
                            ...data.sessionVotes,
                            [vote.sessionId]: {
                                [vote.voteItemId]: newVoteValue
                            }
                        }
                    }
                }
            }

            return {
                ...state,
                data: {
                    ...data,
                    sessionVotes: {
                        ...data.sessionVotes,
                        [vote.sessionId]: {
                            ...data.sessionVotes[vote.sessionId],
                            [vote.voteItemId]: newVoteValue
                        }
                    }
                }
            }
        case GET_PROJECT_VOTE_RESULT_ERROR:
            console.error(payload)
            return {
                ...state,
                projectVotesError: payload
            }
        case GET_PROJECT_VOTE_ITEMS_ERROR:
        case GET_PROJECT_ERROR:
            console.error(payload)
            return {
                ...state,
                projectLoadError: payload
            }

        case SET_SELECTED_DATE:
            return {
                ...state,
                selectedDate: payload.date
            }
        default:
            return state
    }
}

export default projectReducer

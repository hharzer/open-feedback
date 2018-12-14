import { GET_SESSION_SUCCESS, GET_SESSION_ERROR } from "./sessionActionTypes"
import { List } from "immutable"

export const getSessions = () => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();

        firestore.collection('sessions')
            .get()
            .then((querySnapshot) => {
                let sessions = new List()
                querySnapshot.forEach((doc) => {
                    sessions = sessions.push(doc.data())
                });
                dispatch({
                    type: GET_SESSION_SUCCESS,
                    payload: sessions
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSION_ERROR,
                    error: err
                });
            });
    }
};
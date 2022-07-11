import {connect} from '../reduxBak'

const userSelector = state=>{return {user: state.user}}
const userDispatch  = (dispatch)=>{
    return {
        updateState: (attrs)=>dispatch({type:'updateState',payload: attrs}),
        deleteUser: (attrs)=> dispatch({type:'deleteUser',payload: attrs})
    }
}
export const connectToUser = connect(userSelector,userDispatch)
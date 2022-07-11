import React ,{useState,useContext,useEffect} from 'react'
import { Provider,appContext,connect,createStore } from './reduxBak'

import { connectToUser } from './connecters/connectToUserBak'

// const appContext  = React.createContext(null)

const reducer =  (state,{type,payload})=>{
        if (type === 'updateState') {
            return {
                ...state,
                user:{...state.user,...payload}
            }
        }else if (type === 'deleteUser') {
            return {
                ...state,
                user:{...state.user,...payload}
            }
        }else{
            return state
        }
    }
const initState = {
    user: {name: 'Baby', age: 18},
        group: {name: 'HH'}
}
const store = createStore(reducer,initState)

export const AppBak = ()=>{
    // const [appState,setAppState] = useState({
    //     user: {name: 'frank', age: 18}
    //   })
    // const conextValue = {appState,setAppState}
    return(
        <Provider store={store}>
            <大儿子/>
            <二儿子/>
            <幺儿子/>
        </Provider>
    ) 
}

const 大儿子 = () =>{
    console.log("大儿子执行了",Math.random())
    return <section>HH<User></User></section>}
const 二儿子 = () =>{
    console.log("二儿子执行了",Math.random())
    return <section>灰灰<UserModify>内容</UserModify></section>}
const 幺儿子 = connect(state=>{return {group: state.group}})(({group}) =>{
    console.log("幺儿子执行了",Math.random())
    return <section>徽徽: Group: {group.name}</section>})


const User = connectToUser((props) =>{
    console.log("User执行了",Math.random())
    // const {state} = useContext(appContext)
    return <div>
        <span>User:{props.user.name}</span>
    </div>
})



const CreateWrapper = (component)=> {
    const Wrapper  = ()=>{
        const contextValue = useContext(appContext)
        const {appState,setAppState} = contextValue
        const dispatch = (action) =>{
            setAppState(reducer(appState,action))
        }
        console.log(appState,'appstate');
        return <component dispatch={dispatch} state={appState}></component>
    }
    return <Wrapper></Wrapper>
}
// const Wrapper = CreateWrapper(UserModify)

const ajax = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({data: {name: '3秒后的HH'}})
      }, 3000)
    })
  }
const fetchUser = (dispatch)=> {
    ajax().then(res=>{
        dispatch({type:'updateState',payload:res.data})
    })
}

const fetchUserPromise = () =>{
    return ajax().then(res=>res.data)
}

const UserModify =connect(null,null)(({updateState,state,children,dispatch}) =>{
    console.log("Usermodify 执行了",Math.random())
    const onChange = (e)=>{
        dispatch({type:'updateState',payload:{name:e.target.value}})
    }
    const onClick = ()=>{
        console.log(fetchUserPromise());
        dispatch({type:'updateState',payload: fetchUserPromise()})
        // dispatch(fetchUser)
    }
    return <div>
        {children}：
        <input type="text" value={state.user.name} onChange={onChange}/>
        <button onClick={onClick}>异步获取 user</button>
    </div>
}) 
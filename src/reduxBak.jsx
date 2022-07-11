import React ,{useState,useContext,useEffect} from 'react'

export const appContext  = React.createContext(null)

export const store = {
    state: undefined,
    setState(newState){
        store.state = newState;
        store.listeners.map(fn=>fn(store.state))
    },
    reducer:undefined,
    listeners:[],
    subscribe(fn){
        store.listeners.push(fn)
        //  取消订阅函数
        return ()=>{
            const index = store.listeners.indexOf(fn)
            store.listeners.splice(index,1)
        }
    },
    dispatch: (action) =>{
        store.setState(store.reducer(store.state,action))
    }
}

const initState = undefined

let dispatch = store.dispatch
const prevDispatch = dispatch
dispatch = (action) =>{
    if (action instanceof Function) {
        action(dispatch)
    }else{
        prevDispatch(action)
    }
}

const prevDispatch2=dispatch
dispatch = (action)=>{
    if (action.payload instanceof Promise) {
        action.payload.then(data=>{
            dispatch({...action,payload: data})
        }) 
    }else{
        prevDispatch2(action)
    }

}

// {
//     user: {name: 'Baby', age: 18},
//     group: {name: 'HH'}
// }
export const createStore = (reducer,initState) =>{
    store.state = initState;
    store.reducer = reducer;
    return store
}

let reducer = undefined;
// const store = createStore(reducer,initState)



const changed = (oldState, newState) => {
    let changed = false
    for (let key in oldState) {
      if (oldState[key] !== newState[key]) {
        changed = true
      }
    }
    return changed
  }
export const connect = (selector,mapDispatchToProps)=>(Component)=>{
    return (props)=>{
        // const dispatch = 
        const contextValue = useContext(appContext)
        const {state,setState} = contextValue
        const [,update] = useState()
        const data =selector? selector(state):{state}
        const dispatchers = mapDispatchToProps? mapDispatchToProps(dispatch) : {dispatch}
        useEffect(()=>{
           return store.subscribe(()=>{
                const newData = selector? selector(store.state):{state:store.state}
                if (changed(data,newData)){
                    update({})
                }
            })
        },[selector])
        return <Component {...props} {...dispatchers} {...data} ></Component>
    }
}
// export const reducer = (state,{type,payload})=>{
//     if (type === 'updateState') {
//         return {
//             ...state,
//             user:{...state.user,...payload}
//         }
//     }else if (type === 'deleteUser') {
//         return {
//             ...state,
//             user:{...state.user,...payload}
//         }
//     }else{
//         return state
//     }
// }

export const Provider = ({store,children})=>{
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )

}
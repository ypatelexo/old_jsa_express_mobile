import { AuthTypes } from "../config/types"
import {AsyncStorage} from 'react-native'
export const updateLoginFlag=(flag,data)=>{
    return (dispatch,getState)=>{
        dispatch({
           type:AuthTypes.isLoggedIn,
           payload:[flag,data] 
        })

    }
}
export const updateLoading=(flag)=>{
    return (dispatch,getState)=>{
        dispatch({
           type:AuthTypes.loading,
           payload:flag 
        })

    }
}
export const checkUserAuth=()=>{
    return async(dispatch,getState)=>{
        try {
            let isloggedinFlag = await AsyncStorage.getItem("LoginFlag");
            if(isloggedinFlag=='true'){
                let user = JSON.parse(await AsyncStorage.getItem("userData"));
                dispatch({
                    type: AuthTypes.sessionLogin,
                    payload:[isloggedinFlag,user]
                })  
            }
            else{
                dispatch({
                    type: AuthTypes.isLoggedIn,
                    payload:'false'
                })
            }
           
        } catch (error) {
            console.log("err",error);
            
        }
    }
}
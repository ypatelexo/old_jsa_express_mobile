import { FilterTypes } from "../config/types"

export const setDriverList=(response)=>{
    return (dispatch,getState)=>{
        dispatch({
           type:FilterTypes.driverList,
           payload:response 
        })

    }
}

export const saveAllrecords=(response)=>{
    return (dispatch,getState)=>{
        dispatch({
           type:FilterTypes.allrecords,
           payload:response 
        })

    }
}

export const saveFilters=(response)=>{
    return (dispatch,getState)=>{
        dispatch({
           type:FilterTypes.FilterData,
           payload:response 
        })

    }
}
export const changegreyoutflaginList = (index, value) => {
    console.log("changegreyoutflaginList,", index, value);
    return (dispatch,getState)=>{
        dispatch({
           type:FilterTypes.ChangeGreyOutColor,
           payload:[index,value] 
        })

    }
   

}

import { AuthTypes, FilterTypes } from "../config/types";

const INITIAL_STATE = {

  driverList:{},
  AllRecords:[],
  FilterDetails:{}
};

export default (state = INITIAL_STATE, action) => {
    console.log('====================================');
    console.log(action);
    console.log('====================================');
  switch (action.type) {
    case FilterTypes.driverList:
      return { ...state, driverList: action.payload };

      case FilterTypes.allrecords:
        return { ...state, AllRecords: action.payload };
      
      case FilterTypes.FilterData:
        return { ...state, FilterDetails: action.payload };

      case FilterTypes.ChangeGreyOutColor:
        let Tallreports = [...state.AllRecords];
        Tallreports[action.payload[0]].enumQualcommRowGrayOutStatus = action.payload[1];
       
    
        

        return { ...state, AllRecords: Tallreports};

    
    default:
      return state;
  }
};
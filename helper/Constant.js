import { Dimensions } from "react-native";

export const THEME_COLOR = "#fb4f14";
export const TEXT_COLOR = "#1f88d4"
export const THEME_FONT = "london-tube";
const URL="https://aedims.com/API";
export const SIGN_IN_URL=`${URL}/checkUserExist/`;
export const GET_DRIVER_LIST = `${URL}/getDriverList`;
export const GET_QUTRAC_MESSAGES = `${URL}/getQtracsData`;
export const RESET_PASSWORD_LINK = `${URL}/sendPasswordResetLink`;
export const CHANGE_ROW_COLOR = `${URL}/updateQualcommRowGeryOutStatus`;
export const GET_RECORDS =`${URL}/getQualDetail/`;
export const UPDATE_RECORDS =`${URL}/updateQualcommMessageRecord/`;
export const SENT_EMAIL =`${URL}/sentQtracsEmail`;
export const REMOVE_FILE = `${URL}/removeFile`;
export const {height, width} = Dimensions.get('window');                                                
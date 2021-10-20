import {Dimensions} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';

import FilterScreen from '../../pages/FilterScreen/FilterScreen';
import SelectDriver from '../../pages/FilterScreen/SelectDriver';
import SelectVehicle from '../../pages/FilterScreen/SelectVehicle';
import SelectDate from '../../pages/FilterScreen/SelectDate';
import ShowRecords from '../../pages/ReportsScreen/ShowRecords';
import Records from '../../pages/FilterScreen/RecordsFile';

import EditPage from '../../pages/FilterScreen/EditPage';
import EmailPage from '../../pages/FilterScreen/EmailPage';

export default createStackNavigator(
  {
    FilterScreen: {
      screen: FilterScreen,
    },
    SelectDriver: {
      screen: SelectDriver,
    },
    SelectVehicle: {
      screen: SelectVehicle,
    },
    SelectDate: {
      screen: SelectDate,
    },
    ShowRecords: {
      screen: ShowRecords,
    },
    Records: {
      screen: Records,
    },
    EditPage: {
      screen: EditPage,
    },
    EmailPage: {
      screen: EmailPage,
    },
  },
  {
    headerLayoutPreset: 'center',
    initialRouteName: 'FilterScreen',
    useNativeAnimations: false,
  },
);

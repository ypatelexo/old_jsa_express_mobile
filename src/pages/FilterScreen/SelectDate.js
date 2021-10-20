import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {THEME_FONT, THEME_COLOR} from '../../../helper/Constant';
import {CalendarList} from 'react-native-calendars';

export default class SelectDate extends Component {
  state = {
    setSelectTripDate: undefined,
    type: '',
    date: '',
    // selectedDate: new Date()
  };
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;

    return {
      title: 'Date',
      headerLeft: () => {
        return (
          <View
            style={{alignItems: 'center', alignSelf: 'center', marginLeft: 5}}>
            <TouchableOpacity
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => {
                navigation.pop();
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontFamily: THEME_FONT,
                }}>
                BACK{' '}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },

      headerStyle: {
        backgroundColor: THEME_COLOR,
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        fontStyle: THEME_FONT,
      },
      headerTintColor: '#fff',
    };
  };
  componentWillMount() {
    const {params} = this.props.navigation.state;
    console.warn(params);
    

    this.setState({
      setSelectTripDate: params.setSelectedTripDate,
      type: params.type,
      date:params.date,
    });
  }

  render() {
     
    return (
      <View style={{flex: 1}}>
        <CalendarList
          maxDate={new Date()}
         selected={this.state.date}
        //   markedDates={this.state.date}
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          // onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          // Enable or disable vertical scroll indicator. Default = false
          showScrollIndicator={true}
          onDayPress={date => {
            this.state.setSelectTripDate(this.state.type, date);
            this.props.navigation.pop();
          }}
        />
      </View>
    );
  }
}

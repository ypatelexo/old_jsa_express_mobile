/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {CHANGE_ROW_COLOR, THEME_COLOR} from '../../../helper/Constant';
import {styles} from './ShowRecords';
import {changegreyoutflaginList} from '../../common/actions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomCheckBox = ({
  selected,
  onPress,
  style,
  textStyle,
  size = 21,
  color = '#211f30',
  text = '',
  ...props
}) => (
  <TouchableOpacity
    style={[styles.checkBox, style]}
    onPress={onPress}
    {...props}>
    <Ionicons
      size={size}
      color={color}
      name={selected ? 'ios-radio-button-on' : 'ios-radio-button-off'}
    />
  </TouchableOpacity>
);

export class RenderEditOnList extends Component {
  async changeNonContinousFlag(item, props) {
    try {
      //   console.warn(item.enumQualcommRowGrayOutStatus);
      const formdata = new FormData();

      formdata.append(
        'greyOutStatusDetail',
        JSON.stringify({
          geryOutRadioButtonStatus:
            item.enumQualcommRowGrayOutStatus === 'Y' ? 'N' : 'Y',
          omnitracsId: item.omnitracsId,
          ownerId: props.userDetail.customerId,
        }),
      );

      //   console.warn('formdata', JSON.stringify(formdata));

      await fetch(
        `${CHANGE_ROW_COLOR}`,
        {
          method: 'POST',
          headers: {},
          body: formdata,
        },
        20000,
      )
        .then(response => response.json())
        .then(responseJson => {
          //   console.warn('response', responseJson);

          if (responseJson.CODE && responseJson.CODE == '1') {
            try {
              this.props.changegreyoutflaginList(
                props.index,
                item.enumQualcommRowGrayOutStatus == 'Y' ? 'N' : 'Y',
              );
            } catch (error) {
              //   console.warn('err', error);
            }
            this.setState({loading: false});
          } else {
            // console.log('return false else');
            this.setState({loading: false});
          }
        })
        .catch(err => {
          this.setState({loading: false});
        });
    } catch (error) {
      //   console.log('err:', error);
      this.setState({loading: false});
    }
  }
  state = {loading: false};
  render() {
    const {item, rowColor} = this.props;
    return (
      <View style={{flexDirection: 'row', backgroundColor: rowColor, flex: 1}}>
        <View style={[styles.itemStyle, {marginLeft:(this.state.loading)?1:5, flex: 0.3}]}>
          {this.state.loading == false ? (
            <CustomCheckBox
              selected={item.enumQualcommRowGrayOutStatus === 'Y'}
             
              onPress={async () => {
                this.setState({loading: true});
                // console.warn(this.props.userDetail);

                try {
                  await this.changeNonContinousFlag(item, this.props);
                } catch (error) {
                  this.setState({loading: false});
                }
              }}
            />
          ) : (
            <ActivityIndicator color={THEME_COLOR} />
          )}
        </View>

        <View style={[styles.itemStyle, { flex: 0.7}]}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Records', {
                omnitracs_id: item.omnitracsId,
                fetchrecords: this.props.navigation.state.params.fetchrecords,
              });
            }}>
            <Text style={[styles.listTextStyle,{color:'#0e4d92'}]}>{item.tran_ID}</Text>
          </TouchableOpacity>
        </View>

        {/* <ScrollView horizontal={true}> */}

        {/* </ScrollView> */}
      </View>
    );
  }
}

const mapToStateProps = state => {
  return {
    userDetail: state.Auth.user,
  };
};

export default connect(
  mapToStateProps,
  {changegreyoutflaginList},
)(RenderEditOnList);

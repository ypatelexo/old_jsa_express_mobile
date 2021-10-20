/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {THEME_FONT , TEXT_COLOR, THEME_COLOR} from '../../../helper/Constant';
import {GET_RECORDS} from '../../../helper/Constant';
import Spinner from '../../common/SpinnerFile';
import { ThemeColors } from 'react-navigation';
export class RecordsFile extends Component {
  state = {loading: false, Records: ''};
  // {---stack navigation options---}
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;

    return {
      title: 'QTRACS Records',
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Text style={[styles.headerTextStyle, {marginLeft: 10}]}>BACK</Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditPage', {
              data: params.Records,
              omnitracs_id: params.omnitracs_id,
              getRecords: params.getRecords,
              fetchrecords: params.fetchrecords,
            });
          }}>
          <Text style={[styles.headerTextStyle, {marginRight: 10}]}>EDIT</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        fontStyle: THEME_FONT
      },
      // headerTintColor: "#fff"
    };
  };

  componentWillMount() {
    const {params} = this.props.navigation.state;

    if (params.omnitracs_id) {
      this.getRecords(params.omnitracs_id);
    }
  }

  renderView(name, data) {
    return (
      <View style={styles.ContentTextStyle}>
        <Text style={styles.TextStyle}>{name}</Text>
        <Text style={styles.SubTextStyle}>{data}</Text>
      </View>
    );
  }

  getRecords = omnitracsID => {
    const formdata = new FormData(this);

    formdata.append(
      'omnitracs_id',
      JSON.stringify({
        omnitracs_id: omnitracsID,
      }),
    );

    console.log('formdata', formdata);

    this.setState({loading: true});
    fetch(
      `${GET_RECORDS}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formdata,
      },
      20000,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('responsejson', responseJson);
        this.setState({loading: false});
        if (responseJson.CODE === '1') {
          this.setState({Records: responseJson.RESPONSE});
          this.props.navigation.setParams({
            Records: responseJson.RESPONSE,
            getRecords: this.getRecords,
            omnitracs_id: this.props.navigation.state.params.omnitracs_id,
            fetchrecords: this.props.navigation.state.params.fetchrecords,
          });
        }
      })
      .catch(error => {
        this.setState({loading: false});
        console.log('error', error);
      });
  };

  render() {
    return (
      <Animatable.View
        style={[
          DownContenStyle.ContentStyle,
          {
            flexDirection: 'column',
            flex: 1,
            marginTop: '1%',
            marginBottom: '1%',
            marginLeft: '3%',
            marginRight: '3%',
          },
        ]}
        animation="fadeInUp">
        <Spinner visible={this.state.loading} />
        <ScrollView>
          {this.renderView('Seq #:', this.state.Records.omnitracs_id)}
          {this.renderView('Tran ID:', this.state.Records.tran_ID)}
          {this.renderView('Vehicle #:', this.state.Records.equipment_id)}
          {this.renderView('Trip Date:', this.state.Records.eventTS1)}
          {this.renderView(
            'Orig ID:',
            this.state.Records.macroBody_dispatchNum,
          )}
          {this.renderView(
            'Dest ID:',
            this.state.Records.macroBody_companyCode,
          )}
          {this.renderView(
            'Miles:',
            this.state.Records.floatQualcommTotalMiles,
          )}
          {this.renderView('Driver 1#:', this.state.Records.driverID)}
          {this.renderView('Driver 2#:', this.state.Records.macroBody_driverId)}
          {this.renderView(
            'Equipment Type:',
            this.state.Records.equipment_equipType,
          )}
          {this.renderView('Macro Type:', this.state.Records.macroType)}
          {this.renderView('Trip Status:', this.state.Records.tripStatus)}
          {this.renderView('GMH', this.state.Records.gmh)}
          {this.renderView('TarpsReqYN', this.state.Records.tarpsReqYN)}
          {this.renderView(
            'Unit Address:',
            this.state.Records.equipment_unitAddress,
          )}
          {this.renderView(
            'Mobile Type:',
            this.state.Records.equipment_mobileType,
          )}
          {this.renderView('Position Lon:', this.state.Records.position_lon)}
          {this.renderView('Position Lat:', this.state.Records.position_lat)}
          {this.renderView('Position TS:', this.state.Records.position_posTS)}
          {this.renderView('Position Type:', this.state.Records.posType)}
          {this.renderView(
            'Ignition Status:',
            this.state.Records.ignitionStatus,
          )}
          {this.renderView('Received TS:', this.state.Records.receivedTS)}
          {this.renderView('Msg Priority:', this.state.Records.msgPriority)}
          {this.renderView(
            'MacroType Direction:',
            this.state.Records.macroType_direction,
          )}
          {this.renderView(
            'MacroType Number:',
            this.state.Records.macroType_number,
          )}
          {this.renderView(
            'MacroType Version:',
            this.state.Records.macroType_version,
          )}
          {this.renderView(
            '#Trailer1:',
            (this.state.Records.macroBody_qhosTrailer1=='NONE')
            ?
            '-'
            :
            this.state.Records.macroBody_qhosTrailer1
            ,
          )}
          {this.renderView(
            'MacroBody Weight:',
            this.state.Records.macroBody_weight,
          )}
          {this.renderView(
            '#Trailer2:',
            (this.state.Records.macroBody_qhosTrailer2=='NONE')
            ?
            '-'
            :
            this.state.Records.macroBody_qhosTrailer2
          )}
          {this.renderView('Dolly:',
          (this.state.Records.macroBody_qhosTrailer3=='NONE')
          ?
          '-'
          :
          this.state.Records.macroBody_qhosTrailer3
          
          
          )}
          {this.renderView(
            'Auto Arrival GPS:',
            this.state.Records.macroBody_autoArrivalGPS,
          )}
          {this.renderView(
            'Auto Odo Meter:',
            this.state.Records.macroBody_autoOdometer,
          )}
          {this.renderView(
            'Auto Timestamp:',
            this.state.Records.macroBody_autoTimestamp,
          )}
          {this.renderView(
            'Load To Cart YN:',
            this.state.Records.macroBody_loadToCardYN,
          )}
          {this.renderView('Date Added:', this.state.Records.date_added)}
        </ScrollView>
      </Animatable.View>
    );
  }
}
const DownContenStyle = {
  ContentStyle: {
    marginHorizontal: 10,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    flex: 0.96,
    backgroundColor: '#fff',
  },
};
const styles = {
  TextStyle: {
    fontSize: 15,
    alignSelf: 'center',
    color:TEXT_COLOR,
    flex: 0.45,
    fontWeight: '800',
    fontFamily: THEME_FONT,
  },
  SubTextStyle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    textAlign: 'left',
    color: 'black',
    flex: 0.55,
    fontFamily: THEME_FONT,
  },

  ContentTextStyle: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5,
    alignContent: 'center',
    borderRadius: 1,
    borderBottomColor: '#999',
    marginTop: 0,
    marginBottom: 5,
  },
  headerTextStyle: {
    color:TEXT_COLOR,
    fontSize: 15,
    fontFamily:THEME_FONT
  },
};

export default RecordsFile;

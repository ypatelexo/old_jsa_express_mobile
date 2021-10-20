/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  PermissionsAndroid
} from 'react-native';
import {THEME_FONT ,TEXT_COLOR} from '../../../helper/Constant';
import {SENT_EMAIL, REMOVE_FILE} from '../../../helper/Constant';
import Spinner from '../../common/SpinnerFile';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { showMessage } from 'react-native-flash-message';
import RNFetchBlob from 'rn-fetch-blob';
import Mailer from 'react-native-mail';
import Permissions, { PERMISSIONS } from "react-native-permissions";

export class EmailPage extends Component {
  state = {
   
    loading: false,
  };

  // {---stack navigation options---}
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Attach Report Type',
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Text style={[styles.headerTextStyle, {marginLeft: 10}]}>BACK</Text>
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
    if (Platform.OS === "android") {
      this.requestAndroidCameraPermission()
    }
  }

  async requestAndroidCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("granted")
      }
      else {
        this.alertforStorage()
      }
    } catch (err) {
      console.warn(err);
    }
  }
  alertforStorage() {
    console.log('alert')
    Alert.alert(
      "Can we access your Storage?",
      "App needs access to your Storage.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Permission denied"),
          style: "cancel"
        },
        {
          text: "Open Settings",
          onPress: Permissions.openSettings
        }
      ]
    );
  }


  sendEmail = reportType => {
    console.log('update', this.props.FilterDetails.startDate);

    const formdata = new FormData(this);

    let sdate = this.props.FilterDetails.startDate.split('-');
    let edate = this.props.FilterDetails.endDate.split('-');
    formdata.append(
      'emailDetail',
      JSON.stringify({
        sortorder: '',
        sortby: '',
        page: '1',
        perpage: '',
        formate: reportType,
        ownerId: this.props.user.customerId,
        spot: this.props.FilterDetails.spotFlag,
        driverNo: this.props.FilterDetails.driver.id,
        startDate: `${sdate[1]}/${sdate[2]}/${sdate[0]}`,
        endDate: `${edate[1]}/${edate[2]}/${edate[0]}`,
        tripNo: this.props.FilterDetails.transid,
        vehicleNo: this.props.FilterDetails.vehicle,
        trailorNo: this.props.FilterDetails.trailerNumber,
        dateRange: '',
      }),
    );

    console.warn('formdata', formdata);

    this.setState({loading: true});
    fetch(
      `${SENT_EMAIL}`,
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
        console.log('responsejson.....', responseJson);
        this.setState({loading: false});

        if (responseJson.CODE === '1') {
         
          this.download("https://aedims.com/static/uploads/api/" + responseJson.RESPONSE, responseJson.RESPONSE)
         
        }
        else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        this.setState({loading: false});
        console.log('error', error);
      });
  };


  download(Response,name) {
    const { config, fs } = RNFetchBlob
    let DownloadDir = fs.dirs.DownloadDir
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: "MY FILE Title",
        path: DownloadDir + name,
        description: 'Downloading file.'
      }
    }
    RNFetchBlob.config(options)
      .fetch('GET',Response)
      .then((res) => {
        console.warn("Success", res);
        this.deleteFile(name,res.data)

      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log('error')
      })
  }
  extention(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
  }

  deleteFile(fileName,path) {
    const formdata = new FormData(this);

    formdata.append(
      'fileDetail',
      JSON.stringify({
        name: fileName,
      }),
    );
    console.log("formdataremove",formdata)
    fetch(
      `${REMOVE_FILE}`,
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
        console.log('remove', responseJson);

        if (responseJson.CODE === '1') {
          showMessage({
            message: 'Dowload File Successfully ',
            type: 'success',
            animated: 'true',
            floating: 'true',
            icon: 'success',
          });
          this.setState({ loading: false });
          this.handleEmail(fileName, path)
        }
        else {
          this.setState({ loading: false });
        }
        
      })
      .catch(error => {
        this.setState({loading: false});
        console.log('error', error);
      });
  }

  handleEmail = (fileName, path) => {
    let sdate = this.props.FilterDetails.startDate.split('-');
    let edate = this.props.FilterDetails.endDate.split('-');
    console.log(edate,sdate)
    Mailer.mail({
      subject: `Qtracs Messages: ${sdate[1]}/${sdate[2]}/${sdate[0]} to ${edate[1]}/${edate[2]}/${edate[0]}`,
      recipients: [],
      ccRecipients: [],
      bccRecipients: [],
      body: '',
      isHTML: true,
      attachment: {
        path: path,  // The absolute path of the file from which to read data.
        type: fileName.split(".")[1],   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
        name: "QTRACS",   // Optional: Custom filename for attachment
      }
    }, (error, event) => {
     console.log("email",error,event)
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      updateRecord: this.updateRecords,
    });
  }

  render() {
    return (
      <ImageBackground
        style={{justifyContent: 'space-around', alignItems: 'center', flex: 1}}
        source={require('../../Assets/images/plainBackground.png')}>
        <Spinner visible={this.state.loading} />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,.1)',
            justifyContent: 'space-around',
            borderRadius: 20,
            padding: 40,
          }}>
          <LinearGradient
            colors={['#eef500', '#f5d300', '#a99100']}
            style={[styles.gradientStyle, {marginRight: 10}]}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => {
                this.sendEmail('pdf');
              }}>
              <Image
                source={require('../../Assets/images/pdf.png')}
                style={styles.buttonIconStyle}
              />

              <Text
                style={[
                  styles.loginButtonStyle,
                  {
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    color: '#000',
                  },
                ]}>
                PDF
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={['#23f500', '#1fdc00', '#18a900']}
            style={styles.gradientStyle}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => {
                this.sendEmail('excel');
              }}>
              <Image
                source={require('../../Assets/images/excel.png')}
                style={styles.buttonIconStyle}
              />

              <Text
                style={[
                  styles.loginButtonStyle,
                  {textAlignVertical: 'center', textAlign: 'center'},
                ]}>
                EXCEL
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ImageBackground>
    );
  }
}

const styles = {
  buttonIconStyle: {width: 25, height: 25, alignSelf: 'center', marginRight: 5},
  gradientStyle: {borderRadius: 20, flexDirection: 'row', padding: 15},
  loginButtonStyle: {
    fontSize: 18,
    color: '#000',

    fontFamily: THEME_FONT,
  },
  headerTextStyle: {
    color:TEXT_COLOR,
    fontSize: 15,
    fontFamily: THEME_FONT
  }
};

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    FilterDetails: state.Filter.FilterDetails,
  };
};
export default connect(
  mapStateToProps,
  {},
)(EmailPage);

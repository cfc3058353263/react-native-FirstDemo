import React from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid, Alert, BackHandler, ToastAndroid, Linking, StatusBar } from 'react-native';
import AppStrackNavigatorTop from './src/components/AppStrackNavigatorTop';
import NetInfo from "@react-native-community/netinfo";
import StorageData from './src/utils/globalStorage';
import Blankpage from './src/components/blankpage';
import { Provider } from 'react-redux';
import store from './src/components/store/store';
import { init, Geolocation, setNeedAddress, setLocatingWithReGeocode, addLocationListener, start, stop, isStarted } from "react-native-amap-geolocation";
import { createStackNavigator, } from 'react-navigation-stack';
import NavigationService from './src/utils/NavigationService'
import Login from './src/components/login/Login';
import Orientation from 'react-native-orientation';
import Http from './src/utils/request';
import { NativeModules } from 'react-native';

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

export default class App extends React.Component<any, any> {
  lastBackPressed: any;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      isLoggedIn: null,
      isConnected: true
    }
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      Orientation.lockToPortrait();
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
    }
    await init({
      ios: "",
      android: "ad5cfe2e088732f9afbfd8550c7df0d8"
    });
    NetInfo.addEventListener((networkType) => {    
      if (!networkType.isConnected) {
        ToastAndroid.show('网络连接不可用', ToastAndroid.SHORT);
      }

    })
    const token = await StorageData.getItem('token');
    if (JSON.parse(token)) {
      this.setState({
        isLoggedIn: 'index'
      })
    } else {
      this.setState({
        isLoggedIn: 'login'
      })
    }
    NativeModules.BridgeManager.getAppVersion((event) => {
      this.updataVerSion(event)
    });
  }

  updataVerSion(version) {
    new Http().doGet('version/selectLastAppVersion', null, {
      appType: Platform.OS
    }, null)
      .then((e) => {
        const data = e.data.data
        if (data.versionNo !== version) {
          Alert.alert(null, "版本更新\n更新内容：" + data.versionInfo, [
            {
              text: "前往下载", onPress: () => {
                Linking.canOpenURL(data.versionAddress).then(supported => {
                  return Linking.openURL(data.versionAddress);
                });
              }
            },
            {
              text: "取消", onPress: () => {

              }
            }
          ])
        }
      }).catch(() => {

      })
  }




  async componentWillMount() {//执行一次，在初始化render之前执行，
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {//当组件要被从界面上移除的时候，就会调用componentWillUnmount(),在这个函数中，可以做一些组件相关的清理工作，例如取消计时器、网络请求等
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    stop();
  }
  onBackAndroid = () => {
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {//按第二次的时候，记录的时间+2000 >= 当前时间就可以退出
      //最近2秒内按过back键，可以退出应用。
      BackHandler.exitApp();//退出整个应用
      return false
    }
    this.lastBackPressed = Date.now();//按第一次的时候，记录时间
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
    return true;
  };
  render() {
    const { isLoggedIn } = this.state;
    const AppNavigator = AppStrackNavigatorTop(isLoggedIn)
    const TopLevelNavigator = createStackNavigator({
      login: {
        screen: Login,
        navigationOptions: {
          header: null
        }
      },
    })
    StatusBar.setBackgroundColor("#2a5696");
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {isLoggedIn ? <AppNavigator ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef); }} /> : <Blankpage />}
        </View>
      </Provider>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
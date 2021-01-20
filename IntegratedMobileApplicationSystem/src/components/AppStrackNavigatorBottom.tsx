import React from "react";
import { Image, StyleSheet, StatusBar } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Main from './main/main';
import TVideo from "../assets/icons/sp_a_icon.png";
import FVideo from "../assets/icons/sp_icon.png";
import TMenu from "../assets/icons/gn_a_icon.png";
import FMenu from "../assets/icons/gn_icon.png";
import Tany from "../assets/icons/tj_a_icon.png";
import Fany from "../assets/icons/tj_icon.png";
import Tmine from "../assets/icons/user_a_icon.png";
import Fmine from "../assets/icons/user_icon.png";
import Shouye from "../assets/icons/shouye.png";
import Menu from "./menu/menu";
import Map from "./map/map";
import Shiping from "./shiping/shiping";
import MyInfo from "./myInfo/myInfo";

/**
 * 底部导航栏
 * @author zkx
 */
const AppStrackNavigator = createBottomTabNavigator({
    video: {
        screen: Shiping,
        navigationOptions: () => ({
            tabBarLabel: "视频",
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                StatusBar.setBackgroundColor("#2a5696");
                StatusBar.setBarStyle('default', false)
                defaultHandler()
            },
            tabBarIcon: ({ focused }) => (
                <Image source={(focused ? TVideo : FVideo)} style={styles.img} />
            )
        })
    },
    menu: {
        screen: Menu,
        navigationOptions: () => ({
            tabBarLabel: "功能",
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                StatusBar.setBackgroundColor("#2a5696");
                StatusBar.setBarStyle('default', false)
                defaultHandler()
            },
            tabBarIcon: ({ focused }) => (
                <Image source={(focused ? TMenu : FMenu)} style={styles.img} />
            )
        })
    },
    main: {
        screen: Main,
        navigationOptions: () => ({
            tabBarLabel: "首页",
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                StatusBar.setBackgroundColor("#2a5696");
                StatusBar.setBarStyle('default', false)
                defaultHandler()
            },
            tabBarIcon: ({ focused }) => (
                <Image source={(focused ? Shouye : Shouye)} style={{ width: 60, height: 60, marginBottom: 20 }} />
            )
        })
    },
    statisticalAnalysis: {
        screen: Map,
        navigationOptions: () => ({
            tabBarOnPress: (({ navigation, defaultHandler }) => {
                StatusBar.setBackgroundColor("#2a5696");
                StatusBar.setBarStyle('default', false)
                defaultHandler()
            }),
            tabBarLabel: "地图",
            tabBarIcon: ({ focused }) => (
                <Image source={(focused ? Tany : Fany)} style={styles.img} />
            )
        })
    },
    mine: {
        screen: MyInfo,
        navigationOptions: () => ({
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                StatusBar.setBackgroundColor("#fff");
                StatusBar.setBarStyle('dark-content', false)
                defaultHandler()
            },
            tabBarLabel: "我的",
            tabBarIcon: ({ focused }) => (
                <Image source={(focused ? Tmine : Fmine)} style={styles.img} />
            )
        })
    }
}, {
    initialRouteName: "main",
    defaultNavigationOptions: {
        tabBarVisible: true,
    },
    navigationOptions: ({ navigation }) => {
        const optisns = {};
        const { routeName } = navigation.state.routes[navigation.state.index];
        optisns['header'] = null;
        return optisns;
    },
    backBehavior: "none",//设置取消navigation的同级的跳转
    tabBarOptions: {
        labelStyle: {
            fontSize: 16
        }
    }
});
export default AppStrackNavigator;

const styles = StyleSheet.create({
    img: {
        width: 25,
        height: 25,
        marginTop: 20,
        marginBottom: 15
    }
});


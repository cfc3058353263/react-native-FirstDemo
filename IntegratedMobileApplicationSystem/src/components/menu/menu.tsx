import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import ModuleIcon from "../../utils/components/ModuleIcon";
import Gn from "../../assets/icons/gn.png"
import Tjgn from "../../assets/icons/tjgn.png"
import Picturepath from "../../utils/components/Picturepath"
import Module from "../../utils/Modules";
import StorageData from "../../utils/globalStorage";
import Http from '../../utils/request';
import ModuleLoading from "../../utils/components/ModuleLoading";
import { Card } from 'react-native-shadow-cards';
/**
 * menu页面
 */
class MenuComponent extends Component<any, any>{
  init: any;
  constructor(props: Readonly<any>) {
    super(props);
    this.GetDetals = this.GetDetals.bind(this);
    this.state = {
      data: [],
      parentName: [],
      menuName: [],
    }
  }
  async componentDidMount() {
    const useInfo = await StorageData.getItem("userInfo")
    const menu = await StorageData.getItem('menu')
    const token = JSON.parse(useInfo).token
    if (menu) {
      this.setState({
        data: JSON.parse(menu)
      })
    } else {
      Alert.alert(null, '功能加载失败', [{ text: '取消' }])
    }
  }
  /**
   * 图片路径
   * @param menu 功能名称
   * @param parentName 功能模块
   */
  picturepath(menu: string, parentName: string) {
    if (!Picturepath[menu]) {
      return
    } else {
      if (menu === "监测信息") {
        if (parentName === "水文信息") {
          return Picturepath["监测信息"].url1
        } else if (parentName === "工程安全管理") {
          return Picturepath["监测信息"].url2
        } else {
          return Picturepath["监测信息"].url3
        }
      } else if (menu === "设施详情") {
        if (parentName === "工程安全管理") {
          return Picturepath["设施详情"].url1
        } else {
          return Picturepath["设施详情"].url2
        }
      } else {
        return Picturepath[menu].url
      }
    }
  }
  /**
   * 跳转路径
   * @param name 功能名称
   * @param parentName 功能模块
   */
  GetDetals(name: string, parentName: string): void {
    if (!Module[name]) return;
    // if (name === "水情信息查询") {
    //   this.props.navigation.navigate("hydrologicalInformation");
    // }
    if (name === "监测信息") {
      if (parentName === "水文信息") {
        console.log(Module["监测信息"].url2)
        this.props.navigation.navigate(Module["监测信息"].url1);
        return
      } else if (parentName === "工程安全管理") {
        this.props.navigation.navigate(Module["监测信息"].url2);
        return
      } else {
        this.props.navigation.navigate(Module["监测信息"].url3);
        return
      }
    } else if (name === '设施详情') {
      if (parentName === "工程安全管理") {
        // this.props.navigation.navigate(Module["设施详情"].url1);
        return
      } else {
        this.props.navigation.navigate(Module["设施详情"].url2);
        return
      }
    } else if (name === '历史信息') {
      if (parentName === "工程安全管理") {
        this.props.navigation.navigate(Module["历史信息"].url1);
        return
      } else {
        this.props.navigation.navigate(Module["历史信息"].url2);
        return
      }
    } else {
      const { url } = Module[name];
      this.props.navigation.navigate(url);
    }
  }

  render() {
    const { data, parentName, menuName } = this.state;
    for (var item of data) {
      if (item.treeLevel === 0) {
        parentName.push(item)
      } else {
        menuName.push(item)
      }
    }
    return (
      <ScrollView style={styles.container}>
        <ModuleLoading ref="loading" />
        <Card cornerRadius={0} opacity={0.3} elevation={5} backgroundColor={"#62a58f"} style={styles.headView}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Image source={Gn} style={{ width: 42, height: 42 }} />
            <Text style={styles.headTxtLeft}>常用功能</Text>
          </View>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('commonmenu') }} style={styles.headTxtRight}>
            <Image source={Tjgn} style={{ width: 42, height: 42 }} />
          </TouchableOpacity>
        </Card>
        {
          parentName.map((menuModule, index) => {
            return (
              <View style={styles.contentView} key={index}>
                <Card cornerRadius={0} opacity={0.3} elevation={2} style={styles.contentHeader}>
                  <Text style={{ fontSize: 18 }}>{menuModule.menuName}</Text>
                </Card>
                <View style={styles.contentViewItem}>
                  {
                    menuName.map((menu, idx) => {
                      if (menuModule.menuName === menu.parentName) {
                        return (
                          <ModuleIcon key={idx} source={this.picturepath(menu.menuName, menu.parentName)} context={menu.menuName} onpress={() => { this.GetDetals(menu.menuName, menu.parentName) }} />
                        )
                      }
                    })
                  }
                </View>
              </View>
            )
          })
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efeff4",
    borderColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    paddingLeft: 10,
    paddingRight: 10,
  },
  headView: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#eee",
    borderWidth: 1,
    borderStyle: "solid",
    alignContent: "center",
    backgroundColor: "#eefdf8",
    borderRadius: 4,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: "center"
  },
  headTxtLeft: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10
  },
  headTxtRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentView: {
    borderColor: "#ebebf0",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: "#fff",
    marginBottom: 5
  },
  contentViewItem: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: "#fcfcfc",
    paddingTop: 10
  },
  contentHeader: {
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  itemOne: {
    minWidth: 100,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: "center",
    textAlign: "center",
    alignItems: 'center',
  },
  img: {
  },
  imgTxt: {
    fontSize: 16,
    marginBottom: 5

  }
})
const Menu = createStackNavigator({
  home: {
    screen: MenuComponent,
    navigationOptions: {
      headerTitle: "功能菜单",
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#2a5696",

      }
    }
  }
}, {
  headerLayoutPreset: "center",
  headerMode: "screen"
})
export default Menu;

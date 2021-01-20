import React from "react"
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity, TextInput } from 'react-native'
import Search from "../../assets/icons/search.png"
import WaterRegime from "../../assets/icons/waterRegime.png" //水情
import EngineeringSafety from "../../assets/icons/engineeringSafety.png" //工程
import WaterQuality from "../../assets/icons/waterQuality.png" //水质
import Event from "../../assets/icons/event.png" //事件
import dropDown from "../../assets/icons/dropDown.png" //箭头
import undropDown from "../../assets/icons/undropDown.png" //箭头
import Open from "../../assets/icons/open.png" //open
import Close from "../../assets/icons/close.png" //close
import Checked from "../../assets/icons/checked.png" //ckecked
import Unchecked from "../../assets/icons/unchecked.png" //Unckecked
import CheckBox from 'react-native-check-box'
import { Card } from 'react-native-shadow-cards';
import Http from '../../utils/request';
import StorageData from "../../utils/globalStorage"

export default class MapRightMenu extends React.Component<any, any>{
    private waterRegimeList = {}
    private eventList = {}
    private stationType = { 0: '闸站', 1: '泵站', 2: '阀站', 3: '水源', 4: '分水口' } //水情分类
    private zhaStationTypeid = { '节制闸': '1', '分水闸': '2', '渡槽闸': '9', '到虹闸': '8', '冲砂闸': '10', '出口闸': '11', '引水闸': '3', '涵闸': '5', '进水闸': '6', '泄洪闸': '4' } //水情闸站对应编码
    private fazhanTypeid = { '阀门井': '1', '调压阀': '2' }
    private subcenter = [
        { station: "AEA37060102B001", lgtd: '120.61452', lttd: '37.63172' },
        { station: "AEA37060604B001", lgtd: '121.11547', lttd: '37.47140' },
        { station: "AEA37070207B001", lgtd: '119.47407', lttd: '36.76855' },
        { station: "AEA37060204B001", lgtd: '119.81180', lttd: '37.14436' },
        { station: "AEA37070207B002", lgtd: '119.47500', lttd: '36.76834' },
        { station: "AAC37020112B001", lgtd: '119.70521', lttd: '36.98648' },
        { station: "AAC37050101B001", lgtd: '118.59644', lttd: '37.19950' }
    ]

    private waterQualityInfo = []
    user: any
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            WaterRegimeState: false,          //水情按钮
            WaterQualityState: false,         //水质按钮
            EventState: false,                //事件按钮
            eventNumber: 0,
            EngineeringSafetyState: false,    //工程按钮
            arr: [],
            useInfo: false,
            // 水情信息数据
            waterRegimeShow: false,  //下拉开关
            waterRegimeList: [
                { name: "水源", site: [], checked: false, switched: false },
                { name: "泵站", site: [], checked: true, switched: false },
                { name: "分水口", site: [], checked: false, switched: false },
                {
                    name: "闸站", site: [
                        { name: '节制闸', checked: false }, { name: "分水闸", checked: false }, { name: '渡槽闸', checked: false }, { name: '到虹闸', checked: false },
                        { name: '冲砂闸', checked: false }, { name: "出口闸", checked: false }, { name: '引水闸', checked: false }, { name: '涵闸', checked: false },
                        { name: '进水闸', checked: false }, { name: "泄洪闸", checked: false },
                    ], checked: false, switched: false
                },
                { name: "阀站", site: [{ name: '阀门井', checked: false }, { name: '调压阀', checked: false }], checked: false, switched: false },
            ],
            // 工程安全信息数据
            engineeringshow: false, // 下拉开关
            engineeringList: [],    // 树状图储存
            //水质信息数据
            waterQualityShow: false,    //下拉开关
            waterQualityList: [
                { name: "黄水河泵站水质测站", site: [], checked: false, switched: true },
                { name: "高疃泵站水质测站", site: [], checked: false, switched: true },
                { name: "宋庄泵站上游水质测站", site: [], checked: false, switched: true },
                { name: "东宋泵站水质测站", site: [], checked: false, switched: true },
                { name: "宋庄泵站下游水质测站", site: [], checked: false, switched: true },
                { name: "灰埠泵站水质测站", site: [], checked: false, switched: true },
                { name: "小清河测站", site: [], checked: false, switched: true },
            ]
        }
    }

    async componentDidMount() {
        const token = await StorageData.getItem("token")
        if (token) {
            this.setState({
                token: JSON.parse(token)
            })
        }
        const user = await StorageData.getItem("user");
        if (user) {
            this.user = JSON.parse(user);
        }
        for (var item in this.stationType) {
            this.getWaterSource(item, this.stationType[item]) //获取水源信息
        }
        this.getEventLogList() //获取事件
        this.getEngineeringList() //获取工程安全树状图
        this.getWaterQuality()    //获取水质信息
        this.onChecked('水情', 1, true, "泵站")
    }
    // 水情信息 
    //获取水源的信息
    getWaterSource(index, name) {
        new Http().setToken(this.state.token).doGet('api-rcdd/rcdd/waterInfo/getStationMapList', null,
            { mapFlag: 'map', sttp: index }, null)
            .then((e) => {
                const data = e.data.rows;
                this.waterRegimeList[name] = data
            })
    }
    // 获取 工程安全树状图
    getEngineeringList() {
        new Http().doGet('device/treeDataTo', null, null, null)
            .then((e) => {
                const data = e.data
                let engineeringList = []
                for (let item of data) {
                    if (item.pId === '0') {
                        engineeringList.push({ name: item.name, site: [], checked: false, switched: false, id: item.id, title: item.title })
                    } else {
                        for (let _item of engineeringList) {
                            _item.id === item.pId && _item.site.push({ name: item.name, checked: false, id: item.id, title: item.title })
                        }
                    }
                }
                this.setState({
                    engineeringList
                })
            })
    }
    // 获取 工程安全测点位置
    getEngineering(list) {
        new Http().doPost('device/treeDataToK', null, { list }, null)
            .then((e) => {
                const { getEngInfo } = this.props
                const data = e.data;
                const message = {
                    "name": "工程",
                    "data": data
                }
                getEngInfo.postMessage(JSON.stringify(message));
            })
    }
    // 获取水质测站信息
    getWaterQuality() {
        for (let item of this.subcenter) {
            new Http().doGet("gateTo/selectAppMnTo",
                null, { deviceCode: item.station }, null)
                .then((e: any) => {
                    const data = e.data;
                    this.waterQualityInfo.push({ ...data[0], lgtd: item.lgtd, lttd: item.lttd })
                    return;
                }).catch((e: any) => {

                })
        }
    }
    // 获取事件列表
    getEventLogList() {
        new Http().setToken(this.state.token).doGet('api-yjdd/yjdd/eventLog/getEventLogList', null,
            { deptId: this.user.deptId, userId: this.user.userId, roleStr: `${this.user.roleIds}`, isOtherSystem: "y" }, null)
            .then((e) => {
                const data = e.data.rows;
                this.eventList['事件'] = data
                this.setState({
                    eventNumber: e.data.totalRows
                })
            }).catch((e: any) => {

            })
    }
    // 事件监控 工程安全
    onchange(type, name) {
        // this.getEventLogList()
        const { getEngInfo } = this.props;
        if (!type) {
            const message = {
                'name': "事件",
                'type': name,
                'data': this.eventList[name]
            }
            getEngInfo.postMessage(JSON.stringify(message));
        } else {
            const message = {
                'name': "事件",
                'type': name,
                'data': null
            }
            getEngInfo.postMessage(JSON.stringify(message));
        }

    }

    /**
     * 父类 单选，全选
     * @param index 下标
     * @param check 状态
     */
    onChecked(text, index, check, name) {
        if (text === '水情') {
            const { getEngInfo } = this.props;
            if (check) {
                const message = {
                    'name': "水情",
                    'type': name,
                    'data': this.waterRegimeList[name]
                }
                getEngInfo.postMessage(JSON.stringify(message));
            } else {
                const message = {
                    'name': "水情",
                    'type': name,
                    'data': null
                }
                getEngInfo.postMessage(JSON.stringify(message));
            }
            this.setState({
                waterRegimeList: this.state.waterRegimeList.map((item, _index) =>
                    index === _index ? { ...item, checked: check, site: item.site.map((list, idx) => ({ ...list, checked: check })) } : item
                )
            })
        } else if (text === '工程') {
            this.setState({
                engineeringList: this.state.engineeringList.map((item, _index) =>
                    index === _index ? { ...item, checked: check, site: item.site.map((list, idx) => ({ ...list, checked: check })) } : item
                )
            }, () => {
                let list = []
                for (let item of this.state.engineeringList) {
                    item.checked && list.push(item.title)
                    if (item.site.length !== 0) {
                        for (let _item of item.site) {
                            _item.checked && list.push(_item.title)
                        }
                    }
                }
                this.getEngineering(list)
            })
        } else if (text === '水质') {
            this.setState({
                waterQualityList: this.state.waterQualityList.map((item, _index) =>
                    index === _index ? { ...item, checked: check, site: item.site.map((list, idx) => ({ ...list, checked: check })) } : item
                )
            }, () => {
                let list = []
                for (let item of this.state.waterQualityList) {
                    if (item.checked) {
                        for (let _item of this.waterQualityInfo) {
                            item.name === _item.DEVICE_NAME && list.push(_item)
                        }
                    }
                }
                const { getEngInfo } = this.props;
                const message = {
                    'name': "水质",
                    'type': name,
                    'data': list
                }
                getEngInfo.postMessage(JSON.stringify(message));
            })
        }
    }
    /**
     *  子类单选 
     * @param index //父类下标
     * @param idx //子类下标
     * @param check //状态
     * @param name //字段
     */
    onSiteCheck(text, index, idx, check, name) {
        const { getEngInfo } = this.props;
        if (text === '水情') {
            this.setState({
                waterRegimeList: this.state.waterRegimeList.map((item, _index) =>
                    index === _index ? { ...item, site: item.site.map((list, _idx) => idx === _idx ? { ...list, checked: check } : list) } : item,
                )
            }, () => {
                if (this.state.waterRegimeList[index].name === '闸站') {
                    // 闸站下的分类 发送数据
                    const zhaStationList = []
                    for (let item of this.state.waterRegimeList) {
                        if (item.name === '闸站') {
                            for (let _item of item.site) {
                                if (_item.checked) {
                                    for (let list of this.waterRegimeList['闸站']) {
                                        if (list.type === this.zhaStationTypeid[_item.name]) {
                                            zhaStationList.push(list)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    const message = {
                        'name': "水情",
                        'type': '闸站',
                        'data': zhaStationList
                    }
                    getEngInfo.postMessage(JSON.stringify(message));
                } else if (this.state.waterRegimeList[index].name === '阀站') {
                    // 阀站下的分类
                    const fazhanList = []
                    for (let item of this.state.waterRegimeList) {
                        if (item.name === '阀站') {
                            for (let _item of item.site) {
                                if (_item.checked) {
                                    for (let list of this.waterRegimeList['阀站']) {
                                        if (list.type === this.fazhanTypeid[_item.name]) {
                                            fazhanList.push(list)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    const message = {
                        'name': "水情",
                        'type': '阀站',
                        'data': fazhanList
                    }
                    getEngInfo.postMessage(JSON.stringify(message));
                }

                for (let item of this.state.waterRegimeList[index].site) {
                    if (!item.checked) {
                        return this.setState({
                            waterRegimeList: this.state.waterRegimeList.map((item, _index) =>
                                index === _index ? { ...item, checked: false } : item
                            )
                        })
                    }
                }
                this.setState({
                    waterRegimeList: this.state.waterRegimeList.map((item, _index) =>
                        index === _index ? { ...item, checked: true } : item
                    )
                })
            })
        } else if (text === '工程') {
            this.setState({
                engineeringList: this.state.engineeringList.map((item, _index) =>
                    index === _index ? { ...item, site: item.site.map((list, _idx) => idx === _idx ? { ...list, checked: check } : list) } : item,
                )
            }, () => {
                for (let item of this.state.engineeringList[index].site) {
                    if (!item.checked) {
                        return this.setState({
                            engineeringList: this.state.engineeringList.map((item, _index) =>
                                index === _index ? { ...item, checked: false } : item
                            )
                        }, () => {
                            let list = []
                            for (let item of this.state.engineeringList) {
                                item.checked && list.push(item.title)
                                if (item.site.length !== 0) {
                                    for (let _item of item.site) {
                                        _item.checked && list.push(_item.title)
                                    }
                                }
                            }
                            this.getEngineering(list)
                        })
                    }
                }
                this.setState({
                    engineeringList: this.state.engineeringList.map((item, _index) =>
                        index === _index ? { ...item, checked: true } : item
                    )
                }, () => {
                    let list = []
                    for (let item of this.state.engineeringList) {
                        item.checked && list.push(item.title)
                        if (item.site.length !== 0) {
                            for (let _item of item.site) {
                                _item.checked && list.push(_item.title)
                            }
                        }
                    }
                    this.getEngineering(list)
                })
            })
        }
    }
    // 虚线
    onLayout(event) {
        var len = Math.ceil(event.nativeEvent.layout.width / 4);
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        this.setState({
            arr: arr
        })
    }
    /**
     * 折叠栏
     * @param check 状态 
     * @param index 下标
     */
    listSwitch(text, check, index) {
        if (text === '水情') {
            this.setState({
                waterRegimeList: this.state.waterRegimeList.map((item, _index) =>
                    item.site.length !== 0 && index === _index ? { ...item, switched: check } : item
                )
            })
        } else if (text === '工程') {
            this.setState({
                engineeringList: this.state.engineeringList.map((item, _index) =>
                    item.site.length !== 0 && index === _index ? { ...item, switched: check } : item
                )
            })
        }
    }
    render() {
        const { WaterRegimeState, WaterQualityState, EventState, eventNumber, EngineeringSafetyState, arr } = this.state
        const { waterRegimeShow, waterRegimeList, engineeringshow, engineeringList, waterQualityShow, waterQualityList } = this.state
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.inputPackage}>
                        <TextInput style={styles.input} placeholder={'请输入内容'} />
                        <Image source={Search} style={{ width: 18, height: 18 }} />
                    </View>
                    <View style={{ width: "100%", paddingTop: 10, paddingBottom: 10 }} onLayout={(event) => this.onLayout(event)}>
                        {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }} >
                            <TouchableOpacity style={[styles.eventButton, {backgroundColor: WaterRegimeState ? '#ebf8f4' : '#fff' }]} onPress={() => { this.setState({ WaterRegimeState: !this.state.WaterRegimeState }), this.onchange() }}>
                                <Image source={WaterRegime} style={{ width: 16, height: 16 }} />
                                <Text style={styles.eventButtonText}>水情警告（{0}）</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.eventButton, {backgroundColor: WaterQualityState ? '#ebf8f4' : '#fff' }]} onPress={() => { this.setState({ WaterQualityState: !this.state.WaterQualityState }), this.onchange() }}>
                                <Image source={WaterQuality} style={{ width: 16, height: 16 }} />
                                <Text style={styles.eventButtonText}>水情警告（{0}）</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                            <TouchableOpacity style={[styles.eventButton, { backgroundColor: EventState ? '#ebf8f4' : '#fff' }]} onPress={() => { this.setState({ EventState: !this.state.EventState }), this.onchange(EventState, '事件') }}>
                                <Image source={Event} style={{ width: 16, height: 16 }} />
                                <Text style={styles.eventButtonText}>事件监控（{eventNumber}）</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[styles.eventButton, { backgroundColor: EngineeringSafetyState ? '#ebf8f4' : '#fff' }]} onPress={() => { this.setState({ EngineeringSafetyState: !this.state.EngineeringSafetyState }) }}>
                                <Image source={EngineeringSafety} style={{ width: 16, height: 16 }} />
                                <Text style={styles.eventButtonText}>工程安全（{0}）</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                        {
                            arr.map((item, index) => {
                                return <Text style={{ color: "#3e5492" }} key={index}>-</Text>
                            })
                        }
                    </View>
                    {/* 水情列表 */}
                    <View style={{ width: "100%" }}>
                        <Card cornerRadius={0} opacity={0.3} elevation={5} style={{ width: '100%' }}>
                            <TouchableOpacity style={styles.listheader} onPress={() => { this.setState({ waterRegimeShow: !this.state.waterRegimeShow }) }}>
                                <Text style={{ fontSize: 18, color: "#62a58f" }}>水情信息</Text>
                                <Image source={waterRegimeShow ? undropDown : dropDown} style={{ width: 20, height: 10 }} />
                            </TouchableOpacity>
                        </Card>
                        {
                            waterRegimeShow &&
                            <View style={styles.listbodyBorder}>
                                {waterRegimeList.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <View style={styles.listChecked} >
                                                <CheckBox isChecked={item.checked} onClick={() => { this.onChecked('水情', index, !item.checked, item.name) }}
                                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                                />
                                                <TouchableOpacity style={styles.listSwitch} onPress={() => { this.listSwitch('水情', !item.switched, index) }}>
                                                    <Image source={item.site.length !== 0 ? item.switched ? Close : Open : Close} style={styles.switchedImage} />
                                                    <Text style={styles.checkedText}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {
                                                (item.site.length !== 0 && item.switched) &&
                                                item.site.map((site, idx) => {
                                                    return (
                                                        <View key={idx} style={[styles.listChecked, { paddingLeft: 20 }]}>
                                                            <CheckBox isChecked={site.checked} onClick={() => { this.onSiteCheck('水情', index, idx, !site.checked, site.name) }}
                                                                checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                                                unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                                            />
                                                            <Image source={Close} style={styles.switchedImage} />
                                                            <Text style={styles.checkedText}>{site.name}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                })}
                            </View>}
                    </View>
                    {/* 工程安全信息 */}
                    <View style={{ width: "100%", marginTop: 10 }}>
                        <Card cornerRadius={0} opacity={0.3} elevation={5} style={{ width: '100%' }}>
                            <TouchableOpacity style={styles.listheader} onPress={() => { this.setState({ engineeringshow: !this.state.engineeringshow }) }}>
                                <Text style={{ fontSize: 18, color: "#62a58f" }}>工程安全信息</Text>
                                <Image source={engineeringshow ? undropDown : dropDown} style={{ width: 20, height: 10 }} />
                            </TouchableOpacity>
                        </Card>
                        {
                            engineeringshow &&
                            <View style={styles.listbodyBorder}>
                                {engineeringList.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <View style={styles.listChecked}>
                                                <CheckBox isChecked={item.checked} onClick={() => { this.onChecked('工程', index, !item.checked, item.name) }}
                                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                                />
                                                <TouchableOpacity style={styles.listSwitch} onPress={() => { this.listSwitch('工程', !item.switched, index) }}>
                                                    <Image source={item.site.length !== 0 ? item.switched ? Close : Open : Close} style={styles.switchedImage} />
                                                    <Text style={styles.checkedText}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {
                                                (item.site.length !== 0 && item.switched) &&
                                                item.site.map((site, idx) => {
                                                    return (
                                                        <View key={idx} style={[styles.listChecked, { paddingLeft: 20 }]}>
                                                            <CheckBox isChecked={site.checked} onClick={() => { this.onSiteCheck('工程', index, idx, !site.checked, site.name) }}
                                                                checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                                                unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                                            />
                                                            <Image source={Close} style={styles.switchedImage} />
                                                            <Text style={styles.checkedText}>{site.name}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                })}
                            </View>}
                    </View>
                    {/* 水质信息 */}
                    <View style={{ width: "100%", marginTop: 10 }}>
                        <Card cornerRadius={0} opacity={0.3} elevation={5} style={{ width: '100%' }}>
                            <TouchableOpacity style={styles.listheader} onPress={() => { this.setState({ waterQualityShow: !this.state.waterQualityShow }) }}>
                                <Text style={{ fontSize: 18, color: "#62a58f" }}>水质信息</Text>
                                <Image source={waterQualityShow ? undropDown : dropDown} style={{ width: 20, height: 10 }} />
                            </TouchableOpacity>
                        </Card>
                        {
                            waterQualityShow &&
                            <View style={styles.listbodyBorder}>
                                {waterQualityList.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <View style={styles.listChecked}>
                                                <CheckBox isChecked={item.checked} onClick={() => { this.onChecked('水质', index, !item.checked, item.name) }}
                                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                                />
                                                <TouchableOpacity style={styles.listSwitch} >
                                                    <Image source={item.switched ? Close : Open} style={styles.switchedImage} />
                                                    <Text style={styles.checkedText}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {
                                                (item.site.length !== 0 && item.switched) &&
                                                item.site.map((site, idx) => {
                                                    return (
                                                        <View key={idx} style={[styles.listChecked, { paddingLeft: 20 }]}>
                                                            <CheckBox isChecked={site.checked} onClick={() => { this.onSiteCheck('工程', index, idx, !site.checked, site.name) }}
                                                                checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                                                unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                                            />
                                                            <Image source={Close} style={styles.switchedImage} />
                                                            <Text style={styles.checkedText}>{site.name}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                })}
                            </View>}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: 'row',
        padding: 10,
    },
    inputPackage: {
        width: "100%",
        borderColor: "#d2d2d2",
        borderWidth: 1,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: "center",
        paddingRight: 8
    },
    input: {
        flex: 1,
        borderWidth: 0,
        margin: 0,
        padding: 2,
        paddingLeft: 10,
        fontSize: 16,
    },
    eventButton: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "#3e5492",
        flexDirection: 'row',
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
    },
    eventButtonText: {
        color: "#3e5492",
        paddingLeft: 5
    },
    listheader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#ebf8f4",
        padding: 10,
        alignItems: "center"
    },
    listSwitch: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    listbodyBorder: {
        flex: 1,
        backgroundColor: "#ebf0ef",
        padding: 10,
        borderColor: "#62a58f",
        borderStyle: 'dashed',
        borderWidth: 0.8,
        borderRadius: 0.1,
    },
    listChecked: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10
    },
    checkImage: {
        width: 25,
        height: 25
    },
    switchedImage: {
        width: 14,
        height: 14,
        marginLeft: 5,
        marginRight: 4
    },
    checkedText: {
        color: "#666666",
        fontSize: 18
    }
})
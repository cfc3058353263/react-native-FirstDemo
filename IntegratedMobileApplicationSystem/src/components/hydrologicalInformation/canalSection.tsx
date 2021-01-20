import React from "react"
import { StyleSheet, Text, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import Select from "../../assets/icons/select.png";
import Checked from "../../assets/icons/checked.png" //ckecked
import Unchecked from "../../assets/icons/unchecked.png" //Unckecked
import { connect } from 'react-redux';

class canalSection extends React.Component<any, any>{
    private _button: any;
    private _buttonFrame: any
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            selectWidth: null,
            txt: '全部渠段',
            showDropDown: false
        }
    }
    async componentDidMount() {

    }
    /**
     * 清空字段
     */
    cleanTxt(){
        this.setState({
            txt:'全部渠段'
        })
    }
    /**
     * 下拉内容的宽度计算
     * @param event 
     */
    onLayout(event) {
        this.setState({
            selectWidth: event.nativeEvent.layout.width
        })
    }
    /**
     * 获取按钮对应位置的方法
     */
    _updatePosition = (callback) => {
        if (this._button && this._button.measure) {
            this._button.measure((fx, fy, width, height, px, py) => {
                this._buttonFrame = { x: px, y: py, w: width, h: height };
                callback && callback();
            });
        }
    };
    //菜单位置
    _calculatePosition = () => {
        let dimensions = Dimensions.get('window');
        let windowWidth = dimensions.width;
        let windowHeight = dimensions.height;

        let dropdownHeight = StyleSheet.flatten(styles.dropdown).height;
        let bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
        let rightSpace = windowWidth - this._buttonFrame.x;
        let showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
        let showInLeft = rightSpace >= this._buttonFrame.x;

        var style: any = {
            height: dropdownHeight,
            top: (showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight)) - 0.5,
        }
        if (showInLeft) {
            style.left = this._buttonFrame.x;
        } else {
            let dropdownWidth = (style && StyleSheet.flatten(style).width) || -1;
            if (dropdownWidth !== -1) {
                style.width = dropdownWidth;
            }
            style.right = rightSpace - this._buttonFrame.w;
        }

        if (this.props.adjustFrame) {
            style = this.props.adjustFrame(style) || style;
        }
        return style;
    }
    /**
     * 下拉数据
     */
    _renderModal = () => {
        const { showDropDown } = this.state
        const { checkList } = this.props
        if (showDropDown && this._buttonFrame) {
            let frameStyle = this._calculatePosition()
            return (
                <Modal
                    visible={true}
                    transparent={true}
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                >
                    <TouchableWithoutFeedback onPress={() => { this.setState({ showDropDown: false }) }}>
                        <View style={styles.modal}>
                            <View style={[frameStyle, styles.dropdown, { width: this.state.selectWidth, height: 30 * 5 + 2 }]}>
                                {
                                    checkList && checkList.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={index} style={styles.selectCanal} onPress={() => { this.onSelect(!item.check, index, item.check) }}>
                                                <Text>{item.value}</Text>
                                                <Image source={item.check ? Checked : Unchecked} style={{ width: 20, height: 20 }} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )
        }
    }
    /**
     * 选框
     * @param value 
     * @param index 
     * @param check 
     * @param canalName 
     */
    onSelect(value, index, check) {
        const { checkList, onCheckList } = this.props
        let list = checkList
        if (index === 0) {
            if (value === false) {
                list = checkList.map((item, _index) => ({ ...item, check: value }))
            } else {
                list = checkList.map((item, _index) => ({ ...item, check: value }))
            }
        } else if (value !== check) {
            list = checkList.map((item, _index) => index == _index ? { ...item, check: value } : item)
            if (!value) {
                list = list.map((item, _index) => _index == 0 ? { ...item, check: value } : item)
            } else {
                let index = 0
                for (var item of list) {
                    if (item.check) {
                        index++
                    }
                }
                if (index === list.length - 1) {
                    list = list.map((item, _index) => _index == 0 ? { ...item, check: true } : item)
                }
            }
        }
        var str = '全部渠段';
        var strList = []
        for (let item of list) {
            if (item.check) {
                strList.push(item.value)
            }
        }
        if (strList.indexOf(str) > -1) {
            this.setState({ txt: '全部渠段' })
        } else if (strList.length === 0) {
            this.setState({ txt: '请选择' })
        } else {
            this.setState({
                txt: strList.join('、')
            })
        }
        onCheckList(list)
    }
    /**
     * 显示
     */
    show() {
        this._updatePosition(
            () => {
                this.setState({
                    showDropDown: true
                })
            }
        )
    }
    render() {
        const { txt } = this.state
        return (
            <View style={styles.H_item}>
                <View style={styles.dddy}>
                    <Text style={styles.text}>{'显示渠段:'}</Text>
                    <View style={styles.s_box} onLayout={(event) => this.onLayout(event)}>
                        <TouchableOpacity
                            style={[styles.button]}
                            ref={button => this._button = button}
                            onPress={() => { this.show() }}>
                            <Text style={styles.selectText} numberOfLines={1}>{txt}</Text>
                            <Image source={Select} style={styles.img} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this._renderModal()}
            </View>
        );
    }
}
const stateToProps = (state) => {
    return {
        checkList: state.checkList
    }
}
const dispatchToProps = (dispatch) => {
    return {
        onCheckList(checkList) {
            let action = {
                type: 'checkList',
                value: checkList
            }
            dispatch(action)
        }
    }
}
export default connect(stateToProps, dispatchToProps, null, { forwardRef: true })(canalSection)
const styles = StyleSheet.create({
    H_item: {
        alignItems: "center",
        marginBottom: 10
    },
    dddy: {
        backgroundColor: "#fcfcfc",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center"
    },
    text: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginRight: 5,
        marginTop: 0,
        lineHeight: 30
    },
    s_box: {
        flex: 7,
        height: 30,
        marginLeft: 10,
        flexDirection: 'row'
    },
    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d2d2d2',
        backgroundColor: "#fff",
        borderRadius: 4,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectText: {
        flex: 1,
        textAlignVertical: "center",
        fontSize: 14,
        paddingLeft: 5,
        flexDirection: 'row',
        color: '#333',
    },
    img: {
        width: 20,
        height: 10,
        marginRight: 5
    },
    modal: {
        flexGrow: 1,
        position: 'relative'
    },
    select: {
        width: "100%",
        height: 30,
    },
    txtStyle: {
        height: 30,
        textAlignVertical: "center",
        fontSize: 16,
        paddingLeft: 5,
        lineHeight: 30,
        backgroundColor: "#fff",
        borderColor: "#d2d2d2",
        borderWidth: 1,
        borderRadius: 4,
    },
    dropdown: {
        position: 'absolute',
        height: 0,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        borderRadius: 2,
        backgroundColor: 'white',
    },
    selectCanal: {
        backgroundColor: "#fff",
        height: 30,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5
    }
})

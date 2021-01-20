import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text, ListView, PixelRatio, Platform, Image, Dimensions, Alert, } from 'react-native'
import Http from "../../utils/request";
import Checked from "../../assets/icons/checked.png" //ckecked
import Unchecked from "../../assets/icons/unchecked.png" //Unckecked
import CheckBox from 'react-native-check-box'
import Button from "react-native-button"
import { Card } from 'react-native-shadow-cards';
import Modal from 'react-native-modal';
import StorageData from '../globalStorage';
import { connect } from 'react-redux';
import store from '../../components/store/store';

class AlertModal extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = store.getState();
        this.state = {
            modalVisible: false,
        }
    }
    checkCanal(canal) {
        if (!canal) {
            Alert.alert(null, "请选择调度单元", [{ text: "确定" }])
        } else {
            this.show()
        }
    }
    show() {
        this.setState({
            modalVisible: true
        })
    }
    hide() {
        this.setState({
            modalVisible: false
        })
    }
    onValueChange(value, index, check) {
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
        onCheckList(list)
    }
    render() {
        const { canalList } = this.state
        const { checkList } = this.props
        return (
            <Modal
                isVisible={this.state.modalVisible}
                animationIn={'bounceInUp'}
                coverScreen={false}
                backdropOpacity={0}
                backdropColor={"#fff"}
                onBackdropPress={() => { null }}
                hideModalContentWhileAnimating={true}
            >
                <View style={styles.center}>
                    <View style={styles.dialogContainer}>
                        <Card cornerRadius={0} opacity={0.3} elevation={5} style={{ width: "100%", borderRadius: 5, alignItems: "center" }}>
                            <View style={{ marginLeft: 40, marginRight: 100, marginTop: 40, marginBottom: 10 }}>
                                {
                                    checkList && checkList.map((item, index) => {
                                        return (
                                            <View key={index}
                                                style={styles.title}>
                                                <CheckBox isChecked={item.check} onClick={() => { this.onValueChange(!item.check, index, item.check) }}
                                                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                                                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                                                />
                                                <View>
                                                    <Text style={styles.imgTxt}>{item.value}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View style={{ width: 100, marginBottom: 40 }}>
                                <Button style={styles.subButton} containerStyle={styles.containerStyle}
                                    onPress={() => { this.hide() }}
                                >
                                    确认
                        </Button>
                            </View>
                        </Card>
                    </View>
                </View>
            </Modal>
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
export default connect(stateToProps, dispatchToProps, null, { forwardRef: true })(AlertModal)
var styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    dialogContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 10
    },
    imgTxt: {
        fontSize: 16,
        marginLeft: 5
    },
    subButton: {
        fontSize: 16,
        color: '#fff',
        height: 35,
        borderRadius: 10,
        lineHeight: 35,
        textAlign: "center",
        width: "100%"
    },
    containerStyle: {
        height: 35,
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: "#2a5696",
        width: "100%"
    },
    checkImage: {
        width: 22,
        height: 22
    },
});
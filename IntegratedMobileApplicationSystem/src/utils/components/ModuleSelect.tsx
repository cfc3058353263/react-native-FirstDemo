import React from "react";
import { StyleSheet, View, Text, TextInput, Dimensions, Platform, Image } from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
import Select from "../../assets/icons/select.png"

export default class ModuleSelect extends React.Component<any, any>{
    constructor(props: any) {
        super(props)
        this.state = {
            selectWidth: null
        }
    }
    select(i) {
        this.refs.ref.select(-1)
    }
    onLayout(event) {
        this.setState({
            selectWidth: event.nativeEvent.layout.width
        })
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { context, isRequire, data, onSelect, defaultValue, disabled, spaceBetween, getWidth, width } = this.props;
        let nameText = context.split("")
        return (
            <View style={styles.container}>
                <View onLayout={ spaceBetween ? null : getWidth }>
                    {spaceBetween ?
                        <View style={{ width: width, flexDirection: "row", justifyContent: "space-between" }}>
                            {
                                nameText.map((item, index) => {
                                    return (
                                        index == nameText.length - 1 ?
                                            <Text key={index} style={[styles.Widthtxt,{marginRight:5}]}>{item + ":"}</Text> :
                                            <Text key={index} style={styles.Widthtxt}>{item}</Text>
                                    )
                                })
                            }
                        </View>
                        :
                        <Text style={styles.txt}>{context + ':'}</Text>
                    }
                </View>
                <View style={styles.s_box} onLayout={(event) => this.onLayout(event)}>
                    <ModalDropdown options={(data ? data : [''])}
                        style={styles.select}
                        dropdownStyle={[styles.dpdown, { width: this.state.selectWidth }]}
                        textStyle={[styles.txtStyle, disabled === false ? { color: "#333", } : { color: "#999999", }]}
                        defaultValue={defaultValue ? defaultValue : "请选择"}
                        onSelect={onSelect}
                        disabled={disabled}
                        select={this.select}
                        ref={'ref'}
                        enableEmptySections={true}
                    />
                    <Image source={Select} style={styles.img} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fcfcfc",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "center"
    },
    Widthtxt: {
        fontSize: 16,
        textAlign: "right",
        textAlignVertical: "center",
        marginTop: 0,
        lineHeight: 30
    },
    txt: {
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
    },
    select: {
        width: "100%",
        height: 30,
    },
    dpdown: {
        maxHeight: 300,
        top: 0,
        overflow: "visible",
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
    img: {
        position: "absolute",
        width: 20,
        height: 10,
        right: 5,
        top: 10
    }
})

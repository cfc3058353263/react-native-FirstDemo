import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Checked from "../../assets/icons/checked.png" //ckecked
import Unchecked from "../../assets/icons/unchecked.png" //Unckecked
import CheckBox from 'react-native-check-box'
export default class ModelMenu extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            checked: this.props.value
        }
    }
    onchangeValue() {
        this.setState({
            checked: !this.state.checked
        })
        this.props.onClick(!this.state.checked)
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { source, context,value } = this.props;
        return (
            <View>
                <CheckBox isChecked={this.state.checked} onClick={() => { this.onchangeValue() }}
                    checkedImage={<Image source={Checked} style={styles.checkImage} />}
                    unCheckedImage={<Image source={Unchecked} style={styles.checkImage} />}
                />
                <View style={styles.itemOne}>
                    <Image source={source} style={styles.img} />
                    <Text>{context}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    checkImage: {
        width: 25,
        height: 25
    },
    img: {
        width: 42,
        height: 42
    },
    imgTxt: {
        fontSize: 16,
        marginBottom: 5
    },
    itemOne: {
        minWidth: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: "center",
        textAlign: "center",
        alignItems: 'center',
    },
})

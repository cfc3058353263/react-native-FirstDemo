import React from "react"
import { StyleSheet, Text, View, Image } from "react-native";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import Riqi from '../../assets/icons/riqi.png'
export default class ModelDate extends React.Component<any, any>{
    constructor(props: Readonly<any>) {
        super(props);
        this.state = {
            time: moment()
        }
    }
    componentDidMount(): void {
        this.setState(() => ({
            time: this.props.date
        }));
    }

    onDateChange(date: Date) {
        this.setState(() => ({
            time: date
        }));
        const { onDateChange } = this.props;
        if (onDateChange) {
            onDateChange(date);
        }
    }
    render() {
        const { title, isRequire, props } = this.props;
        const { time } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.Title}>{title + ":"}</Text>
                <View style={styles.sbox}>
                    <DatePicker style={styles.date}
                        androidMode={'spinner'}
                        mode={props.mode ? props.mode : "datetime"}
                        format={props.format ? props.format : "YYYY-MM-DD HH:mm:ss"}
                        confirmBtnText={props.confirmBtnText ? props.confirmBtnText : "确定"}
                        cancelBtnText={props.cancelBtnText ? props.cancelBtnText : "取消"}
                        showIcon={props.showIcon ? props.showIcon : false}
                        // minDate={props.minDate ? props.minDate : new Date()}
                        maxDate={props.maxDate ? props.maxDate : new Date()}
                        date={this.props.date}
                        customStyles={{ dateInput: styles.dateInput, dateText: styles.dateText }}
                        onDateChange={(date: Date) => this.onDateChange(date)}
                    />
                    <Image source={Riqi} style={styles.img} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    Title: {
        fontSize: 16,
        lineHeight: 30,
        textAlign: "right",
        marginRight: 5,
    },
    sbox: {
        flex: 1,
        marginLeft: 10,
        height: 30,
        justifyContent: "center",
    },
    date: {
        width: "100%",
        padding: 0,
        height: 30,
        justifyContent: "center",
    },
    dateInput: {
        height: 30,
        alignItems: "flex-start",
        paddingLeft: 5,
        borderWidth: 1,
        borderColor: "#d2d2d2",
        borderRadius: 5,
        backgroundColor:"#fff"
    },
    dateText: {
        color: "#333333"
    },
    img: {
        position: "absolute",
        width: 18,
        height: 20,
        right:5,
        top:5
    }
})

import React from "react"
import {ActivityIndicator, Modal, StyleSheet, Text, View} from "react-native";


export default class ModuleLoading extends React.Component<any,any,any>{
    constructor(props:Readonly<any>) {
        super(props);
        this.state = {
            show:false
        }
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
    }
    public hide():void{
        this.setState({
            show:false
        })
    }
    public show():void{
        this.setState({
            show:true
        })
    }
    render(){
        const {show} = this.state;
        return (
            <Modal  animationType="slide"
                    transparent={true}
                    visible={show}>
                <ActivityIndicator size="large" color="#0000ff"  style={styles.container}/>
            </Modal>
        );
    }
}

const  styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#33333379"
    },

})

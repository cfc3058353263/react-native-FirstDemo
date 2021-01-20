import React, { useState, useEffect } from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
// import { Camera } from 'expo-camera';
import {BarCodeScanner} from "expo-barcode-scanner";

export default class ModuleCamera extends React.Component<any, any>{
    constructor(props:Readonly<any>) {
        super(props);
        this.state = {
            hasPermission:null,
        }
    }
    async componentDidMount(){
        // const { status } = await Camera.requestPermissionsAsync();
        // this.setState({
        //     hasPermission: status === 'granted'
        // })
    }
render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    if (this.state.hasPermission === null) {
        return <View />;
    }
    if (this.state.hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    let camera;
    const { navigation } = this.props;
    return (
        <View style={{ flex: 1 }}>
            {/* <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={ref => {
                camera = ref;
            }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent:"center",
                        alignItems:"center",
                        marginLeft:(Dimensions.get("window").width-100)/2,
                        marginRight:(Dimensions.get("window").width-100)/2,
                        marginBottom:50
                    }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignSelf: 'flex-end',

                        }}
                        onPress={async () => {
                            if(camera){
                                await camera.takePictureAsync({
                                    quality:1,
                                    base64:true,
                                    onPictureSaved:(pic:any)=>{
                                        // console.log(pic);
                                        navigation.goBack();
                                        navigation.state.params.takePic(pic);
                                    }
                                });
                            }

                        }}>
                        <View style={{height:100,width:100,alignItems:"center",borderRadius:100}}>
                            <View style={{height:100,width:100,borderRadius:100,borderColor:"#fff",borderWidth:1,borderStyle:"solid",alignItems:"center",justifyContent:"center"}}>
                                <View style={{height:50,width:50,borderRadius:50,borderColor:"#fff",borderWidth:1,borderStyle:"solid"}}></View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </Camera> */}
        </View>
    );

}



}
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MapView } from 'react-native-amap3d'
/**
 * 高德地图组建
 */
export default class AMap3d extends React.Component<any, any>{
    private title: any;
    private _mapView: any;
    constructor(props: Readonly<any>) {
        super(props);
        this.title = '';
    }
    componentDidMount(): void {

    }

    render() {
        if (!this.props.navigation) {
            return <MapView
                style={StyleSheet.absoluteFill}
                zoomLevel={7}
                coordinate={{
                    latitude: 36.883,
                    longitude: 119.8938,
                }}
            />
        }
        let { data } = this.props.navigation.state.params;
        console.log(data)
        if (data.length === 0) {
            data = [119.8938, 36.883, '地图'];
        }
        return (
            <MapView
                ref={ref => this._mapView}
                style={StyleSheet.absoluteFill}
                zoomLevel={6}
            // coordinate={{
            //     latitude: data[1],
            //     longitude: data[0],
            // }}
            >
                <MapView.Marker
                    draggable
                    title={data[2]}
                    coordinate={{
                        latitude: parseFloat(data[1]),
                        longitude: parseFloat(data[0]),
                    }}
                />
            </MapView>
        );
    }
}



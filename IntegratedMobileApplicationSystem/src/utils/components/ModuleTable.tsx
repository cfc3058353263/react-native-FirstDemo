import React from "react";
import {
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    ActivityIndicator, findNodeHandle
} from "react-native";
import {Row, Rows, Table} from 'react-native-table-component';
/**
 * 表格
 */
export default class ModuleTable extends React.Component<any, any>{

    loadMoreAnimat=()=><ActivityIndicator
        animating={true}
        color='red'
        size="large"
    />

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {tableHeader,tableData,onPress,rowDeal,dropDownOrUp,onRefresh,refreshing,widthArr} = this.props;
        const android = (Platform.OS =="android");

        if(dropDownOrUp){//下拉刷新和上啦加载
            return (
                <View style={styles.container}>
                    {/*<View style={styles.tableHeader}>*/}
                    {/*    <Table borderStyle={styles.table}>*/}
                    {/*        <Row data={tableHeader} textStyle={styles.tableHeaderText}*/}
                    {/*             style={ (android?styles.tableHeaderItemAndroid:styles.tableHeaderItemIos)} />*/}
                    {/*    </Table>*/}
                    {/*    /!*<Table borderStyle={styles.table}>*!/*/}
                    {/*        <FlatList data={[...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData,...tableData]}*/}
                    {/*                  refreshing={!!refreshing}*/}
                    {/*                  onRefresh={()=>{*/}
                    {/*                      this.loadMoreAnimat()*/}
                    {/*                  }}*/}
                    {/*                  keyExtractor={({item, index})=>{return index}}*/}
                    {/*                  onEndReachedThreshold={0.9}*/}
                    {/*                  onEndReached={()=>{*/}
                    {/*                      console.log(11)*/}
                    {/*                      this.loadMoreAnimat()*/}
                    {/*                  }}*/}
                    {/*                  // ListHeaderComponent={()=>(<View style={{borderStyle:"solid",borderWidth:1,borderColor:"red",height:20}}></View>)}*/}
                    {/*                  ListEmptyComponent = {()=>{return (<Text style={{*/}
                    {/*                      fontSize:16,*/}
                    {/*                  }}>no data</Text>)}}*/}
                    {/*                  // ItemSeparatorComponent={null}*/}
                    {/*                  renderItem={({item,index})=>{*/}
                    {/*                      let dealData = item;*/}
                    {/*                      if(rowDeal){*/}
                    {/*                          dealData = rowDeal(item,index);*/}
                    {/*                      }*/}
                    {/*                      return (*/}
                    {/*                          <TouchableOpacity onPress={()=>{*/}
                    {/*                              onPress && onPress(item);*/}
                    {/*                          }} key={index}*/}
                    {/*                          >*/}
                    {/*                              <Row data={dealData} textStyle={styles.tableText}*/}
                    {/*                                   style={ (android?styles.tableItemAndroid:styles.tableItemIos)} />*/}
                    {/*                          </TouchableOpacity>*/}
                    {/*                      )*/}
                    {/*                  }} />*/}
                    {/*    /!*</Table>*!/*/}
                    {/*</View>*/}
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.tableHeader}>
                    <Table borderStyle={styles.table}>
                        <Row data={tableHeader} textStyle={styles.tableHeaderText}
                             style={ (android?styles.tableHeaderItemAndroid:styles.tableHeaderItemIos)} />
                    </Table>
                    <ScrollView style={styles.ScrollViewTable}>
                        <Table borderStyle={styles.table}>
                            {tableData && tableData.map((rowData:string[],index:number)=>{
                                let dealData = rowData;
                                if(rowDeal){
                                    dealData = rowDeal(rowData,index);
                                }
                                return (
                                    <TouchableOpacity onPress={()=>{
                                        onPress && onPress(rowData,index);
                                    }} key={index}
                                    >
                                        <Row data={dealData} textStyle={styles.tableText} ref={"row"} widthArr={widthArr}
                                             style={ (android?styles.tableItemAndroid:styles.tableItemIos)} />
                                    </TouchableOpacity>
                                )
                            })}
                        </Table>
                    </ScrollView>
                </View>
                <View  style={styles.footer} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        paddingTop: 0,
        flexDirection:"row",
        flexWrap:"wrap",
    },
    footer:{
        height:10
    },

    borderLine:{
        height:10,
    },
    table:{
        borderWidth: 1,
        borderColor: '#d4ddea',


    },
    tableHeader:{
        flex:3,
        borderTopWidth:4,
        borderStyle:"solid",
        borderTopColor:"#2a5695"
    },
    tableHeaderItemAndroid:{
        backgroundColor:"#eef1f6",
        borderWidth:1,
        borderTopWidth:0,
        borderStyle:"solid",
        borderColor:"#d4ddea"
    },
    tableHeaderItemIos:{
        backgroundColor:"#eef1f6",
        borderStyle:"solid",
        borderBottomColor:"#d4ddea",
        borderBottomWidth: 1
    },
    tableHeaderText:{
        fontSize:16,
        fontWeight:"bold",
        textAlign:"center",
        color:"#245695",
        paddingTop:6,
        paddingBottom: 6,
        paddingLeft:1,
        paddingRight:1,
        borderWidth:1,
        borderTopWidth:0,
        borderBottomWidth:0,
        // height:30,
        borderStyle:"solid",
        borderColor:"#d4ddea",
    },
    ScrollViewTable:{
        // flex:1,
    },
    tableText:{
        fontSize:16,
        textAlign:"center",
        textAlignVertical:"center",
        color:"#000",
        borderWidth:1,
        borderTopWidth:0,
        borderBottomWidth:0,
        flex:1,
        padding:5,
        borderStyle:"solid",
        borderColor:"#d4ddea",
    },
    tableItemAndroid:{
        backgroundColor:"#fff",
        borderWidth:1,
        borderTopWidth:0,
        borderStyle:"solid",
        borderColor:"#d4ddea"

    },
    tableItemIos:{
        backgroundColor:"#fff",
        borderStyle:"solid",
        borderBottomColor:"#d4ddea",
        borderBottomWidth: 1,
    },
})


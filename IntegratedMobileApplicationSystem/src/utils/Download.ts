import React from "react"
import * as FileSystem from 'expo-file-system';
import {Alert} from "react-native";

/**
 * 下载功能，暂不提供断点续传功能
 */
export default class Download {
    private url:string;
    private path: string;
    constructor(url:string) {
        this.url = url;
        this.path = FileSystem.documentDirectory;
    }
    async download(callback:Function = (progress:number)=>{}){
        const downloadResumable = FileSystem.createDownloadResumable(
            this.url,
            this.path + this.url.split("/").pop(),
            {},
            (downloadProgress:any)=>{
                /* 下载进度 */
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                callback(progress);
            }
        );
        try {
            const {uri} = await downloadResumable.downloadAsync();
            console.log(uri)
            /* 将远程URI上的内容下载到应用程序文件系统中的文件。调用此函数之前，本地文件uri的目录必须存在。 */
            FileSystem.downloadAsync(
                this.url,
                this.path + 'small.mp4'
              )
                .then(({ uri }) => {
                  console.log('Finished downloading to ', uri);
                })
                .catch(error => {
                  console.error(error);
                });
        }catch (e) {
            Alert.alert(null,e);
        }
        
    }

}


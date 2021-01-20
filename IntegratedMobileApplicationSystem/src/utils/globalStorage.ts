import AsyncStorage from "@react-native-community/async-storage"

/**
 * 本地缓存管理
 */
export default class StorageData {
    static async saveItem(key: string, value: string) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            // alert(JSON.stringify(e));
        }
    }
    static async getItem(key: string) {
        try {
            return await AsyncStorage.getItem(key).then((value: string) => {
                return value;
            });

        } catch (e) {
            // alert(JSON.stringify(e));
        }
    }
    static async clearItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {

        }
    }
    static async clearAll() {
        try {
            await AsyncStorage.clear();
        } catch (e) {

        }
    }
}


/**
 * 常用工具包
 */
export default class Util {

    /**
     * 获取uuid
     */
    generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    /**
     * 对字符串中的数据进行拿取
     * @param {Object} name 要拿取的字符串
     * @param {Object} splitString 分割的标示符
     * @param {Object} data 要分割的字符串
     */
    urlParamanAlysis(name, splitString, data) {
        let str_1 = data;
        if (splitString) {
            str_1 = data.split(splitString)[0];
        }
        return str_1.split(name).pop();
    }
}
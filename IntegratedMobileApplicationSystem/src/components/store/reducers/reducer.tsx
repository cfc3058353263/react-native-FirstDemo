const defaultState = {
    menuList: [], //功能组

    checkList:[] //水情信息查询数组
}  //默认数据
export default (state = defaultState, action) => {  //就是一个方法函数
    if (action.type === 'addmenu') { //根据type值，编写业务逻辑
        let newState = JSON.parse(JSON.stringify(state))
        newState.menuList = action.value
        return newState
    }
    if (action.type === 'checkList') {
        let newState = JSON.parse(JSON.stringify(state))
        newState.checkList = action.value
        return newState
    }
    return state
}
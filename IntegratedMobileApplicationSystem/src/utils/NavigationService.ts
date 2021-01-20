/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-13 15:48:27
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-13 16:43:04
 */

import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
        })
      ]
    })
  );
}
export default {
  navigate,
  setTopLevelNavigator,
};
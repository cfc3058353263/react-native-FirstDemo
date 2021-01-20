package com.mobileintegratedapplication;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.github.yamill.orientation.OrientationPackage;
import cn.jiguang.plugins.push.JPushPackage;
import org.reactnative.camera.RNCameraPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import cn.qiuxiang.react.amap3d.AMap3DPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.mobileintegratedapplication.generated.BasePackageList;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.rnscreens.RNScreensPackage;

import org.unimodules.adapters.react.ReactAdapterPackage;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.Package;
import org.unimodules.core.interfaces.SingletonModule;
import expo.modules.constants.ConstantsPackage;
import expo.modules.permissions.PermissionsPackage;
import expo.modules.filesystem.FileSystemPackage;

import java.util.Arrays;
import java.util.List;

import com.reactnative.RNReactPackage;
import cn.jiguang.plugins.push.JPushModule;
// for react-native-orientation
import android.content.Intent; 
import android.content.res.Configuration;


public class MainApplication extends Application implements ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
    new BasePackageList().getPackageList(),
    Arrays.<SingletonModule>asList()
  );

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }   
    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }    
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG,"http://124.128.244.106:9101/"),
            new AsyncStoragePackage(),
            new RNFetchBlobPackage(),
            new ReactVideoPackage(),
            new OrientationPackage(),
            new JPushPackage(),
            new RNCameraPackage(),
            new ImageResizerPackage(),
            new RNFSPackage(),
            new RNCViewPagerPackage(),
            new PickerPackage(),
            new NetInfoPackage(),
            new LocationServicesDialogBoxPackage(),
            new AMapGeolocationPackage(),
            new BackgroundJobPackage(),
            new AMap3DPackage(),
            new RNCWebViewPackage(),
          new ReanimatedPackage(),
          new RNGestureHandlerPackage(),
          new RNScreensPackage(),
          new ModuleRegistryAdapter(mModuleRegistryProvider),
          new RNReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    //调用此方法：点击通知让应用从后台切到前台
    JPushModule.registerActivityLifecycle(this);
  }
    // for react-native-orientation
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }
}

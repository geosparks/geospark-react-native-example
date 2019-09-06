# geospark-react-native-example

## Quick start Android 

**Step 1:**
```
 npm install 
```
or
```
 yarn add
```

**Install React Native CLI**
```
npm install -g react-native-cli
```

**Step 2: Install SDK**
```bash
npm install react-native-geospark --save
react-native link react-native-geospark
```
**Step 3: Initialize SDK**
```
Initialize the SDK with your PublishKey
```
**Step 4: Run Android**
```
react-native run-android
```


## Quick start iOS

[^reference link]: https://docs.geospark.co/react-native/quickstart



1. PreSetup:

   ```bash
   sudo gem install cocoapods
   ```

   ```bash
   pod init
   ```

2. go to the `ios` folder in the react project and open the Podfile and replace it with

    

   ```
   # platform :ios, '10.0'
   
   target 'GeoSparkRNExample' do
   
     # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
   
     # use_frameworks!
   
     pod 'GeoSpark'
   
     # Pods for GeoSparkRNExample
   
   end
   ```

   then do it

3. ```bash
   pod install
   ```

   then after this do a  react-native install

   ```bash
   npm install react-native-geospark --save
   react-native link react-native-geospark
   ```

   **Manual Linking steps :**

   ```
   1. Open the iOS module files, located inside node_modules/react-native-geospark/ios/.
   2. Open the app workspace file (AppName.xcworkspace) in Xcode.
   3. Move the RNGeoSpark.h and RNGeoSpark.m files to your project. When shown a popup                   	 window, select Create groups.
   ```

   file contents are:

   ```objective-c
   //
   //  RNGeoSpark.h
   //  RNGeoSpark
   //
   //  Created by GeoSpark Mac #1 on 12/06/18.
   //  Copyright © 2018 GeoSpark. All rights reserved.
   //
   
   #import <React/RCTBridgeModule.h>
   #import <React/RCTConvert.h>
   #import <React/RCTUtils.h>
   #import <React/RCTEventEmitter.h>
   #import <GeoSpark/GeoSpark.h>
   
   @import CoreLocation;
   
   @interface RNGeoSpark : RCTEventEmitter <RCTBridgeModule>
   @end
   
   ```

   ```objective-c
   //
   //  RNGeoSpark.m
   //  RNGeoSpark
   //
   //  Copyright © 2018 GeoSpark, Inc. All rights reserved.
   //
   
   #import "RNGeoSpark.h"
   #import <GeoSpark/GeoSpark.h>
   
   @implementation RNGeoSpark{
       BOOL hasListeners;
   }
   RCT_EXTERN_METHOD(supportedEvents)
   RCT_EXPORT_MODULE();
   
   
   - (instancetype)init {
     self = [super init];
     if (self) {
       
     }
     return self;
   }
   
   - (NSArray<NSString *> *)supportedEvents {
     return @[@"events",@"location", @"error"];
   }
   
   - (void)startObserving {
     hasListeners = YES;
   }
   
   - (void)stopObserving {
     hasListeners = NO;
   }
   
   
   RCT_EXPORT_METHOD(createUser:(NSString *)userDescription :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark createUser:userDescription :^(GeoSparkUser * user) {
       NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:user.userId, nil];
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(getUser:(NSString *)userId :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark getUser:userId :^(GeoSparkUser * user) {
       NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:user.userId, nil];
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(setDescription:(NSString *)userDescription :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark setDescription:userDescription :^(GeoSparkUser * user) {
       NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:user.userId, nil];
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(requestMotionPermission){
     [GeoSpark requestMotion];
   }
   
   RCT_EXPORT_METHOD(requestLocationPermission){
     [GeoSpark requestLocation];
   }
   
   RCT_EXPORT_METHOD(checkLocationPermission :(RCTPromiseResolveBlock)callback){
     NSString *str = [self checkPermission:[GeoSpark isLocationEnabled]];
     callback(str);
   }
   
   RCT_EXPORT_METHOD(checkMotionPermission :(RCTPromiseResolveBlock)callback){
     NSString *str = [self checkPermission:[GeoSpark isMotionEnabled]];
     callback(str);
   }
   
   
   RCT_EXPORT_METHOD(startTrip:(NSString *)tripDescription :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
       dispatch_async(dispatch_get_main_queue(), ^{
           [GeoSpark startTrip:tripDescription :^(GeoSparkTrip * trip) {
               NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:trip.tripId, nil];
               successCallback(dict);
           } onFailure:^(GeoSparkError * error) {
               errorCallback([self error:error]);
           }];
       });
   }
   RCT_EXPORT_METHOD(endTrip:(NSString *)tripId :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark endTrip:tripId :^(GeoSparkTrip * trip) {
       NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:trip.tripId, nil];
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(activeTrips :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark activeTrips:^(GeoSparkTrips * trips) {
         NSMutableArray *dict = [[NSMutableArray alloc] init];
         for (int i = 0; i < [trips.data count]; i++)
         {
             [dict addObject:[trips.data objectAtIndex:i].tripId];
         }
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(createGeofence:(double)latitude :(double)longitude :(NSInteger)radius :(NSInteger)expiryTime :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark createGeofenceWithLatitude:latitude longitude:longitude expiry:expiryTime radius:radius :^(GeoSparkGeofence * geofence) {
       NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:geofence.geofence_id, nil];
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(deleteGeofence:(NSString *)geofenceId :(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark deleteGeofence:geofenceId :^(NSString * geofence) {
       NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:geofence, nil];
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(geofenceList:(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark geofenceList:^(GeoSparkGeofenceList * list) {
         NSMutableArray *dict = [[NSMutableArray alloc] init];
         for (int i = 0; i < [list.data count]; i++)
         {
             [dict addObject:[list.data objectAtIndex:i].geofenceId];
         }
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(startTracking){
     [GeoSpark startTracking];
   }
   
   RCT_EXPORT_METHOD(stopTracking){
     [GeoSpark stopTracking];
   }
   
   RCT_EXPORT_METHOD(logout:(RCTResponseSenderBlock)successCallback rejecter:(RCTResponseErrorBlock)errorCallback){
     [GeoSpark logout:^(NSString * userId) {
       NSMutableArray *dict = [[NSMutableArray alloc] initWithObjects:userId, nil];
       successCallback(dict);
     } onFailure:^(GeoSparkError * error) {
       errorCallback([self error:error]);
     }];
   }
   
   RCT_EXPORT_METHOD(setTrackingInAppState:(NSArray *)states){
     [GeoSpark trackLocationInAppState:states];
   }
   
   RCT_EXPORT_METHOD(setTrackingInMotion:(NSArray *)motions){
     [GeoSpark trackLocationInMotion:motions];
   }
   
   -(NSError *)error:(GeoSparkError *)error{
     return [NSError errorWithDomain:error.errorMessage code:[self removeString:error.errorCode] userInfo:nil];
   }
   
   -(NSString *)checkPermission:(BOOL)isEnabled{
     if (isEnabled){
       return @"GRANTED";
     } else {
       return @"DENIED";
     }
   }
   
   -(NSInteger)removeString:(NSString *)stringValue{
     NSMutableString *strippedString = [NSMutableString stringWithCapacity:stringValue.length];
     NSScanner *scanner = [NSScanner scannerWithString:stringValue];
     NSCharacterSet *numbers = [NSCharacterSet characterSetWithCharactersInString:@"0123456789"];
     while ([scanner isAtEnd] == NO) {
       NSString *buffer;
       if ([scanner scanCharactersFromSet:numbers intoString:&buffer]) {
         [strippedString appendString:buffer];
       } else {
         [scanner setScanLocation:([scanner scanLocation] + 1)];
       }
     }
     return @([strippedString integerValue]);
   }
   
   @end
   
   ```

   

   **Finally update the `AppDelegate.h` and `AppDelegate.m` files and its contents looks as follow**

   ```objective-c
   // AppDelegate.h
   
   /**
    * Copyright (c) 2015-present, Facebook, Inc.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    */
   
   #import <UIKit/UIKit.h>
   #import <GeoSpark/GeoSpark.h>
   #import <UserNotifications/UserNotifications.h>
   
   @interface AppDelegate : UIResponder <UIApplicationDelegate,GeoSparkDelegate,UNUserNotificationCenterDelegate>
   
   @property (nonatomic, strong) UIWindow *window;
   
   @end
   
   ```

   ```objective-c
   // AppDelegate.m
   
   /**
    * Copyright (c) 2015-present, Facebook, Inc.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    */
   
   #import "AppDelegate.h"
   
   #import <React/RCTBundleURLProvider.h>
   #import <React/RCTRootView.h>
   
   @implementation AppDelegate
   
   - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
   {
     NSURL *jsCodeLocation;
     
     [GeoSpark intialize:@"01ca81b62ef55ba0e96364955b3b9d3b3365be3dccbece548b6dbf62129279e2"];
     GeoSpark.delegate = self;
     
     UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
     center.delegate = self;
     [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error) {
       if( !error ) {
         // required to get the app to do anything at all about push notifications
         //      DispatchQueue.main.async(execute: {
         dispatch_async(dispatch_get_main_queue(), ^{
           [[UIApplication sharedApplication] registerForRemoteNotifications];
           NSLog( @"Push registration success." );
           
         });
         //      }
       } else {
         NSLog( @"Push registration FAILED" );
         NSLog( @"ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );
         NSLog( @"SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );
       }
     }];
   /////////////////////////////////////////////////////////////////////////////////////
   // Just ignore this part of code dont change it ////////////////////////////////////
   #ifdef DEBUG 
     jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
   #else
     jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
   #endif
     
     RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                         moduleName:@"TestExample"
                                                  initialProperties:nil
                                                      launchOptions:launchOptions];
     rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
     
     self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
     UIViewController *rootViewController = [UIViewController new];
     rootViewController.view = rootView;
     self.window.rootViewController = rootViewController;
     [self.window makeKeyAndVisible];
     return YES;
   }
   //////////////////////////////////////////////////////////////////////////////////////
   // add this below part of functions
   - (void)didUpdateLocation:(GSLocation * _Nonnull)location {
     NSLog(@"didUpdate %@",location.userId);
     NSLog(@"didUpdateLocation %f",location.latitude);
     NSLog(@"didUpdateLocation %f",location.longitude);
   }
   
   - (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
   {
     NSLog(@"deviceToken: %@", deviceToken);
     [GeoSpark setDeviceToken:deviceToken];
   }
   -(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
   }
   -(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
       [GeoSpark notificationOpenedHandler:response];
        completionHandler();
   }
   
   @end
   
   
   ```

   Final configuration in the general -> build settings-> all

   `always embed swift standard libraries == yes`

   set this above filed to yes

   Finally run this for ios: 

   ```bash
   react-native run-ios
   ```

   

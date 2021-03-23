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
  [GeoSpark initialize:@"6e6d7628940bfcf95c1ede51767717d70abd5ea45c7da83ebea812dc89ae0499" :nil :nil :nil :nil :AWSRegionUnknown];
  [GeoSpark setDelegate:self];
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if( !error ) {
      // required to get the app to do anything at all about push notifications
      //      DispatchQueue.main.async(execute: {
      dispatch_async(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication] registerForRemoteNotifications];
        NSLog( @"Push r egistration success." );
        
      });
      //      }
    } else {
      NSLog( @"Push registration FAILED" );
      NSLog( @"ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );
      NSLog( @"SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );
    }
  }];

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"mymodule"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor blackColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}


- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSLog(@"deviceToken: %@", deviceToken);
  [GeoSpark setDeviceToken:deviceToken];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
  NSLog(@"willPresentNotification %@", notification);
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
  completionHandler();
}


- (void)didUpdateLocation:(GeoSparkLocation *)location{
  NSLog(@"didUpdateLocation %@",location.userId);
}
- (void)didReceiveEvents:(GeoSparkEvents *)events{
  
}
- (void)didReceiveUserLocation:(GeoSparkLocationReceived *)location{
  
}
- (void)didReceiveTripStatus:(TripStatusListener *)tripStatus{
  
}
- (void)onError:(GeoSparkError *)error{
  
}


@end

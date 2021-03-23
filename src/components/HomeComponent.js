/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { Header, Button, Input } from "react-native-elements";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  TextInput,
  Alert,
  TouchableHighlight,
  ActivityIndicator,
  ToastAndroid,
  AsyncStorage,
  ScrollView
} from "react-native";
import Roam from "roam-reactnative";
import Toast, { DURATION } from "react-native-easy-toast";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const { width, height } = Dimensions.get("window");

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: null,
      description: null,
      isUserCreated: false,
      isTrakingStarted: false,
      isFetching: false,
      platforms: "ios",
      isLocationPermission: false,
      isActivityPermission: false,
      isBackgroundPermission: false,
      isMotionService: false,
      isBatteryOptimization: false,
      isMockEnabled: false
    };
  }

  async componentWillMount() {
    const plateform = Platform.OS;
    const userId = await AsyncStorage.getItem("geospark_userId");
    const traking = await AsyncStorage.getItem("geospark_traking");
    const userDescription = await AsyncStorage.getItem("geospark_description");
  
    if (userId !== null) {
      const trakingStarted = traking === "yes" ? true : false;
      this.setState({
        userid: userId,
        isUserCreated: true,
        isTrakingStarted: trakingStarted,
        description: userDescription
      });
    }

    Roam.checkLocationPermission(
      status => {
        if (status == "GRANTED") {
          this.setState({
            isLocationPermission: true
          });
        }
      },
      error => {}
    );

    if (plateform === "ios") {
      console.log("IOSSSSSSS");
      Roam.checkMotionPermission(
        status => {
          console.log(status);

          if (status == "GRANTED") {
            this.setState({
              isMotionService: true
            });
          }
        },
        error => {}
      );
    } else {
      Roam.disableBatteryOptimization(this);
      Roam.checkMotionPermission(
        status => {
          console.log(status);
          if (status == "ENABLED") {
            this.setState({
              isActivityPermission: true
            });
          }
        },
        error => {}
      );

      Roam.checkBackgroundLocationPermission(
        status => {
          console.log(status);
          if (status == "ENABLED") {
            this.setState({
              isBackgroundPermission: true
            });
          }
        },
        error => {}
      );

      Roam.checkLocationServices(
        status => {
          console.log(status);
          if (status == "ENABLED") {
            this.setState({
              isMotionService: true
            });
          }
        },
        error => {}
      );

      Roam.isBatteryOptimizationEnabled(
        status => {
          console.log(status);

          if (status == "ENABLED") {
            this.setState({
              isBatteryOptimization: true
            });
          }
        },
        error => {}
      );
    }

    this.setState({
      platforms: plateform
    });
  }

  userIDChange(e) {
    // console.log(e.nativeEvent.text);
    this.setState({
      userid: e.nativeEvent.text
    });
  }

  userDescriptionChange(e) {
    this.setState({
      description: e.nativeEvent.text
    });
  }

  onCreateUser() {
    let that = this;
    this.setState({
      isFetching: true
    });
    Roam.createUser(
      this.state.description,
      async success => {
        Roam.toggleEvents(true,true,true,true,async success => {
          Roam.toggleListener(true,true, async success => {
            this.setState({
              isUserCreated: true,
              isFetching: false
            });
          },
          error => {
            console.log(error);
            that.refs.toast.show("User Created Failed!");
            this.setState({
              isFetching: false
            });
          });
         },
         error => {
          console.log(error);
          that.refs.toast.show("User Created Failed!");
          this.setState({
            isFetching: false
          });
         }
        )
        const userID = success.userId;
        await AsyncStorage.setItem("geospark_userId", userID);
        await AsyncStorage.removeItem("geospark_description");
        this.setState({ userid: userID });
        that.refs.toast.show("User Created Successfully!");
      },
      error => {
        console.log(error);
        that.refs.toast.show("User Created Failed!");
        this.setState({
          isFetching: false
        });
      }
    );
  }

  onSetDescription() {
    const { description } = this.state;
    Roam.setDescription(description);
  }

  onLoginUser() {
    const { userid } = this.state;
    let that = this;
    this.setState({
      isFetching: true
    });
    Roam.getUser(
      userid,
      async success => {
        console.log(success);
        await AsyncStorage.setItem("geospark_userId", userid);
        await AsyncStorage.removeItem("geospark_description");
        that.refs.toast.show("User Logged in Successfully!");
        this.setState({
          isUserCreated: true,
          isFetching: false
        });
      },
      error => {
        that.refs.toast.show("User Logged in Failed!");
        this.setState({
          isFetching: false
        });
      }
    );
  }

  onRequestLocation() {
    Roam.checkLocationPermission(status => {
      if (status == "GRANTED") {
        this.setState({
          isLocationPermission: true
        });
      } else {
        Roam.requestLocationPermission();
      }
    });
  }

  onRequestActivity() {
    Roam.checkLocationServices(status => {
      if (status == "GRANTED") {
        this.setState({
          isMotionService: true
        });
      } else {
        Roam.requestLocationServices();
      }
    });
  }

  onRequestBackgroundPermission() {
    Roam.checkBackgroundLocationPermission(status => {
      if (status == "GRANTED") {
        this.setState({
          isBackgroundPermission: true
        });
      } else {
        Roam.requestBackgroundLocationPermission();
      }
    });
  }

  onRequestMotionORService() {
    const { platforms } = this.state;
    if (platforms === "ios") {
      Roam.checkMotionPermission(async status => {
        console.log(status);
        if (status == "GRANTED") {
          this.setState({
            isMotionService: true
          });
        } else {
          Roam.requestMotionPermission();
        }
      });
    } else {
      Roam.checkLocationServices(async status => {
        console.log(status);
        if (status == "ENABLED") {
          this.setState({
            isMotionService: true
          });
        } else {
          Roam.requestLocationServices();
        }
      });
    }
  }

  onUpdateLocation() {
    const { platforms } = this.state;
    if (platforms === "ios") {
    Roam.updateCurrentLocationIos(100);
    }else{
      Roam.updateCurrentLocation(Roam.DesiredAccuracy.HIGH,100);
    }
  }

  onGetLocation() {
    const { platforms } = this.state;
    if (platforms === "ios") {
    Roam.getCurrentLocationIos(100,
      status => {
        alert(status.latitude + " , " + status.longitude);
      });
    }else{
      Roam.getCurrentLocation(Roam.DesiredAccuracy.HIGH,300,
        status => {
          alert(status.latitude + " , " + status.longitude);
        },error=> {
          alert(error.code + " , " + error.message);
        });
    }
  }

  onStartTraking() {
    let that = this;
    const { platforms } = this.state;
    Roam.publishAndSave(null);
    Roam.checkLocationPermission(async status => {
      console.log(status);
      Roam.publishAndSave(null);
      if (status == "GRANTED") {
        if (platforms == "ios") {
          Roam.startSelfTrackingCustom(true,false,Roam.ActivityType.FITNESS,Roam.DesiredAccuracyIOS.BESTFORNAVIGATION,true,10,40,1);
          await AsyncStorage.setItem("geospark_traking", "yes");
          this.setState({isTrakingStarted: true});
          that.refs.toast.show("Tracking Started Successfully!");
        } else {
          Roam.checkLocationServices(async status => {
            console.log(status);
            if (status == "ENABLED") {
              Roam.startTrackingDistanceInterval(5,120,Roam.DesiredAccuracy.HIGH);
              this.setState({
                isTrakingStarted: true
              });
              await AsyncStorage.setItem("geospark_traking", "yes");
              that.refs.toast.show("Tracking Started Successfully!");
            } else {
              Roam.requestLocationServices();
            }
          });
        }
      } else {
        Roam.requestLocationPermission();
      }
    });
  }

  async onStopTraking() {
    Roam.stopTracking(this);
    this.setState({
      isTrakingStarted: false
    });
    await AsyncStorage.removeItem("geospark_traking");
    this.refs.toast.show("Tracking Stopped Successfully!");
  }

  onLogout() {
    let that = this;
    this.setState({
      isFetching: true
    });
   Roam.logout(
      async success => {
        this.setState({
          isUserCreated: false,
          isTrakingStarted: false,
          isFetching: false,
          userid: null
        });
        await AsyncStorage.removeItem("geospark_userId");
        await AsyncStorage.removeItem("geospark_traking");
        that.refs.toast.show("User Logged out Successfully!");
      },
      error => {
        this.setState({
          isFetching: false
        });
        that.refs.toast.show("User Logged out Failed!");
      });
  }

  createTrip() {
    let that = this;
    this.setState({
      isFetching: true
    });
   Roam.createTrip(false,
      async success => {
        this.setState({isFetching: false});
        that.refs.toast.show("Trip created Successfully!");
      },
      error => {
        this.setState({
          isFetching: false
        });
        that.refs.toast.show("Trip created Failed!");
      });
  }

  static navigationOptions = {
    title: "GeoSpark Example"
  };

  render() {
    const {
      isUserCreated,
      userid,
      description,
      isTrakingStarted,
      isFetching,
      platforms,
      isLocationPermission,
      isActivityPermission,
      isBackgroundPermission,
      isMotionService,
      isBatteryOptimization,
      isMockEnabled
    } = this.state;
    return (
      <View>
        {/* <Header
          // leftComponent={{ text: "GeoSpark Example", style: { color: "#fff" } }}
          centerComponent={{
            text: "GeoSpark Example",
            style: { color: "#fff" }
          }}
          // rightComponent={{ icon: "home", color: "#fff" }}
        /> */}

        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.titleLabel}>User</Text>
            <TextInput
              placeholder="Enter description"
              placeholderTextColor="grey"
              underlineColorAndroid="transparent"
              style={styles.input}
              onChange={this.userDescriptionChange.bind(this)}
              value={description}
            />

            <View>
              <View style={styles.trakingContainer}>
                <View style={styles.trakingButton}>
                  <TouchableHighlight>
                    <Button
                      title="Create User"
                      disabled={isUserCreated}
                      onPress={this.onCreateUser.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
                <View style={styles.trakingButton}>
                  <TouchableHighlight>
                    <Button
                      title="Set Description"
                      disabled={!isUserCreated}
                      onPress={this.onSetDescription.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>

            <View style={styles.loginContainer}>
              <TextInput
                placeholder="Enter userid"
                placeholderTextColor="grey"
                underlineColorAndroid="transparent"
                style={styles.input}
                onChange={this.userIDChange.bind(this)}
                value={this.state.userid}
              />

              {/* <Text>{isUserCreated ? "user" : "no user"}</Text> */}

              <View style={styles.logoutContainer}>
              <TouchableHighlight>
                <Button
                  title="Get User"
                  disabled={isUserCreated}
                  onPress={this.onLoginUser.bind(this)}
                />
              </TouchableHighlight>
            </View>
            </View>

            <View style={styles.permissionContainer}>
              <Text style={styles.titleLabel}>Permission </Text>
              <View style={styles.trakingContainer}>
                <View style={styles.trakingButton}>
                  <TouchableHighlight>
                    <Button
                      title="Request Location"
                      disabled={!isUserCreated || isLocationPermission}
                      onPress={this.onRequestLocation.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
                <View style={styles.trakingButton}>
                  <TouchableHighlight>
                    <Button
                      title="Location services"
                      disabled={!isUserCreated || isActivityPermission}
                      onPress={this.onRequestActivity.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>


            <View style={styles.permissionContainer}>
              <Text style={styles.titleLabel}>Android 10 Permission </Text>
              <View style={styles.trakingContainer}>
                <View style={styles.trakingButton}>
                
                </View>
                <View style={styles.trakingButton}>
                  <TouchableHighlight>
                    <Button
                      title="Background Permission"
                      disabled={!isUserCreated || isBackgroundPermission}
                      onPress={this.onRequestBackgroundPermission.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>

            {isFetching && (
              <View style={[styles.ActivityContainer, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}

            <View style={styles.trackContainer}>
              <Text style={styles.titleLabel}>Tracking </Text>
              <View style={styles.trakingContainer}>
                <View style={styles.trakingButton}>
                  <TouchableHighlight>
                    <Button
                      title="Start Tracking"
                      disabled={!isUserCreated || isTrakingStarted}
                      onPress={this.onStartTraking.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
                <View style={styles.trakingButton}>
                  <TouchableHighlight>
                    <Button
                      title="Stop Tracking"
                      disabled={!isUserCreated || !isTrakingStarted}
                      onPress={this.onStopTraking.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>


            {platforms === "ios" && (
                  <View style={styles.trackContainer}>
                  <Text style={styles.titleLabel}>Location </Text>
                  <View style={styles.trakingContainer}>
                    <View style={styles.trakingButton}>
                      <TouchableHighlight>
                        <Button
                          title="Get Current Location"
                          disabled={!isUserCreated}
                          onPress={this.onGetLocation.bind(this)}
                        />
                      </TouchableHighlight>
                    </View>
                    <View style={styles.trakingButton}>
                      <TouchableHighlight>
                        <Button
                          title="Update Location"
                          disabled={!isUserCreated}
                          onPress={this.onUpdateLocation.bind(this)}
                        />
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
            )}

<View style={styles.logoutContainer}>
              <Text style={styles.titleLabel}>Trip</Text>
                <View style={styles.logoutContainer}>
                  <TouchableHighlight>
                    <Button
                      title="CreateTrip"
                      disabled={!isUserCreated}
                      onPress={this.createTrip.bind(this)}
                    />
                  </TouchableHighlight>
                </View>
            </View>

            <View style={styles.logoutContainer}>
                <View style={styles.logoutContainer}>
                  <TouchableHighlight>
                    <Button
                      title="Start & End Trip"
                      disabled={!isUserCreated}
                      onPress={() => this.props.navigation.navigate("Trip")}
                    />
                  </TouchableHighlight>
                </View>
            </View>

            {platforms !== "ios" && (
              <View style={styles.logoutContainer}>
                <Text style={styles.titleLabel}>Battery Optimization</Text>
                <View style={styles.logoutContainer}>
                  <TouchableHighlight>
                  <Button
                    title={isBatteryOptimization ? "Enable" : "Disable"}
                    disabled="true"
                  />
                  </TouchableHighlight>
                  </View>
              </View>
            )}

              <View style={styles.logoutContainer}>
                <Text style={styles.titleLabel}>Logout</Text>
                  <View style={styles.logoutContainer}>
                    <TouchableHighlight>
                    <Button
                    title="Logout"
                    disabled={!isUserCreated}
                    onPress={this.onLogout.bind(this)}
                    />
                    </TouchableHighlight>
                </View>
              </View>        
              <Toast ref="toast" />
            </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  ActivityContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    zIndex: 1
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1
    // padding: 10
  },
  trakingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  trakingButton: {
    width: width * 0.45,
    height: 50
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    padding: 5
  },
  permissionContainer: {
    marginTop: 5
  },
  input: {
    padding: 8,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    paddingBottom: 10,
    margin: 10
  },
  logoutContainer: {
    flex: 1,
    marginTop: 5,
    marginLeft:2.5,
    marginRight:2.5,
    marginBottom:5,
    justifyContent: "space-around"
  }
});

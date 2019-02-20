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
  AsyncStorage
} from "react-native";
import GeoSpark from "react-native-geospark";
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
      isMotionService: false
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

    GeoSpark.checkLocationPermission(
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
      GeoSpark.checkMotionPermission(
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
      GeoSpark.checkLocationServices(
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
    GeoSpark.createUser(
      this.state.description,
      async success => {
        this.setState({
          isUserCreated: true,
          isFetching: false
        });

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
    let that = this;
    this.setState({
      isFetching: true
    });
    GeoSpark.setDescription(
      description,
      async success => {
        console.log(success);
        await AsyncStorage.setItem("geospark_description", description);
        that.refs.toast.show("User Updated Successfully!");
        this.setState({
          isFetching: false
        });
      },
      error => {
        that.refs.toast.show("User Updated Failed!");
        this.setState({
          isFetching: false
        });
      }
    );
  }

  onLoginUser() {
    const { userid } = this.state;
    let that = this;
    this.setState({
      isFetching: true
    });
    GeoSpark.getUser(
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
    GeoSpark.checkLocationPermission(status => {
      if (status == "GRANTED") {
        this.setState({
          isLocationPermission: true
        });
      } else {
        GeoSpark.requestLocationPermission();
      }
    });
  }

  onRequestMotionORService() {
    const { platforms } = this.state;
    if (platforms === "ios") {
      GeoSpark.checkMotionPermission(async status => {
        console.log(status);

        if (status == "GRANTED") {
          this.setState({
            isMotionService: true
          });
        } else {
          GeoSpark.requestMotionPermission();
        }
      });
    } else {
      GeoSpark.checkLocationServices(async status => {
        console.log(status);

        if (status == "ENABLED") {
          this.setState({
            isMotionService: true
          });
        } else {
          GeoSpark.requestLocationServices();
        }
      });
    }
  }

  onStartTraking() {
    let that = this;
    const { platforms } = this.state;
    GeoSpark.checkLocationPermission(status => {
      console.log(status);
      if (status == "GRANTED") {
        if (platforms === "ios") {
          GeoSpark.checkMotionPermission(async status => {
            console.log(status);

            if (status == "GRANTED") {
              GeoSpark.startTracking(this);
              await AsyncStorage.setItem("geospark_traking", "yes");
              this.setState({
                isTrakingStarted: true
              });
              that.refs.toast.show("Tracking Started Successfully!");
            } else {
              GeoSpark.requestMotionPermission();
            }
          });
        } else {
          GeoSpark.checkLocationServices(async status => {
            console.log(status);

            if (status == "ENABLED") {
              GeoSpark.startTracking(this);
              this.setState({
                isTrakingStarted: true
              });
              await AsyncStorage.setItem("geospark_traking", "yes");
              that.refs.toast.show("Tracking Started Successfully!");
            } else {
              GeoSpark.requestLocationServices();
            }
          });
        }
      } else {
        GeoSpark.requestLocationPermission();
      }
    });
  }

  async onStopTraking() {
    GeoSpark.stopTracking(this);
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
    GeoSpark.logout(
      async success => {
        this.setState({
          isUserCreated: false,
          isFetching: false
        });
        await AsyncStorage.removeItem("geospark_userId");
        that.refs.toast.show("User Logged out Successfully!");
      },
      error => {
        this.setState({
          isFetching: false
        });
        that.refs.toast.show("User Logged out Failed!");
      }
    );
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
      isMotionService
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

        <View style={styles.container}>
          {/* <Text style={styles.titleLabel}>OAuth & User </Text> */}
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

            <TouchableHighlight>
              <Button
                title="Log In"
                disabled={isUserCreated}
                onPress={this.onLoginUser.bind(this)}
              />
            </TouchableHighlight>
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
                    title={
                      platforms === "ios" ? "Request Motion" : "Request Service"
                    }
                    disabled={!isUserCreated || isMotionService}
                    onPress={this.onRequestMotionORService.bind(this)}
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

          <View style={styles.tripContainer}>
            <Text style={styles.titleLabel}>Trip & Geofence </Text>
            <View style={styles.trakingContainer}>
              <View style={styles.trakingButton}>
                <TouchableHighlight>
                  <Button
                    title="Trip"
                    disabled={!isUserCreated}
                    onPress={() => this.props.navigation.navigate("Trip")}
                  />
                </TouchableHighlight>
              </View>
              <View style={styles.trakingButton}>
                <TouchableHighlight>
                  <Button title="Geofence" disabled={true} />
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={styles.logoutContainer}>
            <TouchableHighlight>
              <Button
                title="Logout"
                disabled={!isUserCreated}
                onPress={this.onLogout.bind(this)}
              />
            </TouchableHighlight>
          </View>
          <Toast ref="toast" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  loginContainer: {
    marginTop: 45
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
  trackContainer: {
    marginTop: 45
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
  tripContainer: {
    marginTop: 45
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
    marginTop: 75
  }
});

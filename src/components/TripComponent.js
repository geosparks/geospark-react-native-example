import React, { Component } from "react";
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
  FlatList,
  ActivityIndicator,
  ScrollView
} from "react-native";
import GeoSpark from "react-native-geospark";
// import GeoSpark from "react-native-geospark";
import Toast, { DURATION } from "react-native-easy-toast";
import { Header, Button, Input, Card, Divider } from "react-native-elements";

const { width, height } = Dimensions.get("window");
export default class Trip extends Component {
  static navigationOptions = {
    title: "Trip Details"
  };

  constructor(props) {
    super(props);
    this.state = {
      description: null,
      trips: null,
      isFetching: false,
      isActiveTrip: false
    };
    this.onEndTrip = this.onEndTrip.bind(this);
    // this.onGetActiveTrips = this.onGetActiveTrips.bind(this);
  }

  userDescriptionChange(e) {
    this.setState({
      description: e.nativeEvent.text
    });
  }

  onStartTrip() {
    let that = this;
    console.log("start trip");
    this.setState({
      isFetching: true
    });
    GeoSpark.startTrip(
      this.state.description,
      success => {
        console.log(success);
        this.setState({
          isFetching: false,
          isActiveTrip: false,
          trips: null
        });
        that.refs.toast.show("Trip Created Successfully!");
      },
      error => {
        console.log(error);
        this.setState({
          isFetching: false
        });
        that.refs.toast.show("Trip Failed!! Please Start Traking!");
        // do something on error
      }
    );
  }

  onGetActiveTrips() {
    let that = this;
    console.log("active trips");
    this.setState({
      isFetching: true
    });
    GeoSpark.activeTrips(
      success => {
        console.log(success.activeTrips);
        this.setState({
          trips: success.activeTrips,
          isFetching: false,
          isActiveTrip: true
        });
        that.refs.toast.show("Trips Loaded Successfully!");
      },
      error => {
        console.log(error);
        this.setState({
          isFetching: false
        });
        that.refs.toast.show("Trips Loaded Failed!");
      }
    );
  }

  onEndTrip(tripId) {
    let that = this;
    console.log("end trips");
    this.setState({
      isFetching: true
    });
    GeoSpark.endTrip(
      tripId,
      success => {
        console.log(success);
        this.onGetActiveTrips();
        that.refs.toast.show("Trip Ended Successfully!");
      },
      error => {
        console.log(error);
        this.setState({
          isFetching: false
        });
        that.refs.toast.show("Trip Ended Failed!");
      }
    );
  }

  render() {
    const { description, trips, isFetching, isActiveTrip } = this.state;
    let trip_keys = null,
      trip_data = [];
    if (trips) {
      trip_keys = Object.keys(trips);
      trip_keys.map(key => trip_data.push(trips[key]));
    }
    return (
      <View>
        <View style={styles.container}>
          <TextInput
            placeholder="Enter description"
            placeholderTextColor="grey"
            underlineColorAndroid="transparent"
            style={styles.input}
            onChange={this.userDescriptionChange.bind(this)}
            value={description}
          />

          <View style={styles.tripContainer}>
            <View style={styles.trakingContainer}>
              <View style={styles.trakingButton}>
                <TouchableHighlight>
                  <Button
                    title="Start Trip"
                    onPress={this.onStartTrip.bind(this)}
                  />
                </TouchableHighlight>
              </View>
              <View style={styles.trakingButton}>
                <TouchableHighlight>
                  <Button
                    title="Active Trips"
                    disabled={isActiveTrip}
                    onPress={this.onGetActiveTrips.bind(this)}
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

          <ScrollView style={styles.contentContainer}>
            <View style={styles.TripsListContainer}>
              {trip_keys && (
                <FlatList
                  data={trip_data}
                  renderItem={({ item }) => (
                    <View key={item.tripStartedAt} style={styles.trip}>
                      <View>
                        <Text>{item.tripStartedAt}</Text>
                        <Text>{item.tripId}</Text>
                      </View>
                      <View style={styles.button}>
                        <TouchableHighlight>
                          <Button
                            title="Stop Trip"
                            onPress={() => this.onEndTrip(item.tripId)}
                          />
                        </TouchableHighlight>
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
          </ScrollView>
          <Toast ref="toast" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5
    // backgroundColor: "#f2f2f2"
  },
  trakingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  ActivityContainer: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "#f2f2f2",
    zIndex: 1
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1
    // padding: 10
  },
  trakingButton: {
    width: width * 0.45,
    height: 50
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  },
  tripContainer: {
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
  // TripsListContainer: {
  //   marginTop: 55
  //   // height: 200
  // },
  trip: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    // width: width * 0.9,

    backgroundColor: "#f2f2f2",
    // paddingTop: 10,
    padding: 5,
    marginTop: 5,
    borderColor: "black",
    borderWidth: 1
    // marginTop: 10
  },
  tripInner: {
    margin: 15,
    height: height * 0.1
  },
  button: {
    marginLeft: 30,
    width: width * 0.3,
    height: 35
  },
  contentContainer: {
    marginTop: 55,
    maxHeight: height * 0.6
  }
});

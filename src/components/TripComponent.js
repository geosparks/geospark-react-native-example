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
import GeoSpark from "react-native-geospark-test";
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

  componentWillMount() {
    this.onGetActiveTrips();
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

  userDescriptionChange(e) {
    this.setState({
      description: e.nativeEvent.text
    });
  }

  onStartTrip(tripId) {
    let that = this;
    console.log("start trip");
    this.setState({
      isFetching: true
    });
    GeoSpark.startTrip(
      tripId,
      null,
      success => {
        console.log(success);
        this.setState({
          isFetching: false,
          isActiveTrip: false,
          trips: null
        });
        this.onGetActiveTrips();
        that.refs.toast.show("Trip Started Successfully!");
      },
      error => {
        console.log(error);
        this.setState({
          isFetching: false
        });
        that.refs.toast.show("Trip Failed!! Please Start Traking!");
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

    console.log(trip_data);
    return (
      <View>
        <View style={styles.container}>
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
                        <Text style={styles.itemText}>TripId: {item.tripId}</Text> 
                        <Text style={styles.itemText}>{item.createdAt}</Text>
                      </View>
                      <View style={styles.button}>
                        <TouchableHighlight>
                          {!item.isStarted ? (
                            <Button
                              title="Start Trip"
                              onPress={() => this.onStartTrip(item.tripId)}
                            />
                          ) : (
                            <Button
                              title="Stop Trip"
                              onPress={() => this.onEndTrip(item.tripId)}
                            />
                          )}
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
  },
  trakingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  ActivityContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: "center",
    zIndex: 1
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1
  },
  trakingButton: {
    height: 50
  },
  titleLabel: {
    fontSize: 1,
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
  trip: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // width: width * 0.9,
    backgroundColor: "#f2f2f2",
    paddingTop:10,
    paddingStart:6,
    paddingEnd:6,
    paddingBottom:5,
    marginTop: 10,
    borderColor: "black",
    borderWidth: 0.5
  },
  itemText: {
    fontSize: 14,
    color: "black",
    marginBottom:5
  },
  tripInner: {
    margin: 5,
    height: height * 0.1
  },
  button: {
    marginLeft: 10,
    width: width * 0.3,
    height: 35
  },
  contentContainer: {
    marginTop: 30,
    maxHeight: height * 0.6
  }
});

import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./components/HomeComponent";
import TripScreen from "./components/TripComponent";

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Text>Home Screen</Text>
//       </View>
//     );
//   }
// }

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Trip: TripScreen
  },
  {
    initialRouteName: "Home"
  }
);

console.disableYellowBox = true;

export default createAppContainer(AppNavigator);

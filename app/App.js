import React, { Component } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing, Text } from 'react-native';
import GeolocationProvider from './utils/GeolocationProvider';
import { createStackNavigator } from 'react-navigation';
import Map from './components/Map';
import { HeaderBackButton } from 'react-navigation';
import { STEPS } from './Constants';
import DimmedModal from './components/DimmedModal';

class App extends Component {

  static navigationOptions = ({ navigation }) => {
    const currentStep = navigation.getParam('currentStep', STEPS.SET_ANCHOR_LOCATION)
    let headerConfig = {
      title: currentStep.title
    }

    if(currentStep.previous) {
      headerConfig.headerLeft = <HeaderBackButton onPress={() => {
        navigation.setParams({'currentStep': currentStep.previous})
      }} />
    }

    return headerConfig
  }

  constructor(props) {
    super(props);

    this.state = {
      locationHistory: [],
      anchorLocation: null,
      safetyRadius: 20,
      currentLocation: null,
      currentMapCenter: null
    }

    this.handleMapCenterChange = this.handleMapCenterChange.bind(this);
  }

  initGeolocationProvider() {
    GeolocationProvider.init();
    GeolocationProvider.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      // const lnglat = {
      //   longitude: location.longitude, 
      //   latitude: location.latitude
      // }

      // // TODO if location.accuracy > ?? m blabla
      // // END TODO
      // // console.log(lnglat);

      // this.setState({
      //   locationHistory: this.state.locationHistory.concat([lnglat]),
      //   currentLocation: lnglat
      // })
    })
  }

  componentDidMount() {
    this.initGeolocationProvider();
  }

  componentWillUnmount() {
    // unregister all event listeners
    GeolocationProvider.clean();
  }

  handleMapCenterChange(region) {
    this.setState({
      currentMapCenter: {
        latitude: region.latitude,
        longitude: region.longitude
      }
    });
  }

  render() {

    const currentStep = this.props.navigation.getParam('currentStep', STEPS.SET_ANCHOR_LOCATION)

    return (
      <View style={styles.container}>
        {!this.state.currentLocation &&
          <DimmedModal>
            <View style={{
                width: '90%',
                borderColor: '#ccc',
                borderWidth: 1,
                borderStyle: 'solid',
                backgroundColor: 'white',
                elevation: 20,
                padding: 10,
                borderRadius: 4
            }}>
                <Text>Hello, This is my model with dim background color djdjdjdj</Text>
            </View>
          </DimmedModal>
        }
        {this.state.currentLocation &&
          <Map 
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            locationHistory={this.state.locationHistory}
            currentStep={currentStep}
            currentLocation={this.state.currentLocation}
            currentMapCenter={this.state.currentMapCenter}
            anchorLocation={this.state.anchorLocation}
            safetyRadius={this.state.safetyRadius}
            handleMapCenterChange={this.handleMapCenterChange}
          />
        }
        {STEPS.enumValueOf(currentStep.name) === STEPS.SET_ANCHOR_LOCATION &&
          <Button
            title={currentStep.ctaLabel}
            onPress={() => {
              this.setState({
                anchorLocation: this.state.currentMapCenter
              })
              this.props.navigation.setParams({ currentStep: currentStep.next });
            }}
          />
        }
        {STEPS.enumValueOf(currentStep.name) === STEPS.SET_RADIUS &&
          <Button
            title={currentStep.ctaLabel}
            onPress={() => this.props.navigation.setParams({ currentStep: currentStep.next })}
          />
        }
        {STEPS.enumValueOf(currentStep.name) === STEPS.MONITOR &&
          <Button
            title={currentStep.ctaLabel}
            onPress={() => this.props.navigation.setParams({ currentStep: currentStep.stop })}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: App,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
    // transitionConfig : () => ({
    //   transitionSpec: {
    //     duration: 0,
    //     timing: Animated.timing,
    //     easing: Easing.step0,
    //   },
    // })
  }
);

export default class Main extends React.Component {
  render() {
    return <RootStack />;
  }
}

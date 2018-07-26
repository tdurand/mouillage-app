import React, { Component } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing } from 'react-native';
import GeolocationProvider from './utils/GeolocationProvider';
import { createStackNavigator } from 'react-navigation';
import { Enum } from 'enumify';
import Map from './components/Map';
import {
  HeaderBackButton
} from 'react-navigation';


class STEPS extends Enum {}
STEPS.initEnum({
  SET_ANCHOR_LOCATION: {
    get title() { return "Anchor location" },
    get ctaLabel() { return "Set anchor position"},
    get next() { return STEPS.SET_RADIUS }
  },
  SET_RADIUS: {
    get title() { return "Adjust radius" },
    get ctaLabel() { return "Start alarm"},
    get next() { return STEPS.MONITOR },
    get previous() { return STEPS.SET_ANCHOR_LOCATION }
  },
  MONITOR: {
    get title() { return "Watching anchor" },
    get ctaLabel() { return "Stop monitoring"},
    get stop() { return STEPS.SET_ANCHOR_LOCATION }
  }
});

class App extends Component {

  static navigationOptions = ({ navigation }) => {
    const currentStep = navigation.getParam('currentStep', STEPS.SET_ANCHOR_LOCATION)
    console.log(currentStep);
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
      trackingHistory: [],
      currentPosition: {
        latitude: null,
        longitude: null
      }
    }
  }

  initGeolocationProvider() {
    GeolocationProvider.init();
    GeolocationProvider.on('location', (location) => {
      console.log(JSON.stringify(location));
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      const lnglat = {
        longitude: location.longitude, 
        latitude: location.latitude
      }

      // TODO if location.accuracy > ?? m blabla
      // END TODO
      // console.log(lnglat);

      this.setState({
        trackingHistory: this.state.trackingHistory.concat([lnglat]),
        currentPosition: lnglat
      })
    })
  }

  componentDidMount() {
    this.initGeolocationProvider();
  }

  componentWillUnmount() {
    // unregister all event listeners
    GeolocationProvider.clean();
  }

  render() {

    const currentStep = this.props.navigation.getParam('currentStep', STEPS.SET_ANCHOR_LOCATION)
    console.log(STEPS.enumValueOf(currentStep.name));

    return (
      <View style={styles.container}>
        <Map trackingHistory={this.state.trackingHistory} />
        {STEPS.enumValueOf(currentStep.name) === STEPS.SET_ANCHOR_LOCATION &&
          <Button
            title={currentStep.ctaLabel}
            onPress={() => this.props.navigation.setParams({ currentStep: currentStep.next })}
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

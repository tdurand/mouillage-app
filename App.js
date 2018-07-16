import React, { Component } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing } from 'react-native';
import MapView, { Polyline, Circle, Marker } from 'react-native-maps';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { createStackNavigator } from 'react-navigation';
import Map from './Map';

import boatIcon from './assets/boat.png';
import anchorIcon from './assets/anchor2.png';

const style = {
  width: 30,
  height: 43.8,
  transform: [
    { rotate: `30deg` }
  ]
}

class App extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Anchor positionning'),
    }
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

  initBackgroundGeolocation() {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 1,
      distanceFilter: 1,
      notificationTitle: 'Mouillage app location tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 5000,
      fastestInterval: 5000,
      activitiesInterval: 5000,
      stopOnStillActivity: false
    });

    BackgroundGeolocation.on('location', (location) => {
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

      // BackgroundGeolocation.startTask(taskKey => {
      //   // execute long running task
      //   // eg. ajax post location
      //   // IMPORTANT: task has to be ended by endTask
      //   BackgroundGeolocation.endTask(taskKey);
      // });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      console.log(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }

      // you can also just start without checking for status
      // BackgroundGeolocation.start();
    });

  }

  componentDidMount() {
    this.initBackgroundGeolocation();
  }

  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
  }

  renderTrackingHistory () {

    // if(this.state.trackingHistory.length < 2) {
    //   return;
    // }

    // var geojsonLine = { "type": "LineString", "coordinates": this.state.trackingHistory }

    // return (
    //   <Mapbox.ShapeSource 
    //     id='trackingHistory' 
    //     shape={geojsonLine}
    //   >
    //     <Mapbox.LineLayer id='trackingHistoryFill' style={layerStyles.trackingHistory} />
    //   </Mapbox.ShapeSource>
    // )
  }

  render() {

    const anchorDropped = this.props.navigation.getParam("anchorDropped", false);

    // console.log(this.state.trackingHistory);
    return (
      <View style={styles.container}>
        <Map />
        {!anchorDropped &&
          <Button
            title="Set anchor position"
            onPress={() => this.props.navigation.push('Home', {anchorDropped: true, title: 'Radius'})}
          />
        }
        {anchorDropped &&
          <Button
            title="Start alarm"
            onPress={() => this.props.navigation.push('Home', {anchorDropped: true, radiusSet: true, title: 'Alarm working'})}
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
    transitionConfig : () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0,
      },
    })
  }
);

export default class Main extends React.Component {
  render() {
    return <RootStack />;
  }
}

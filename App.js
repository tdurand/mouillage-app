import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

export default class App extends Component {

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
      debug: true,
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
    // console.log(this.state.trackingHistory);
    return (
      <View style={styles.container}>
        <MapView
          region={{
            latitude: this.state.currentPosition.latitude || 37.78825,
            longitude: this.state.currentPosition.longitude || -122.4324,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          style={styles.map}
        >
          <Polyline
            coordinates={this.state.trackingHistory}
            strokeColor="#000"
            strokeWidth={5}
          />
        </MapView>
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

import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import EventEmitter from 'event-emitter-es6';

class GeolocationProvider extends EventEmitter {

  init() {
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
      // Bubble up location event
      /** Structure
       *  {
            "speed": 3.65,
            "longitude": -122.02906734,
            "time": 1532597952662.259,
            "bearing": 115.04,
            "latitude": 37.33069279,
            "accuracy": 10,
            "heading": 115.04,
            "altitude": 0,
            "altitudeAccuracy": -1
          }
       */
      this.emit("location", location);
      console.log(location);
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      console.log(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      alert('[ERROR] BackgroundGeolocation error:', error);
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

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      BackgroundGeolocation.getCurrentLocation((location) => {
        console.log('Got initial location')
        console.log(location)
        resolve(location);
      }, (code, message) => {
        console.log('Error while getting initial location')
        console.log(message)
        reject(message);
      }, { enableHighAccuracy : true, timeout: 5000 })
    })
  }

  clean() {
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
  }
}

const GeolocationProviderSingleton = new GeolocationProvider();

export default GeolocationProviderSingleton; 

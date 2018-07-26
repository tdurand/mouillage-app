import React, { Component } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing } from 'react-native';
import GeolocationProvider from './app/utils/GeolocationProvider';
import { createStackNavigator } from 'react-navigation';
import Map from './Map';
import {
  HeaderBackButton
} from 'react-navigation'

const style = {
  width: 30,
  height: 43.8,
  transform: [
    { rotate: `30deg` }
  ]
}

class App extends Component {

  static navigationOptions = ({ navigation }) => {
    const anchorDropped = navigation.getParam('anchorDropped', false)
    const alarmStarted = navigation.getParam('alarmStarted', false)

    let headerConfig = {
      title: navigation.getParam('title', 'Anchor positionning')
    }

    if(anchorDropped && !alarmStarted) {
      headerConfig.headerLeft = <HeaderBackButton onPress={() => {
        navigation.setParams({'anchorDropped': false})
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

    const anchorDropped = this.props.navigation.getParam('anchorDropped', false)
    const alarmStarted = this.props.navigation.getParam('alarmStarted', false)

    // console.log(this.state.trackingHistory);
    return (
      <View style={styles.container}>
        <Map />
        {!anchorDropped &&
          <Button
            title="Set anchor position"
            onPress={() => this.props.navigation.setParams({ anchorDropped: true, title: 'Adjust radius' })}
          />
        }
        {anchorDropped && !alarmStarted &&
          <Button
            title="Start alarm"
            onPress={() => this.props.navigation.setParams({anchorDropped: true, alarmStarted: true, title: 'Watching anchor'})}
          />
        }
        {anchorDropped && alarmStarted &&
          <Button
            title="Stop monitoring"
            onPress={() => this.props.navigation.setParams({anchorDropped: true, alarmStarted: false, title: 'Confirm settings'})}
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

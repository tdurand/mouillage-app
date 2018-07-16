import MapView, { Polyline, Circle, Marker } from 'react-native-maps';
import React, { PureComponent } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing } from 'react-native';

import anchorIcon from './assets/anchor2.png';

const style = {
  width: 30,
  height: 43.8,
  transform: [
    { rotate: `30deg` }
  ]
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default class Map extends PureComponent {

  componentDidMount() {
    console.log('Mounting map')
  }

  componentWillUnmount() {
    console.log('Unmounting map')
  }

  render() {

    return (
      <MapView
        key="test"
        loadingEnabled
        // loadingBackgroundColor="transparent"
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        showsCompass={true}
        style={styles.map}
      >
        {/* <Polyline
          coordinates={this.state.trackingHistory}
          strokeColor="#000"
          strokeWidth={5}
        /> */}
        <Circle 
          radius={30}
          strokeWidth={3}
          strokeColor="red"
          center={{
            latitude: 37.78825,
            longitude: -122.4324
          }}
        />
        {/* <Marker 
          title="Boat"
          image={boatIcon}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324
          }}
        /> */}
        <MapView.Marker
          key='anchor-marker'
          anchor={{ x: 0.5, y: 0.5 }}
          // zIndex={this.props.zIndex}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324
          }}
        >
          <Animated.Image ref='image' style={style} source={anchorIcon} />
        </MapView.Marker>
      </MapView>
    );
  }
}


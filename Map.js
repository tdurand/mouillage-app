import MapView, { Polyline, Circle, Marker } from 'react-native-maps';
import React, { PureComponent } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing } from 'react-native';
import { Svg, Image, G, Rect } from 'react-native-svg';

import anchorIcon from './assets/anchor2-debug.png';

// const style = {
//   transform: [
//     { rotate: `90deg` }
//   ]
// }

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

    
    const imgWidth = 15;
    // Where 44 is the original height and 30 the original width
    const imgHeight = (44 * imgWidth) / 30;

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
        {/* <MapView.Marker
          key='anchor-marker'
          anchor={{ x: 0.5, y: 0.5 }}
          // zIndex={this.props.zIndex}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324
          }}
        >
          <Animated.Image ref='image' style={style} source={anchorIcon} />
        </MapView.Marker> */}
        <Marker
          key='anchor-marker2'
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324
          }}
        />
        <Marker
          key='anchor-marker'
          anchor={{ x: 0.5, y: 0.5 }}
          centerOffset={{ x: 0, y: 0 }}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324
          }}
        >
          {/* //7 15 15 */}
          <View>
            <Svg 
              width={imgHeight*2} 
              height={imgHeight*2} 
            > 
              <G
                x="0"
                y="0"
                rotation="210"
                origin={`${imgHeight},${imgHeight}`} 
              >
                <Rect
                  x="0"
                  y="0"
                  height={imgHeight * 2} 
                  width={imgHeight * 2} 
                  stroke="#060"
                  fill="transparent"
                />
                <Image
                  x={imgHeight - imgWidth/2}
                  width={imgWidth}
                  height={imgHeight}
                  href={anchorIcon} 
                />
              </G>
            </Svg>
          </View>
        </Marker>
      </MapView>
    );
  }
}


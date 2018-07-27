import MapView, { Polyline, Circle, Marker } from 'react-native-maps';
import React, { PureComponent } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing } from 'react-native';
import { Svg, Image, G, Rect } from 'react-native-svg';
import { STEPS } from '../Constants';
import throttle from 'lodash.throttle';

import anchorIcon from '../../assets/anchor2.png';

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default class Map extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      userDragged: false
    }

    this.fitsToCoordinatesThrottled = throttle(this.fitsToCoordinates, 1500)
  }


  mapReady() {
    console.log(this.map);
    // debugger;
  }

  componentDidUpdate(prevProps, prevState) {
    if(!this.state.userDragged) {
      this.fitsToCoordinatesThrottled();
    }
    
  }

  fitsToCoordinates() {
    if(this.map &&
      this.props.locationHistory.length > 0 && 
      !this.state.userDragged) {
      this.map.fitToCoordinates(this.props.locationHistory, 
        { 
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 80,
            left: 50
          }, 
          animated: true
        }
      )
    }
  }

  componentWillUnmount() {
    console.log('Unmounting map')
  }


  renderTrackingHistory () {

    // TODO MOVE in its own component

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

    
    const imgWidth = 20;
    // Where 44 is the original height and 30 the original width
    const imgHeight = (44 * imgWidth) / 30;

    return (
      <MapView
        ref={(map) => this.map = map}
        key="test"
        loadingEnabled
        // loadingBackgroundColor="transparent"
        initialRegion={this.props.initialRegion}
        showsCompass={true}
        style={styles.map}
        onRegionChange={this.props.handleMapCenterChange}
        onMapReady={() => this.mapReady()}
        onMoveShouldSetResponder={() => {
          this.setState({userDragged: true})
          console.log('userDragged');
        }}
        rotateEnabled={false}
      >
        <Polyline
          coordinates={this.props.locationHistory}
          strokeColor="#000"
          strokeWidth={2}
        />
        {STEPS.enumValueOf(this.props.currentStep.name) === STEPS.SET_ANCHOR_LOCATION && 
         this.props.currentMapCenter &&
          <MapView.Marker.Animated
            key='anchor-marker2'
            pinColor="blue"
            coordinate={this.props.currentMapCenter}
          />
        }
        {STEPS.enumValueOf(this.props.currentStep.name) === STEPS.SET_RADIUS &&
          <>
            <Circle 
              radius={30}
              strokeWidth={3}
              strokeColor="red"
              center={this.props.anchorLocation}
            />  
            <Marker
              key='anchor-marker'
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0, y: 0 }}
              coordinate={this.props.anchorLocation}
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
                    {/* Debugging Rect */}
                    {/* <Rect
                      x="0"
                      y="0"
                      height={imgHeight * 2} 
                      width={imgHeight * 2} 
                      stroke="#060"
                      fill="transparent"
                    /> */}
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
          </>
        }
      </MapView>
    );
  }
}


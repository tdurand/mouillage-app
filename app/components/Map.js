import MapView, { Polyline, Circle, Marker } from 'react-native-maps';
import React, { PureComponent } from 'react';
import { StyleSheet, View, Alert, Animated, Button, Easing } from 'react-native';

import { STEPS } from '../Constants';
import throttle from 'lodash.throttle';
import CustomMarker from './CustomMarker';

import anchorIcon from '../../assets/anchor2.png';
import boatIcon from '../../assets/boat.png';


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
    // console.log(this.map);
    // debugger;
  }

  componentDidUpdate(prevProps, prevState) {
    if(!this.state.userDragged) {
      this.fitsToCoordinatesThrottled();
    }

    if(prevProps.currentLocation === null && 
       this.props.currentLocation !== null) {
      // console.log('Animate to first GPS fix')
      this.map.animateToCoordinate(this.props.currentLocation)
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
    // console.log('Unmounting map')
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
          // console.log('userDragged');
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
            pinColor="blue"
            coordinate={this.props.currentMapCenter}
          />
        }
        {this.props.currentLocation &&
          <CustomMarker 
            rotation={this.props.currentLocation.bearing}
            location={this.props.currentLocation}
            icon={boatIcon}
            width={20}
            originalWidth={96}
            originalHeight={124}
          />
        }
        {(STEPS.enumValueOf(this.props.currentStep.name) === STEPS.SET_RADIUS ||
          STEPS.enumValueOf(this.props.currentStep.name) === STEPS.MONITOR) &&
          <>
            <Circle 
              radius={this.props.safetyRadius}
              strokeWidth={3}
              strokeColor="blue"
              center={this.props.anchorLocation}
            />  
            <CustomMarker 
              rotation={0}
              location={this.props.anchorLocation}
              icon={anchorIcon}
              width={20}
              originalWidth={30}
              originalHeight={44}
            />
          </>
        }
      </MapView>
    );
  }
}


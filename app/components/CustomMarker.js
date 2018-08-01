import React from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Svg, Image, G, Rect } from 'react-native-svg';
/**
 *  Props:
 *
 *  rotation={210}
    location={this.props.anchorLocation}
    icon={anchorIcon}
    width={20}
    originalHeight={44}
    originalWidth={30}
 */

export default class CustomMarker extends React.Component {

  render() {
    
    const imgHeight = (this.props.originalHeight * this.props.width) / this.props.originalWidth;
    const imgWidth = this.props.width;

    return (
      <Marker
        anchor={{ x: 0.5, y: 0.5 }}
        centerOffset={{ x: 0, y: 0 }}
        coordinate={this.props.location}
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
              rotation={this.props.rotation}
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
                href={this.props.icon} 
              />
            </G>
          </Svg>
        </View>
      </Marker>
    )
  }}

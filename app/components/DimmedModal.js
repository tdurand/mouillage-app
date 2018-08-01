import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View} from 'react-native';

export default class DimmedModal extends React.Component {

  render() {
      return (
          <Modal 
              animationType="fade"
              transparent={true}
              visible={this.props.visible}
              >
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                      {this.props.children}
                  </View>
          </Modal>
      )
  }}

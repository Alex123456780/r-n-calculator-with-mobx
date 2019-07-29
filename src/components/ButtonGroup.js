import React, {
  PureComponent
} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

export default class ButtonGroup extends PureComponent {
  render() {
    return (
      <View style={styles.row}>
        {this.props.children}
      </View>
    );
  }
}
import React, {
  PureComponent
} from 'react';
import {
  View,
  ViewPropTypes,
  Text,
  // TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { emptyFunc } from './../lib/util';

export default class SimpleButton extends PureComponent {
  static propTypes = {
    viewStyles: ViewPropTypes.style,
    textStyles: Text.propTypes.style,
    text: PropTypes.string,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    viewStyles: {},
    textStyles: {},
    text: '',
    onPress: emptyFunc,
  }

  render() {
    const {
      viewStyles,
      textStyles,
      text,
      onPress,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={viewStyles}
      >
        <View>
          <Text style={textStyles}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
    // Same but with TouchableWithoutFeedback:
    // <TouchableWithoutFeedback
    //     onPress={onPress}
    //   >
    //     <View style={viewStyles}>
    //       <Text style={textStyles}>{text}</Text>
    //     </View>
    //   </TouchableWithoutFeedback>
  }
};
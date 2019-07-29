import React, {
  PureComponent
} from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  textValue: {
    textAlign: "right",
    marginRight: 20,
    marginBottom: 10
  }
});

export default class TextPanel extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    fontSize: PropTypes.number,
    // value: PropTypes.oneOfType([
    //   PropTypes.number,
    //   PropTypes.string
    // ]),
    // allowEmpty: PropTypes.bool
    // value: PropTypes.string
  }

  static defaultProps = {
    color: '#fff',
    fontSize: 40,
    value: '',
    // allowEmpty: false
  }

  // adjustsFontSizeToFit - works iOS only
  // https://medium.com/@vygaio/how-to-auto-adjust-text-font-size-to-fit-into-a-nodes-width-in-react-native-9f7d1d68305b
  // Android hacks:
  // https://github.com/facebook/react-native/issues/20906 - issue
  // https://facebook.github.io/react-native/docs/text#onlayout - get width and height
  // http://qaru.site/questions/7001037/are-there-any-alternatives-to-adjustsfontsizetofit-for-android - use formula
  render() {
    const {
      color,
      fontSize,
      value,
    } = this.props;
    return (
      <View>
        <Text
          style={[styles.textValue, {color, fontSize}]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
      </View>
    );
  }
}
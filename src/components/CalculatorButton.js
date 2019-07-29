import React, {
  PureComponent
} from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { SimpleButton } from './';
import { emptyFunc } from './../lib/util';
import {
  THEME,
  COMMAND
} from './../lib/constants';

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 25
  },
  textSecondary: {
    color: "#060606"
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  buttonDouble: {
    flex: 0,
    alignItems: "flex-start",
    paddingLeft: 40
  },
  buttonFirst: {
    backgroundColor: "#333333",
  },
  buttonSecondary: {
    backgroundColor: "#a6a6a6"
  },
  buttonAccent: {
    backgroundColor: "#f09a36"
  }
});

function getButtonStyleByWidth(button_width) {
  return {
    height: Math.floor(button_width - 10),
    borderRadius: Math.floor(button_width / 2),
    width: Math.floor(button_width - 10),
  }
}

function getButtonStyleBySize(size, button_width) {
  let buttonStyles = {};
    if (size > 1) {
      buttonStyles = {
        ...styles.buttonDouble,
        width: button_width * size - 10,
    };
  }
  return buttonStyles;
}

function getStyleByTheme(theme) {
  let buttonStyles = {};
  let textStyles = {};
  switch (theme) {
    case THEME.DIGIT:
      buttonStyles = styles.buttonFirst;
      break;
    case THEME.SECONDARY_OP:
      buttonStyles = styles.buttonSecondary;
      textStyles = styles.textSecondary;
      break;
    case THEME.MAIN_OP:
      buttonStyles = styles.buttonAccent;
      break;
    default:
      buttonStyles = {};
      textStyles = {};
  }
  return [buttonStyles, textStyles];
}

function getStyles({ size, theme, button_width }) {
  const [buttonStylesByTheme, textStylesByTheme] = getStyleByTheme(theme);
  const buttonStyles = [
    styles.button,
    getButtonStyleByWidth(button_width),
    getButtonStyleBySize(size, button_width),
    buttonStylesByTheme
  ];
  const textStyles = [styles.text, textStylesByTheme];
  return [buttonStyles, textStyles]
}

export default class CalculatorButton extends PureComponent {
  static propTypes = {
    button_width: PropTypes.number,
    text: PropTypes.string,
    onPress: PropTypes.func,
    size: PropTypes.number,
    theme: PropTypes.string,
    theme: PropTypes.oneOf(Object.values(THEME)),
    command: PropTypes.oneOf(Object.values(COMMAND))
  }

  static defaultProps = {
    button_width: 10,
    text: '',
    onPress: emptyFunc,
    size: 1,
    theme: THEME.DIGIT,
    command: COMMAND.DIGIT
  }

  onPress = () => {
    const {
      text,
      command,
      onPress
    } = this.props;
    onPress(command, text);
  }

  render() {
    const {
      text,
      ...props
    } = this.props;
    const [buttonStyles, textStyles] = getStyles(props);
    return (
      <SimpleButton
        text={text}
        onPress={this.onPress}
        viewStyles={buttonStyles}
        textStyles={textStyles}
      />
    );
  }
}
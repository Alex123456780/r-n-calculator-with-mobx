import { PureComponent } from 'react';
import { Dimensions } from 'react-native';

const screen_width = Dimensions.get("window").width;

export default class ButtonContainer extends PureComponent {
  render() {
    return (
      this.props.children(screen_width / this.props.groupButtonCount)
    );
  }
}
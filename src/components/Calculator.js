import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View
} from "react-native";
import { observer, inject } from "mobx-react/native";

import {
  ButtonContainer,
  ButtonGroup,
  CalculatorButton,
  TextPanel
} from './';
import {
  THEME,
  COMMAND
} from './../lib/constants';

const DATA = [
  [
    { text: 'C', theme: THEME.SECONDARY_OP, command: COMMAND.RESET },
    { text: '⁺∕₋', theme: THEME.SECONDARY_OP, command: COMMAND.TOGGLE_SIGN },
    { text: '%', theme: THEME.SECONDARY_OP, command: COMMAND.PERCENTAGE },
    { text: '÷', theme: THEME.MAIN_OP, command: COMMAND.DIVISION },
  ],
  [
    { text: '7' },
    { text: '8' },
    { text: '9' },
    { text: 'x', theme: THEME.MAIN_OP, command: COMMAND.MULTIPLICATION },
  ],
  [
    { text: '4' },
    { text: '5' },
    { text: '6' },
    { text: '-', theme: THEME.MAIN_OP, command: COMMAND.SUBTRACTION },
  ],
  [
    { text: '1' },
    { text: '2' },
    { text: '3' },
    { text: '+', theme: THEME.MAIN_OP, command: COMMAND.ADDITION },
  ],
  [
    { text: '0', size: 2 },
    { text: ',', command: COMMAND.RATIONAL },
    { text: '=', theme: THEME.MAIN_OP, command: COMMAND.EQUAL },
  ]
]

const MAX_BUTTON_ROW = DATA.sort((el1, el2) => el2.length - el1.length)[0].length;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end"
  },
});

// для проверки типов поулчаемых данных в данном случае лучше было бы имплементировать интерфейс (TypeScript)
@inject('calc_store')
@observer
export default class Calculator extends Component {
  onPress = (command, text) => {
    this.props.calc_store.handlePress(command, text);
  }

  renderButtonGroups = (button_width, data = []) => (
    data.map((el, index) => (
      //в рамках данного приложения указание key в качестве index'а не будет плохой практьикой, поскольку элементы не
      // добавляются в и не удаляются из массива ButtonGroup'ов.
      <ButtonGroup
        key={`${index}`}
      >
        {this.renderButtonGroup(button_width, el)}
      </ButtonGroup>
    ))
  )

  renderButtonGroup = (button_width = 10, arr = []) => (
    arr.map(el => (
      <CalculatorButton
        key={el.text}
        button_width={button_width}
        onPress={this.onPress}
        {...el}
      />
    ))
  )

  get renderContainer() {
    return (button_width) => (
      this.renderButtonGroups(button_width, DATA)
    )
  }

  render() {
    const {
      calc_store: {
        calc_value,
        temp_value,
        info_message
      }
    } = this.props;
    return (
      <View style={styles.container}>
      {/* TODO: horizontal scroll panel for temp result */}
        <TextPanel
          fontSize={30}
          color='gray'
          value={temp_value}
        />
        <TextPanel
          value={info_message || calc_value || '0'}
          fontSize={info_message ? 30 : 40}
        />
        <ButtonContainer groupButtonCount={MAX_BUTTON_ROW}>
          {this.renderContainer}
        </ButtonContainer>
      </View>
    );
  }
}
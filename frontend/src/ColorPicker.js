import React from 'react';
import { SketchPicker } from 'react-color';
import styles from './ColorPicker.module.css';


class ColorPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      color: this.props.color,
    }
  }

  handleChange = color => {
    this.setState({ color: color.hex })
    this.props.onChangeColor(color.hex);
  }

  render() {
    return (
      <div className={styles.container}>
        <SketchPicker
          color={ this.state.color }
          onChange={ this.handleChange }
        />
      </div>
    );
  }
}

export default ColorPicker
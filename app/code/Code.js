import React, { Component } from 'react'
import { Input } from 'antd';
import { withStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import md5 from 'md5';

const { TextArea } = Input;

const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})(props => <Radio color="default" {...props} />);

class Code extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      code: '',
      mode: 'md5',
      result: '',
    };

    this.textAreahandleChange = this.textAreahandleChange.bind(this);
    this.modeHandleChange = this.modeHandleChange.bind(this);
    this.convert = this.convert.bind(this);
  }

  textAreahandleChange(event) {
    this.setState({
      code: event.target.value
    })
  } 

  convert() {
    let result = '';
    if (this.state.mode === 'md5') {
      result = md5(this.state.code)
    }

    if (this.state.mode === 'btoa') {
      result = btoa(this.state.code)
    }

    if (this.state.mode === 'atob') {
      result = atob(this.state.code)
    }
    this.setState({result: result})
  }

  modeHandleChange(e) {
    this.setState({
      mode: e.target.value
    })
  }

  render() {
    return (
      <div>
        <TextArea
        style={{
          width: '100%',
          height: '30vh',
          resize: 'none',
        }}
        autoSize={false}
        onChange={this.textAreahandleChange}
        ></TextArea>
        <div style={{float: 'left'}}>
        <FormControl component="fieldset">
          <RadioGroup aria-label="position" name="position" value={this.state.code} onChange={this.modeHandleChange} row>
            <FormControlLabel
              checked={this.state.mode === 'md5'}
              value="md5"
              control={<Radio color="secondary" />}
              label="md5"
              labelPlacement="end"
            />
            <FormControlLabel
              checked={this.state.mode === 'btoa'}
              value="btoa"
              control={<GreenRadio/>}
              label="btoa"
            />
            <FormControlLabel
              checked={this.state.mode === 'atob'}
              value="atob"
              control={<Radio color="primary" />}
              label="atob"
            />
          </RadioGroup>
        </FormControl>
        </div>
        <Button style={{margin: '0.5rem', float: 'right'}} onClick={this.convert} size="small" variant="outlined" color="primary">
          转换
        </Button>

        <TextArea
        style={{
          width: '100%',
          height: '30vh',
          resize: 'none',
        }}
        disabled
        autoSize={false}
        value={this.state.result}
        ></TextArea>
      </div>
    )
  }
}

export default Code;
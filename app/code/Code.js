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

const _utf8Encode = function (str) {
  let out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i);
      } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
  }
  return out;
};

const _utf8Decode = function (str) {
  let out, i, len, c;
  let char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while (i < len) {
      c = str.charCodeAt(i++);
      switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
              // 0xxxxxxx
              out += str.charAt(i - 1);
              break;
          case 12:
          case 13:
              // 110x xxxx　 10xx xxxx
              char2 = str.charCodeAt(i++);
              out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
              break;
          case 14:
              // 1110 xxxx　10xx xxxx　10xx xxxx
              char2 = str.charCodeAt(i++);
              char3 = str.charCodeAt(i++);
              out += String.fromCharCode(((c & 0x0F) << 12) |
                  ((char2 & 0x3F) << 6) |
                  ((char3 & 0x3F) << 0));
              break;
      }
  }
  return out;
};

//base64编码字符集
const _base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
//base64解码字符集
const _base64DecodeChars = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

/**
 * base64编码
 * @param {Object} str 源码
 * @return {String} base64码
 */
const _base64Encode = function (str) {
  let out, i, len;
  let c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
          out += _base64EncodeChars.charAt(c1 >> 2);
          out += _base64EncodeChars.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
          out += _base64EncodeChars.charAt(c1 >> 2);
          out += _base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += _base64EncodeChars.charAt((c2 & 0xF) << 2);
          out += "=";
          break;
      }
      c3 = str.charCodeAt(i++);
      out += _base64EncodeChars.charAt(c1 >> 2);
      out += _base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += _base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += _base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
  };

/**
 * base64解码
 * @param {Object} str 源码
 * @return {String} 源码
 */
const _base64Decode = function (str) {
    let c1, c2, c3, c4;
    let i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = _base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = _base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = _base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = _base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }

    return out;
};

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

  convert(mode, div) {
    if(this.state.code === '') return;

    const _mode = div === 'div' ? mode : this.state.mode;
    let result = '';

    if (_mode === 'md5')
      result = md5(this.state.code);

    if (_mode === 'btoa')
      result = _base64Encode(_utf8Encode(this.state.code));

    if (_mode === 'atob')
      result = _utf8Decode(_base64Decode(this.state.code));

    this.setState({result: result})
  }

  modeHandleChange(e) {
    this.setState({
      mode: e.target.value
    });
    this.convert(e.target.value, 'div');
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
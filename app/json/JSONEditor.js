import React, { Component } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { pink, purple, cyan, deepOrange, teal, yellow } from '@material-ui/core/colors';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import yaml from 'js-yaml';
import xml from 'xml-js';
import './index.css';

const PinkButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(pink[700]),
    backgroundColor: pink[700],
    '&:hover': {
      backgroundColor: pink[900],
    },
  },
}))(Button);

const PurpleButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  },
}))(Button);

const CyanButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(cyan[700]),
    backgroundColor: cyan[700],
    '&:hover': {
      backgroundColor: cyan[900],
    },
  },
}))(Button);

const DeepOrangeButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(deepOrange[700]),
    backgroundColor: deepOrange[700],
    '&:hover': {
      backgroundColor: deepOrange[900],
    },
  },
}))(Button);

const TealButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(teal[700]),
    backgroundColor: teal[700],
    '&:hover': {
      backgroundColor: teal[900],
    },
  },
}))(Button);

const YellowButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(yellow[800]),
    backgroundColor: yellow[800],
    '&:hover': {
      backgroundColor: yellow[900],
    },
  },
}))(Button);


export default class JSONEditorComponent extends Component {

  constructor (props){
    super(props);

    this.leftToRight = this.leftToRight.bind(this);
    this.rightToLeft = this.rightToLeft.bind(this);
    this.jsonToXml = this.jsonToXml.bind(this);
    this.jsonToYaml = this.jsonToYaml.bind(this);
  }

  componentDidMount () {
    const leftJsonenditotOptions = {
      mode: 'code',
    };

    const rightJsonenditotOptions = {
      mode: 'tree',
      modes: ['tree', 'form', 'text', 'view', 'preview'],
      onError: (error) => {
      },
      onValidationError: (errors) => {
        errors.forEach((error) => {
          switch (error.type) {
            case 'validation': // schema validation error
              break;
            case 'customValidation': // custom validation error
              break;
            case 'error':  // json parse error
              if (this.rightJsonenditor.getMode() === 'text') {
                // 留着以后处理
              }
              break;
          }
        });
      }
    };

    const initJson = {name: 'Hola Eva!'};

    this.leftJsonenditor = new JSONEditor(this.leftJsonenditor, leftJsonenditotOptions);
    this.leftJsonenditor.set(initJson);

    this.rightJsonenditor = new JSONEditor(this.rightJsonenditor, rightJsonenditotOptions);
    this.rightJsonenditor.set(initJson);
  }

  componentWillUnmount () {
    if (this.leftJsonenditor) {
      this.leftJsonenditor.destroy();
    }
    if (this.rightJsonenditor) {
      this.rightJsonenditor.destroy(); 
    }
  }

  jsonToXml() {
    let content = this.leftJsonenditor.getText();
		const xmlStr = xml.json2xml(content, {compact: true, ignoreComment: true, spaces: 2});
    this.rightJsonenditor.setMode('text')
		this.rightJsonenditor.setText(xmlStr);
  }

  jsonToYaml() {
    let content = this.leftJsonenditor.get();
		const yamlStr = yaml.dump(content);
    this.rightJsonenditor.setMode('text')
		this.rightJsonenditor.setText(yamlStr);
  }

  leftToRight() {
    this.rightJsonenditor.setMode('tree')
    this.rightJsonenditor.set(this.leftJsonenditor.get())
  }

  rightToLeft() {
    this.leftJsonenditor.setText(JSON.stringify(this.rightJsonenditor.get(), null, 2))
  }

  render() {
    return (
      <div className={"jsoneditor-container"}>
        <div className={"button-container"}>
        <DeepOrangeButton onClick={this.jsonToXml}>JSON 转 XML</DeepOrangeButton>
        <TealButton onClick={this.jsonToYaml}>JSON 转 YAML</TealButton>
        </div>
        <div className={"jsoneditor-sub-container"}>
          <div className={"app-jsoneditor"} ref={elem => this.leftJsonenditor = elem} />
          <div className={"json-convert-button"}>
            <IconButton className={"json-convert-button-item"} onClick={this.leftToRight}><ArrowForwardIcon/></IconButton>
            <IconButton className={"json-convert-button-item"} onClick={this.rightToLeft}><ArrowBackIcon/></IconButton>
          </div>
          <div className={"app-jsoneditor"} ref={elem => this.rightJsonenditor = elem} />
        </div>
      </div>
    );
  }
}
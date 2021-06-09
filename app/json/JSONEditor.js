import React, { Component, useState, useEffect, useRef } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { pink, purple, cyan, deepOrange, teal, yellow } from '@material-ui/core/colors';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
    color: theme.palette.getContrastText(yellow[700]),
    backgroundColor: yellow[700],
    '&:hover': {
      backgroundColor: yellow[900],
    },
  },
}))(Button);


export default class JSONEditorComponent extends Component {
  componentDidMount () {
    const leftJsonenditotOptions = {
      mode: 'code',
      // onChangeJSON: this.props.onChangeJSON
    };

    const rightJsonenditotOptions = {
      mode: 'code',
      // onChangeJSON: this.props.onChangeJSON
    };

    this.leftJsonenditor = new JSONEditor(this.leftJsonenditor, leftJsonenditotOptions);
    this.leftJsonenditor.set({name: 'Hola Eva!'});

    this.rightJsonenditor = new JSONEditor(this.rightJsonenditor, rightJsonenditotOptions);
    this.rightJsonenditor.set({});
  }

  componentWillUnmount () {
    if (this.leftJsonenditor) {
      this.leftJsonenditor.destroy();
    }
    if (this.rightJsonenditor) {
      this.rightJsonenditor.destroy(); 
    }
  }

  componentDidUpdate() {
    // this.jsoneditor.update(this.props.json);
  }

  render() {
    return (
      <div className={"jsoneditor-container"}>
        <div className={"button-container"}>
        <PinkButton variant="contained">格式化</PinkButton>
        <PurpleButton variant="contained">压缩</PurpleButton>
        <DeepOrangeButton variant="contained">JSON 转 XML</DeepOrangeButton>
        <TealButton variant="contained">JSON 转 CSV</TealButton>
        <Button variant="contained" color="secondary">JSON 转 YAML</Button>
        <YellowButton variant="contained">JSON 转 YAML</YellowButton>
        </div>
        <div className={"jsoneditor-sub-container"}>
          <div className={"app-jsoneditor"} ref={elem => this.leftJsonenditor = elem} />
          <div className={"json-convert-button"}>
            <IconButton className={"json-convert-button-item"}><ArrowForwardIcon/></IconButton>
            <IconButton className={"json-convert-button-item"}><ArrowBackIcon/></IconButton>
          </div>
          <div className={"app-jsoneditor"} ref={elem => this.rightJsonenditor = elem} />
        </div>
      </div>
    );
  }
}
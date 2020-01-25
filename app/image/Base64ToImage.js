import React, { Component } from 'react'
import { Input, Upload } from 'antd';
import Grid from '@material-ui/core/Grid';
import 'antd/es/upload/style/css';
import './index.css'

const { TextArea } = Input;

function sizeFormat(num) {
  if (isNaN(num)) {
      return '暂无数据';
  }
  num = +num;
  if (num < 1024) {
      return num + ' B';
  } else if (num < 1024 * 1024) {
      return (num / 1024).toFixed(2) + ' KB';
  } else {
      return (num / 1024 / 1024).toFixed(2) + ' MB';
  }
}

function showSize(base64) {
    var str = base64.replace(/^data:image\/[\S\s]+?;base64,/, "");
    var equalIndex = str.indexOf('=');
    if(str.indexOf('=')>0) {
        str=str.substring(0, equalIndex);
    }
    var strLength=str.length;
    var fileLength=parseInt(strLength-(strLength/8)*2);
    var size = "";
    size = (fileLength / 1024).toFixed(2);
    var sizeStr = size + "";
    var index = sizeStr.indexOf(".");
    var dou = sizeStr.substr(index + 1, 2)
    if (dou == "00") {           
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
  }

class Base64ToImage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      base64: '',
      fileSize: '',
      base64Size: '', 
    };
    this.handleChange = this.handleChange.bind(this);
    this.textAreahandleChange = this.textAreahandleChange.bind(this);
  }

  handleChange(info) {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        const base64 = imageUrl.replace(/^data:image\/[\S\s]+?;base64,/, "");
        this.setState({
          fileSize: sizeFormat(info.file.size),
          base64Size: sizeFormat(base64.length),
          base64: base64,
          imageUrl,
          loading: false,
        })
      });
    }
  };

  textAreahandleChange(event) {
      this.setState({
        base64Size: sizeFormat(event.target.value.length),
        fileSize: sizeFormat(showSize(event.target.value)),
        imageUrl: 'data:image/png;base64,' + event.target.value
      })
  }

  render() {
    const sourceInfo = '图片大小: ';
    const base64Info = 'base64大小: ';

    const uploadButton = (
      <div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextArea
            autoSize={false}
            className='base64-text-area'
            onChange={this.textAreahandleChange}
            ></TextArea>
            <p>{sourceInfo}
              <span style={{
              color: '#000',
              fontSize: '1.3rem'}}>
                {this.state.fileSize}
              </span>
            </p>
            <p>{base64Info}
              <span style={{
              color: '#000',
              fontSize: '1.3rem'}}>
                {this.state.base64Size}
              </span>
            </p>
          </Grid>

          <Grid item xs={6}>
            <Upload
            name="image"
            listType="picture-card"
            className="image-uploader"
            showUploadList={false}
            disabled
            onChange={this.handleChange}
            >
            {imageUrl ? <img src={imageUrl} alt="image" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Base64ToImage;
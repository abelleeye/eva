import React, { Component } from 'react'
import { Input, Upload, message } from 'antd';
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

class ImageToBase extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      base64: '',
      fileSize: '',
      base64Size: '', 
    };
    this.selfUpload = this.selfUpload.bind(this);
  }

  selfUpload ({ action, file, onSuccess, onError, onProgress }) {
    new Promise(resolve => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
    }).then(imageUrl => {
      const base64 = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      this.setState({
        fileSize: sizeFormat(file.size),
        base64Size: sizeFormat(base64.length),
        base64: base64,
        imageUrl,
        loading: false,
      })
    })
  }
  
  render() {
    const sourceInfo = '图片大小: ';
    const base64Info = 'base64大小: ';

    const uploadButton = (
      <div>
        <div className="ant-upload-text">点击或拖拽</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Upload
            name="image"
            listType="picture-card"
            className="image-uploader"
            showUploadList={false}
            customRequest={this.selfUpload}
            >
            {imageUrl ? <img src={imageUrl} alt="image" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Grid>

          <Grid item xs={6}>
            <TextArea
            autoSize={false}
            className='base64-text-area'
            value={this.state.base64}
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
        </Grid>
      </div>
    );
  }
}

export default ImageToBase;
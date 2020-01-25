import React, { Component } from 'react'
import { Input, Upload, message } from 'antd';
import Grid from '@material-ui/core/Grid';
import 'antd/es/upload/style/css';
import './index.css'

const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

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

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
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
    this.handleChange = this.handleChange.bind(this);
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
            onChange={this.handleChange}
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
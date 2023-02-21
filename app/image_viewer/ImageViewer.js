import React, { useState, useEffect } from 'react'
import { Upload, message } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import { encode } from 'jpeg-js'
import 'antd/es/message/style/css'
import './index.css'



const IMG_FORMAT = {
  YU12: 'yu12',
  YV12: 'yv12',
  NV12: 'nv12',
  NV21: 'nv21',
  RGB_PLANAR: 'rgb_planar',
  BGR_PLANAR: 'bgr_planar',
  RGB_PACKED: 'rgb_packed',
  BGR_PACKED: 'bgr_packed',
  YUV422: 'yuv422',
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// 将 YUV 数据转换为 RGB 数据
function yuvToRgb(y, u, v) {
  let r, g, b;

  // YUV 转 RGB 公式
  r = Math.floor(y + 1.402 * (v - 128));
  g = Math.floor(y - 0.34413 * (u - 128) - 0.71414 * (v - 128));
  b = Math.floor(y + 1.772 * (u - 128));

  // 确保 RGB 值在 0 到 255 之间
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return [r, g, b];
}

function imageToJpeg(imageData, width, height, quality, image_format) {
  // 将 YUV 数据转换为 RGBA 数据
  const rgbaData = new Uint8Array(width * height * 4);

  if (image_format === IMG_FORMAT.YU12) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const Y = imageData[y * width + x];
        const U = imageData[height * width + Math.floor(y / 2) * Math.floor(width / 2) + Math.floor(x / 2)];
        const V = imageData[Math.floor(height * width * 5 / 4) + Math.floor(y / 2) * Math.floor(width / 2) + Math.floor(x / 2)];
    
        const [r, g, b] = yuvToRgb(Y, U, V);
    
        rgbaData[(y * width + x) * 4] = r;
        rgbaData[(y * width + x) * 4 + 1] = g;
        rgbaData[(y * width + x) * 4 + 2] = b;
        rgbaData[(y * width + x) * 4 + 3] = 0xff;
      }
    }
  }

  if (image_format === IMG_FORMAT.YV12) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const Y = imageData[y * width + x];
        const V = imageData[height * width + Math.floor(y / 2) * Math.floor(width / 2) + Math.floor(x / 2)];
        const U = imageData[Math.floor(height * width * 5 / 4) + Math.floor(y / 2) * Math.floor(width / 2) + Math.floor(x / 2)];
    
        const [r, g, b] = yuvToRgb(Y, U, V);
    
        rgbaData[(y * width + x) * 4] = r;
        rgbaData[(y * width + x) * 4 + 1] = g;
        rgbaData[(y * width + x) * 4 + 2] = b;
        rgbaData[(y * width + x) * 4 + 3] = 0xff;
      }
    }
  }

  if (image_format === IMG_FORMAT.NV12) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const Y = imageData[y * width + x];
        const U = imageData[height * width + Math.floor(y / 2) * width + x - x % 2];
        const V = imageData[(height * width + Math.floor(y / 2) * width + x - x % 2) + 1];
    
        const [r, g, b] = yuvToRgb(Y, U, V);
    
        rgbaData[(y * width + x) * 4] = r;
        rgbaData[(y * width + x) * 4 + 1] = g;
        rgbaData[(y * width + x) * 4 + 2] = b;
        rgbaData[(y * width + x) * 4 + 3] = 0xff;
      }
    }
  }

  if (image_format === IMG_FORMAT.NV21) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const Y = imageData[y * width + x];
        const U = imageData[(height * width + Math.floor(y / 2) * width + x - x % 2) + 1];
        const V = imageData[height * width + Math.floor(y / 2) * width + x - x % 2];
    
        const [r, g, b] = yuvToRgb(Y, U, V);
    
        rgbaData[(y * width + x) * 4] = r;
        rgbaData[(y * width + x) * 4 + 1] = g;
        rgbaData[(y * width + x) * 4 + 2] = b;
        rgbaData[(y * width + x) * 4 + 3] = 0xff;
      }
    }
  }

  if (image_format === IMG_FORMAT.RGB_PACKED) {
    for (let i = 0; i < width * height; i++) {
      rgbaData[i * 4] = imageData[i * 3];
      rgbaData[i * 4 + 1] = imageData[i * 3 + 1];
      rgbaData[i * 4 + 2] = imageData[i * 3 + 2];
      rgbaData[i * 4 + 3] = 0xff;
    }
  }

  if (image_format === IMG_FORMAT.RGB_PLANAR) {
    for (let i = 0; i < width * height; i++) {
      rgbaData[i * 4] = imageData[i];
      rgbaData[i * 4 + 1] = imageData[i + width * height];
      rgbaData[i * 4 + 2] = imageData[i + 2 * width * height];
      rgbaData[i * 4 + 3] = 0xff;
    }
  }

  const jpegImageData = encode({data: rgbaData, width, height}, quality)

  return jpegImageData.data;
}

// 在组件中显示 JPEG 数据
function JpegImage({ jpegData, width, height }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (jpegData) {
      const blob = new Blob([jpegData], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    }
  }, [jpegData]);

  return imageUrl ? <img width={width} height={height} src={imageUrl} alt="JPEG Image" /> : null;
}


function ImageViewer() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [imageFormat, setImageFormat] = useState(IMG_FORMAT.YU12);
  const [jpegData, setJpegData] = useState(null);
  const quality = 100;

  const classes = useStyles();

  function selfUpload({ action, file, onSuccess, onError, onProgress }) {
    new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = new Uint8Array(reader.result);
        resolve(imageData);
      };
      reader.readAsArrayBuffer(file);
    }).then(imageData => {
      try {
        const jpegData = imageToJpeg(imageData, width, height, quality, imageFormat);

        if (!jpegData) {
          message.error(`${imageFormat} is not support yet!`)
          return;
        }

        message.success('convert success.')
        setJpegData(jpegData);
      } catch (e) {
        message.error(`${imageFormat}, convert failed! e: ${e}`)
        return;
      }
    })
  }

  const handleImageFormatChange = (e) => {
    setImageFormat(e.target.value);
  };

  const onWidthChange = (e) => {
    setWidth(e.target.value);
  };

  const onHeightChange = (e) => {
    setHeight(e.target.value);
  };

  return (
    <div>
      <div className='image_form_warp'>
        <div style={{width: 150, height: 'auto'}}>
          <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              customRequest={selfUpload}>
            <Button>Click to Upload</Button>
          </Upload>
        </div>
        <div style={{width: 250, height: 'auto', marginBottom: 42}}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Image Type</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={imageFormat}
                onChange={handleImageFormatChange}
              >
                <MenuItem value={IMG_FORMAT.YU12}>YU12 I420</MenuItem>
                <MenuItem value={IMG_FORMAT.YV12}>YV12</MenuItem>
                <MenuItem value={IMG_FORMAT.NV12}>NV12</MenuItem>
                <MenuItem value={IMG_FORMAT.NV21}>NV21</MenuItem>
                <MenuItem value={IMG_FORMAT.RGB_PLANAR}>RGB_PLANAR rrrgggbbb</MenuItem>
                <MenuItem value={IMG_FORMAT.BGR_PLANAR}>BGR_PLANAR bbbgggrrr</MenuItem>
                <MenuItem value={IMG_FORMAT.RGB_PACKED}>RGB_PACKED rgbrgbrgb</MenuItem>
                <MenuItem value={IMG_FORMAT.BGR_PACKED}>BGR_PACKED bgrbgrbgr</MenuItem>
             </Select>
          </FormControl>
        </div>
        <div style={{width: 150, height: 'auto', marginBottom: 50}}>
          <TextField
            id="standard-number"
            label="Width"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={width}
            onChange={onWidthChange}
          />
        </div>
        <div style={{width: 150, height: 'auto', marginBottom: 50, marginLeft: 20}}>
          <TextField
            id="standard-number"
            label="Height"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={height}
            onChange={onHeightChange}
          />
        </div>
      </div>
      <JpegImage jpegData={jpegData} width={width} height={height} />
    </div>
  )
}

export default ImageViewer;
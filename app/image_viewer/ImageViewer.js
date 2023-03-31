import React, { useState, useEffect } from 'react'
import { Upload, message } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import { decode, encode } from 'jpeg-js'
import 'antd/es/message/style/css'
import './index.css'

// https://docs.opencv.org/2.4/modules/imgproc/doc/miscellaneous_transformations.html#cvtxor


const IMG_FORMAT = {
  UnSelect: 'UnSelect',
  YU12: 'yu12',
  YV12: 'yv12',
  NV12: 'nv12',
  NV21: 'nv21',
  YUV422: 'yuv422',
  RGB_PLANAR: 'rgb_planar',
  BGR_PLANAR: 'bgr_planar',
  RGB_PACKED: 'rgb_packed',
  BGR_PACKED: 'bgr_packed',
  GRAY: 'gray',
  JPEG: 'jpeg',
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

  r = Math.floor(y + 1.403 * (v - 128));
  g = Math.floor(y - 0.714 * (v - 128)- 0.344 * (u - 128) );
  b = Math.floor(y + 1.773 * (u - 128));

  // 确保 RGB 值在 0 到 255 之间
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return [r, g, b];
}

function rgbToYuv(r, g, b) {
  let y, u, v;

  y = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
  u = Math.floor((b - y) * 0.564 + 128);
  v = Math.floor((r - y) * 0.713 + 128);

  // 确保 YUV 值在 0 到 255 之间
  y = Math.min(255, Math.max(0, y));
  u = Math.min(255, Math.max(0, u));
  v = Math.min(255, Math.max(0, v));

  return [y, u, v];
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

  if (image_format === IMG_FORMAT.BGR_PACKED) {
    for (let i = 0; i < width * height; i++) {
      rgbaData[i * 4] = imageData[i * 3 + 2];
      rgbaData[i * 4 + 1] = imageData[i * 3 + 1];
      rgbaData[i * 4 + 2] = imageData[i * 3];
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

  if (image_format === IMG_FORMAT.BGR_PLANAR) {
    for (let i = 0; i < width * height; i++) {
      rgbaData[i * 4] = imageData[i + 2 * width * height];
      rgbaData[i * 4 + 1] = imageData[i + width * height];
      rgbaData[i * 4 + 2] = imageData[i];
      rgbaData[i * 4 + 3] = 0xff;
    }
  }

  if (image_format === IMG_FORMAT.GRAY) {
    for (let i = 0; i < width * height; i++) {
      rgbaData[i * 4] = imageData[i];
      rgbaData[i * 4 + 1] = imageData[i];
      rgbaData[i * 4 + 2] = imageData[i];
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

const downloadUint8Array = (uint8Array, fileName) => {
  // 创建 Blob 对象，用于文件下载
  const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

  // 创建下载链接
  const url = URL.createObjectURL(blob);

  // 创建下载链接的 DOM 元素，并模拟点击进行下载
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // 释放 URL 对象
  URL.revokeObjectURL(url);
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
        if (imageFormat === IMG_FORMAT.JPEG) {
          const jpeg_info = decode(imageData, {useTArray: true});
          message.success(`img width = ${jpeg_info.width}, height = ${jpeg_info.height}`);
          setWidth(jpeg_info.width);
          setHeight(jpeg_info.height);
        }

        const jpegData = imageFormat !== IMG_FORMAT.JPEG ? imageToJpeg(imageData, width, height, quality, imageFormat) : imageData;

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

  const handleConvertFormatChange = (e) => {
    if (!jpegData) {
      message.error(`Input a image first, please!`);
      return;
    }

    const image_format = e.target.value;

    const rgbaInfo = decode(jpegData, {useTArray: true});
    const rgbaData = rgbaInfo.data;
    const rgbaWidth = rgbaInfo.width;
    const rgbaHeight = rgbaInfo.height;

    if (image_format === IMG_FORMAT.YU12) {
      const yu12Data = new Uint8Array(rgbaWidth * rgbaHeight * 3 / 2);

      for (let x = 0; x < rgbaWidth; x += 2) {
        for (let y = 0; y < rgbaHeight; y += 2) {
          const rgbaIndex = (y * rgbaWidth + x) * 4;
          const r1 = rgbaData[rgbaIndex];
          const g1 = rgbaData[rgbaIndex + 1];
          const b1 = rgbaData[rgbaIndex + 2];
          const [y1, u1, v1] = rgbToYuv(r1, g1, b1);
          yu12Data[y * rgbaWidth + x] = y1;
    
          const rgbaIndex2 = (y * rgbaWidth + x + 1) * 4;
          const r2 = rgbaData[rgbaIndex2];
          const g2 = rgbaData[rgbaIndex2 + 1];
          const b2 = rgbaData[rgbaIndex2 + 2];
          const [y2, u2, v2] = rgbToYuv(r2, g2, b2);
          yu12Data[y * rgbaWidth + x + 1] = y2;
    
          const rgbaIndex3 = ((y + 1) * rgbaWidth + x) * 4;
          const r3 = rgbaData[rgbaIndex3];
          const g3 = rgbaData[rgbaIndex3 + 1];
          const b3 = rgbaData[rgbaIndex3 + 2];
          const [y3, u3, v3] = rgbToYuv(r3, g3, b3);
          yu12Data[(y + 1) * rgbaWidth + x] = y3;
    
          const rgbaIndex4 = ((y + 1) * rgbaWidth + x + 1) * 4;
          const r4 = rgbaData[rgbaIndex4];
          const g4 = rgbaData[rgbaIndex4 + 1];
          const b4 = rgbaData[rgbaIndex4 + 2];
          const [y4, u4, v4] = rgbToYuv(r4, g4, b4);
          yu12Data[(y + 1) * rgbaWidth + x + 1] = y4;


          const u = Math.ceil((u1 + u2 + u3 + u4) / 4);
          const v = Math.ceil((v1 + v2 + v3 + v4) / 4);
          const uIndex = rgbaHeight * rgbaWidth + Math.floor(y / 2) * Math.floor(rgbaWidth / 2) + Math.floor(x / 2);
          const vIndex = Math.floor(rgbaHeight * rgbaWidth * 5 / 4) + Math.floor(y / 2) * Math.floor(rgbaWidth / 2) + Math.floor(x / 2);
          yu12Data[uIndex] = u;
          yu12Data[vIndex] = v;
        }
      }

      downloadUint8Array(yu12Data, "yu12.yuv");
      return;
    }
  
    if (image_format === IMG_FORMAT.YV12) {
      const yv12Data = new Uint8Array(rgbaWidth * rgbaHeight * 3 / 2);

      for (let x = 0; x < rgbaWidth; x += 2) {
        for (let y = 0; y < rgbaHeight; y += 2) {
          const rgbaIndex = (y * rgbaWidth + x) * 4;
          const r1 = rgbaData[rgbaIndex];
          const g1 = rgbaData[rgbaIndex + 1];
          const b1 = rgbaData[rgbaIndex + 2];
          const [y1, u1, v1] = rgbToYuv(r1, g1, b1);
          yv12Data[y * rgbaWidth + x] = y1;
    
          const rgbaIndex2 = (y * rgbaWidth + x + 1) * 4;
          const r2 = rgbaData[rgbaIndex2];
          const g2 = rgbaData[rgbaIndex2 + 1];
          const b2 = rgbaData[rgbaIndex2 + 2];
          const [y2, u2, v2] = rgbToYuv(r2, g2, b2);
          yv12Data[y * rgbaWidth + x + 1] = y2;
    
          const rgbaIndex3 = ((y + 1) * rgbaWidth + x) * 4;
          const r3 = rgbaData[rgbaIndex3];
          const g3 = rgbaData[rgbaIndex3 + 1];
          const b3 = rgbaData[rgbaIndex3 + 2];
          const [y3, u3, v3] = rgbToYuv(r3, g3, b3);
          yv12Data[(y + 1) * rgbaWidth + x] = y3;
    
          const rgbaIndex4 = ((y + 1) * rgbaWidth + x + 1) * 4;
          const r4 = rgbaData[rgbaIndex4];
          const g4 = rgbaData[rgbaIndex4 + 1];
          const b4 = rgbaData[rgbaIndex4 + 2];
          const [y4, u4, v4] = rgbToYuv(r4, g4, b4);
          yv12Data[(y + 1) * rgbaWidth + x + 1] = y4;


          const u = Math.ceil((u1 + u2 + u3 + u4) / 4);
          const v = Math.ceil((v1 + v2 + v3 + v4) / 4);
          const uIndex = Math.floor(rgbaHeight * rgbaWidth * 5 / 4) + Math.floor(y / 2) * Math.floor(rgbaWidth / 2) + Math.floor(x / 2);
          const vIndex = rgbaHeight * rgbaWidth + Math.floor(y / 2) * Math.floor(rgbaWidth / 2) + Math.floor(x / 2);
          yv12Data[uIndex] = u;
          yv12Data[vIndex] = v;
        }
      }

      downloadUint8Array(yv12Data, "yv12.yuv");
      return;
    }
  
    if (image_format === IMG_FORMAT.NV12) {
      const nv12Data = new Uint8Array(rgbaWidth * rgbaHeight * 3 / 2);

      for (let x = 0; x < rgbaWidth; x += 2) {
        for (let y = 0; y < rgbaHeight; y += 2) {
          const rgbaIndex = (y * rgbaWidth + x) * 4;
          const r1 = rgbaData[rgbaIndex];
          const g1 = rgbaData[rgbaIndex + 1];
          const b1 = rgbaData[rgbaIndex + 2];
          const [y1, u1, v1] = rgbToYuv(r1, g1, b1);
          nv12Data[y * rgbaWidth + x] = y1;
    
          const rgbaIndex2 = (y * rgbaWidth + x + 1) * 4;
          const r2 = rgbaData[rgbaIndex2];
          const g2 = rgbaData[rgbaIndex2 + 1];
          const b2 = rgbaData[rgbaIndex2 + 2];
          const [y2, u2, v2] = rgbToYuv(r2, g2, b2);
          nv12Data[y * rgbaWidth + x + 1] = y2;
    
          const rgbaIndex3 = ((y + 1) * rgbaWidth + x) * 4;
          const r3 = rgbaData[rgbaIndex3];
          const g3 = rgbaData[rgbaIndex3 + 1];
          const b3 = rgbaData[rgbaIndex3 + 2];
          const [y3, u3, v3] = rgbToYuv(r3, g3, b3);
          nv12Data[(y + 1) * rgbaWidth + x] = y3;
    
          const rgbaIndex4 = ((y + 1) * rgbaWidth + x + 1) * 4;
          const r4 = rgbaData[rgbaIndex4];
          const g4 = rgbaData[rgbaIndex4 + 1];
          const b4 = rgbaData[rgbaIndex4 + 2];
          const [y4, u4, v4] = rgbToYuv(r4, g4, b4);
          nv12Data[(y + 1) * rgbaWidth + x + 1] = y4;


          const u = Math.ceil((u1 + u2 + u3 + u4) / 4);
          const v = Math.ceil((v1 + v2 + v3 + v4) / 4);
          const uIndex = rgbaHeight * rgbaWidth + Math.floor(y / 2) * rgbaWidth + x - x % 2
          const vIndex = (rgbaHeight * rgbaWidth + Math.floor(y / 2) * rgbaWidth + x - x % 2) + 1;
          nv12Data[uIndex] = u;
          nv12Data[vIndex] = v;
        }
      }

      downloadUint8Array(nv12Data, "nv12.yuv");
      return;
    }
  
    if (image_format === IMG_FORMAT.NV21) {
      const nv21Data = new Uint8Array(rgbaWidth * rgbaHeight * 3 / 2);

      for (let x = 0; x < rgbaWidth; x += 2) {
        for (let y = 0; y < rgbaHeight; y += 2) {
          const rgbaIndex = (y * rgbaWidth + x) * 4;
          const r1 = rgbaData[rgbaIndex];
          const g1 = rgbaData[rgbaIndex + 1];
          const b1 = rgbaData[rgbaIndex + 2];
          const [y1, u1, v1] = rgbToYuv(r1, g1, b1);
          nv21Data[y * rgbaWidth + x] = y1;
    
          const rgbaIndex2 = (y * rgbaWidth + x + 1) * 4;
          const r2 = rgbaData[rgbaIndex2];
          const g2 = rgbaData[rgbaIndex2 + 1];
          const b2 = rgbaData[rgbaIndex2 + 2];
          const [y2, u2, v2] = rgbToYuv(r2, g2, b2);
          nv21Data[y * rgbaWidth + x + 1] = y2;
    
          const rgbaIndex3 = ((y + 1) * rgbaWidth + x) * 4;
          const r3 = rgbaData[rgbaIndex3];
          const g3 = rgbaData[rgbaIndex3 + 1];
          const b3 = rgbaData[rgbaIndex3 + 2];
          const [y3, u3, v3] = rgbToYuv(r3, g3, b3);
          nv21Data[(y + 1) * rgbaWidth + x] = y3;
    
          const rgbaIndex4 = ((y + 1) * rgbaWidth + x + 1) * 4;
          const r4 = rgbaData[rgbaIndex4];
          const g4 = rgbaData[rgbaIndex4 + 1];
          const b4 = rgbaData[rgbaIndex4 + 2];
          const [y4, u4, v4] = rgbToYuv(r4, g4, b4);
          nv21Data[(y + 1) * rgbaWidth + x + 1] = y4;


          const u = Math.ceil((u1 + u2 + u3 + u4) / 4);
          const v = Math.ceil((v1 + v2 + v3 + v4) / 4);
          const uIndex = (rgbaHeight * rgbaWidth + Math.floor(y / 2) * rgbaWidth + x - x % 2) + 1;
          const vIndex = rgbaHeight * rgbaWidth + Math.floor(y / 2) * rgbaWidth + x - x % 2
          nv21Data[uIndex] = u;
          nv21Data[vIndex] = v;
        }
      }

      downloadUint8Array(nv21Data, "nv21.yuv");
      return;
    }
  
    if (image_format === IMG_FORMAT.RGB_PACKED) {
      const rgbData = new Uint8Array(rgbaWidth * rgbaHeight * 3);

      for (let i = 0; i < width * height; i++) {
        rgbData[i * 3] = rgbaData[i * 4];
        rgbData[i * 3 + 1] = rgbaData[i * 4 + 1];
        rgbData[i * 3 + 2] = rgbaData[i * 4 + 2];
      }

      downloadUint8Array(rgbData, "rgb_packed.rgb");
      return;
    }
  
    if (image_format === IMG_FORMAT.BGR_PACKED) {
      const rgbData = new Uint8Array(rgbaWidth * rgbaHeight * 3);
      for (let i = 0; i < width * height; i++) {
        rgbData[i * 3 + 2] = rgbaData[i * 4];
        rgbData[i * 3 + 1] = rgbaData[i * 4 + 1];
        rgbData[i * 3] = rgbaData[i * 4 + 2];
      }

      downloadUint8Array(rgbData, "bgr_packed.rgb");
      return;
    }
  
    if (image_format === IMG_FORMAT.RGB_PLANAR) {
      const rgbData = new Uint8Array(rgbaWidth * rgbaHeight * 3);
      for (let i = 0; i < width * height; i++) {
        rgbData[i] = rgbaData[i * 4];
        rgbData[i + width * height] = rgbaData[i * 4 + 1];
        rgbData[i + 2 * width * height] = rgbaData[i * 4 + 2];
      }

      downloadUint8Array(rgbData, "rgb_planar.rgb");
      return;
    }
  
    if (image_format === IMG_FORMAT.BGR_PLANAR) {
      const rgbData = new Uint8Array(rgbaWidth * rgbaHeight * 3);
      for (let i = 0; i < width * height; i++) {
        rgbData[i + 2 * width * height] = rgbaData[i * 4];
        rgbData[i + width * height] = rgbaData[i * 4 + 1];
        rgbData[i] = rgbaData[i * 4 + 2];
      }

      downloadUint8Array(rgbData, "bgr_planar.rgb");
      return;
    }
  
    if (image_format === IMG_FORMAT.GRAY) {
      const grayData = new Uint8Array(rgbaWidth * rgbaHeight * 3);
      for (let i = 0; i < width * height; i++) {
        const r = rgbaData[i * 4];
        const g = rgbaData[i * 4 + 1];
        const b = rgbaData[i * 4 + 2];

        grayData[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      }

      downloadUint8Array(grayData, "gray.gray");
      return;
    }

    message.error(`${imageFormat} is not support yet!`)
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
                <MenuItem value={IMG_FORMAT.GRAY}>GRAY</MenuItem>
                <MenuItem value={IMG_FORMAT.JPEG}>JPEG</MenuItem>
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
        <div style={{width: 250, height: 'auto', marginBottom: 42, marginLeft: 50}}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Convert Type</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={IMG_FORMAT.UnSelect}
                onChange={handleConvertFormatChange}
              >
                <MenuItem value={IMG_FORMAT.UnSelect}>UnSelect</MenuItem>
                <MenuItem value={IMG_FORMAT.YU12}>YU12 I420</MenuItem>
                <MenuItem value={IMG_FORMAT.YV12}>YV12</MenuItem>
                <MenuItem value={IMG_FORMAT.NV12}>NV12</MenuItem>
                <MenuItem value={IMG_FORMAT.NV21}>NV21</MenuItem>
                <MenuItem value={IMG_FORMAT.RGB_PLANAR}>RGB_PLANAR rrrgggbbb</MenuItem>
                <MenuItem value={IMG_FORMAT.BGR_PLANAR}>BGR_PLANAR bbbgggrrr</MenuItem>
                <MenuItem value={IMG_FORMAT.RGB_PACKED}>RGB_PACKED rgbrgbrgb</MenuItem>
                <MenuItem value={IMG_FORMAT.BGR_PACKED}>BGR_PACKED bgrbgrbgr</MenuItem>
                <MenuItem value={IMG_FORMAT.GRAY}>GRAY</MenuItem>
             </Select>
          </FormControl>
        </div>
      </div>
      <JpegImage jpegData={jpegData} width={width} height={height} />
    </div>
  )
}

export default ImageViewer;
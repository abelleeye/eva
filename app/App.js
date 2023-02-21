import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Timestamp from './timestamp/Timestamp';
import ImageViewer from './image_viewer/ImageViewer';
import ImageToBase64 from './image/ImageToBase64';
import Base64ToImage from './image/Base64ToImage';
import Code from './code/Code';
import JSONEditor from './json/JSONEditor';
import Markdown from './markdown/Markdown';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function App() {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          // variant="scrollable" // 可滚动的
          // scrollButtons="on"  // 滚动按钮
          centered
          aria-label="scrollable force tabs example"
        >
          <Tab label="时间戳转换"  {...a11yProps(0)} />
          <Tab label="图片查看器"  {...a11yProps(1)} />
          <Tab label="图片转Base64" {...a11yProps(2)} />
          <Tab label="Base64转图片" {...a11yProps(3)} />
          <Tab label="字符串编解码"  {...a11yProps(4)} />
          <Tab label="JSON格式化"  {...a11yProps(5)} />
          <Tab label="MarkDown"  {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Timestamp></Timestamp>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImageViewer></ImageViewer>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ImageToBase64></ImageToBase64>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Base64ToImage></Base64ToImage>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Code></Code>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <JSONEditor></JSONEditor>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <Markdown></Markdown>
      </TabPanel>
    </div>
  )
}
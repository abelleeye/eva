import React, { Component } from 'react'
import moment from 'moment';
import 'moment/locale/zh-cn';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    transform: 'transform',
    width: '100%',
  },
});

class Timestamp extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      ...this.now(),
      timeStatus: '',
      timestamp2StringInput: '',
      timestamp2StringOutput: '',
      string2TimestampInput: '',
      string2TimestampOutput: '',
    };
    this.toggleTickStatus = this.toggleTickStatus.bind(this);
    this.timestamp2StringHandleChange = this.timestamp2StringHandleChange.bind(this);
    this.string2TimestampHandleChange = this.string2TimestampHandleChange.bind(this);
    this.timestamp2String = this.timestamp2String.bind(this);
    this.string2Timestamp = this.string2Timestamp.bind(this);
  }

  now() {
    return {
      now_format: moment().format('YYYY-MM-DD HH:mm:ss:SSS'),
      now_unix: moment().unix(),
      now_timestamp: moment().valueOf()
    }
  }

  tick() {
    this.setState(() => (this.now()));
  }

  openTick() {
    this.interval = setInterval(() => this.tick(), 1000);
    this.setState({
      timeStatus: '暂停'
    })
  }

  stopTick() {
    clearInterval(this.interval);
    this.interval = undefined;
    this.setState({
      timeStatus: '开启'
    })
  }

  toggleTickStatus() {
    this.interval ? this.stopTick() : this.openTick();
  }

  timestamp2StringHandleChange(event) {
    this.setState({
      timestamp2StringInput: event.target.value
    })
  }

  string2TimestampHandleChange(event) {
    this.setState({
      string2TimestampInput: event.target.value
    })
  }

  timestamp2String() {
    const input = Number.parseInt(this.state.timestamp2StringInput);
    if (isNaN(input)) {
      this.setState({
        timestamp2StringOutput: '格式: 10/13时间戳'
      })
      return;
    }
    if (input) {
      if (input.length === 10) {
        this.setState({
          timestamp2StringOutput: moment.unix(input).format('YYYY-MM-DD HH:mm:ss:SSS')
        })
        return;
      }
      if (input.length === 13) {
        this.setState({
          timestamp2StringOutput: moment(input).format('YYYY-MM-DD HH:mm:ss:SSS')
        })
        return;
      }
    }
    this.setState({
      timestamp2StringOutput: '格式: 10/13时间戳'
    })
  }

  string2Timestamp() {
    const input = this.state.string2TimestampInput;
    if (moment(input, 'YYYY-MM-DD', true).isValid()) {
      this.setState({
        string2TimestampOutput: moment(input, 'YYYY-MM-DD').unix()
      })
      return;
    }

    if (moment(input, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
      this.setState({
        string2TimestampOutput: moment(input, 'YYYY-MM-DD HH:mm:ss').unix()
      })
      return;
    }

    if (moment(input, 'YYYY-MM-DD HH:mm:ss:SSS', true).isValid()) {
      this.setState({
        string2TimestampOutput: moment(input, 'YYYY-MM-DD HH:mm:ss:SSS').valueOf()
      })
      return;
    }

    this.setState({
      string2TimestampOutput: '格式: YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | YYYY-MM-DD HH:mm:ss:SSS'
    })
  }

  componentDidMount() {
    this.openTick();
  }

  componentWillUnmount() {
    this.stopTick();
  }

  render() {
    const classes = () => useStyles();

    return (
      <div className={classes.root}>
        <Grid 
        container 
        direction="column"
        justify="center"
        alignItems="center"
        spacing={3}>
          <Grid style={{marginTop: '30px'}}
          item 
          xs={12}>
            <TextField
            label="当前北京时间"
            style={{width: '11.5rem'}}
            value={this.state.now_format}
            InputProps={{
              readOnly: true,
            }}
            />
            <Button style={{margin: '1rem'}} onClick={this.toggleTickStatus} size="small" variant="outlined" color="primary">
              {this.state.timeStatus}
            </Button>
            <TextField
              label="当前的时间戳"
              style={{width: '14rem'}}
              value={this.state.now_unix + ' / ' + this.state.now_timestamp}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid 
          item 
          xs={12}>
            <TextField
            label="10/13时间戳"
            style={{width: '11.5rem'}}
            onChange={this.timestamp2StringHandleChange}
            />
            <Button style={{margin: '1rem'}} onClick={this.timestamp2String} size="small" variant="outlined" color="primary">
              转换
            </Button>
            <TextField
              label="北京时间"
              style={{width: '14rem'}}
              InputProps={{
                readOnly: true,
              }}
              value={this.state.timestamp2StringOutput}
            />
          </Grid>

          <Grid 
          item 
          xs={12}>
            <TextField
            id="standard-textarea"
            label="北京时间"
            style={{width: '11.5rem'}}
            onChange={this.string2TimestampHandleChange}
            />
            <Button style={{margin: '1rem'}} onClick={this.string2Timestamp} size="small" variant="outlined" color="primary">
              转换
            </Button>
            <TextField
            id="standard-textarea1"
            label="10/13时间戳"
            style={{width: '14rem'}}
            InputProps={{
              readOnly: true,
            }}
            value={this.state.string2TimestampOutput}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}
  
export default Timestamp;
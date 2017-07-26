const View = require('../View');
const { getConfig } = require('../../service/hue')
/**
 * Responsible for spawning a child window,
 * Alerting the user that to getup and press the bridge button
 * Pinging the bridge for 30 seconds until the app receives a successful callback with a username
 * updates the config file with that username.
 */

class Registration extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector, false);
    this.data.selector = 'registration-group-selector'
    this.data = {
      bridgeIp: null,
      userName: null,
      sceneId: null,
      ipDetectionType: '',
      userNameDetectionType: '',
      sceneDetectionType: '',
    }
    this.getInfoFromConfig();
    // rename class to group
    // using bridge (ip)
    // username is ... blah
    // click here to edit username
    // click here to fetch a new username
    // click here to refresh lights
    // refreshing lights will reset the palettes
    // add very explicit error handling
    this.render();
  }
  getInfoFromConfig() {
    const DETECTION_TYPE = 'from settings';
    const config = getConfig();
    if (config) {
      this.data.bridgeIp = config.hostname;
      if (this.data.bridgeIp) {
        this.data.ipDetectionType = DETECTION_TYPE;
      }
      this.data.userName = config.username;
      if (this.data.userName) {
        this.data.userNameDetectionType = DETECTION_TYPE;
      }
      this.data.sceneId = config.sceneId;
      if (this.data.sceneId) {
        this.data.sceneDetectionType = DETECTION_TYPE;
      }
    }
  }
  render() {
    this.generate().then(html => {
      document.querySelector(this.parentSelector).innerHTML = html;
    });
  }
}

module.exports = Registration;

import React      from 'react';
import * as utils from './utils';

export default class AnimakitBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: false,
      winHeight: 0,
    };
  }

  componentWillMount() {
    this.animationResetTO = null;
    this.resizeCheckerRAF = null;

    this.changingProps = [];
    this.useWinResize = false;

    this.init();

    this.listeners = this.getListeners();
  }

  componentDidMount() {
    if (this.useWinResize) this.winResize();

    this.repaint(this.props);

    if (window && this.useWinResize) {
      window.addEventListener('resize', this.listeners.winResize, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.repaint(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !utils.isEqual(nextState, this.state);

    const childrenChanged = !utils.isEqual(nextProps.children, this.props.children);

    const propsChanged = this.changingProps.some(name => nextProps[name] !== this.props[name]);

    return stateChanged || childrenChanged || propsChanged;
  }

  componentWillUpdate() {
    this.cancelResizeChecker();
  }

  componentDidUpdate() {
    this.startResizeChecker();
  }

  componentWillUnmount() {
    this.cancelResizeChecker();
    this.cancelAnimationReset();

    if (window && this.useWinResize) {
      window.removeEventListener('resize', this.listeners.winResize, false);
    }
  }

  getListeners() {
    const listeners = {};

    listeners.checkResize = this.checkResize.bind(this);

    if (this.useWinResize) {
      listeners.winResize = this.winResize.bind(this);
    }

    return listeners;
  }

  getDuration() {
    return this.props.duration;
  }

  getScrollbarWidth() {
    return utils.getScrollbarWidth();
  }

  get3DSupport() {
    return utils.isPropertySupported('perspective', '1px') &&
           utils.isPropertySupported('transform-style', 'preserve-3d');
  }

  init() {

  }

  winResize() {
    this.setState({
      winHeight: window ? window.innerHeight : 800,
    });
  }

  startResizeChecker() {
    if (typeof requestAnimationFrame === 'undefined') return;
    this.resizeCheckerRAF = requestAnimationFrame(this.listeners.checkResize);
  }

  cancelResizeChecker() {
    if (typeof requestAnimationFrame === 'undefined') return;
    if (this.resizeCheckerRAF) cancelAnimationFrame(this.resizeCheckerRAF);
  }

  startAnimationReset() {
    this.animationResetTO = setTimeout(() => {
      this.setState({
        animation: false,
      });
    }, this.getDuration());
  }

  cancelAnimationReset() {
    if (this.animationResetTO) clearTimeout(this.animationResetTO);
  }

  checkResize() {
    this.cancelResizeChecker();

    if (this.softRepaint) {
      this.softRepaint();
    } else {
      this.repaint(this.props);
    }

    this.startResizeChecker();
  }

  repaint(/* nextProps */) {
    const state = {};

    this.applyState(state);
  }

  applyState(state) {
    if (!Object.keys(state).length) return;

    if (state.animation) {
      this.cancelAnimationReset();
    }

    this.setState(state);

    if (state.animation) {
      this.startAnimationReset();
    }
  }

  render() {
    return false;
  }
}

AnimakitBase.propTypes = {
  children: React.PropTypes.any,
  duration: React.PropTypes.number,
};

AnimakitBase.defaultProps = {
  duration: 500,
};

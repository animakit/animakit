import { isEqual as lodashIsEqual } from 'lodash';

export function isPropertySupported(name, value) {
  const propName = name;

  const element = document.createElement('p');
  document.body.insertBefore(element, null);

  element.style[propName] = value;

  const propValue = window
    .getComputedStyle(element, null)
    .getPropertyValue(propName);

  document.body.removeChild(element);

  return propValue === value;
}

export function genUniqueString(len = 5) {
  return (Math.random() * Math.pow(36, len) << 0).toString(36);
}

export function isEqual(prevState, nextState) {
  return lodashIsEqual(prevState, nextState);
}

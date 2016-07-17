import { isEqual as lodashIsEqual } from 'lodash';

export function isEqual(prevState, nextState) {
  return lodashIsEqual(prevState, nextState);
}

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

export function getScrollbarWidth() {
  const outerDiv = document.createElement('div');
  const innerDiv = document.createElement('div');

  outerDiv.style.overflow = 'scroll';

  document.body.insertBefore(outerDiv, null);
  outerDiv.insertBefore(innerDiv, null);

  const scrollbarWidth = outerDiv.offsetWidth - innerDiv.offsetWidth;

  document.body.removeChild(outerDiv);
  
  return scrollbarWidth;
}

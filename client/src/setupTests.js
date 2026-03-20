// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock canvas for testing environment
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  fillStyle: '',
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  strokeStyle: '',
  lineWidth: 1,
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
}));

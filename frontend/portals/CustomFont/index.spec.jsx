import React from 'react';
import { mount } from 'enzyme';
import CustomFont from './index';

/* eslint-disable-next-line react/prop-types */
jest.mock('react-helmet', () => ({ children }) => (<div>{children}</div>));

let mockedConfig = {};
jest.mock('../../getConfig', () => () => mockedConfig);

const mockedGlamorGlobal = jest.fn();
jest.mock('glamor', () => ({
  css: {
    global: (...args) => mockedGlamorGlobal(...args),
  },
}));

const mockedLogger = jest.fn();
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: (...args) => mockedLogger(...args),
  },
}));

describe('Custom Fonts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  /**
   * Tests component which should return early.
   */
  const testExpectEmpty = () => {
    const component = mount(<CustomFont />);
    expect(component.html()).toBe(null);
    expect(mockedLogger).toHaveBeenCalled();
  };

  it('should render nothing and log error when configuration is missing', () => {
    testExpectEmpty();
  });

  it('should render nothing and log error when url is empty', () => {
    mockedConfig.url = '';
    mockedConfig.props = { one: 1 };
    testExpectEmpty();
  });

  it('should render nothing and log error when props are missing', () => {
    mockedConfig = {
      url: 'foo',
    };
    testExpectEmpty();
  });

  it('should render component when url is given and empty props', () => {
    mockedConfig = {
      url: 'foo',
      rules: {},
    };
    const component = mount(<CustomFont />);
    expect(component.find('link').exists()).toBe(true);
    expect(component.find('link').at(0).props().href).toBe('foo');
    expect(mockedLogger).not.toHaveBeenCalled();
    expect(mockedGlamorGlobal).not.toHaveBeenCalled();
  });

  it('should render component when url and props are given', () => {
    mockedConfig = {
      url: 'foo',
      rules: {
        one: 1,
      },
    };
    const component = mount(<CustomFont />);
    expect(component.find('link').exists()).toBe(true);
    expect(component.find('link').at(0).props().href).toBe('foo');
    expect(mockedLogger).not.toHaveBeenCalled();
    expect(mockedGlamorGlobal).toHaveBeenCalledWith('body', {
      one: 1,
    });
  });
});

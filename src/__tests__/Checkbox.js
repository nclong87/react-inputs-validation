import React from 'react';
import PropTypes from 'prop-types';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Checkbox from '../js/Inputs/Checkbox.js';

class CheckboxWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.checked, hasError: props.hasError };
  }

  render() {
    const { validationOption } = this.props;
    const { value, hasError } = this.state;
    return (
      <div id="wrapper">
        <Checkbox
          tabIndex="1"
          id={'Checkbox'}
          name="Checkbox"
          type="text"
          value={value}
          validationCallback={res => {
            this.setState({ hasError: res });
          }}
          onChange={res => {
            this.setState({ value: res });
          }}
          onBlur={() => {}}
          validationOption={validationOption}
        />
        <label id="value">{value ? 'checked' : 'not checked'}</label>
        <label id="hasError">{hasError ? 'has error' : 'not has error'}</label>
      </div>
    );
  }
}

CheckboxWrapper.defaultProps = {
  checked: false,
  hasError: false,
  validationOption: {}
};

CheckboxWrapper.propTypes = {
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hasError: PropTypes.bool,
  validationOption: PropTypes.object
};

configure({ adapter: new Adapter() });
const getWrapper = (value, validationOption, hasError) => {
  return mount(<CheckboxWrapper value={value} validationOption={validationOption} hasError={hasError} />);
};

describe('Checkbox component', () => {
  it('[validationOption.required = true]: Should return has error because of it is not checked', () => {
    const result = 'not checked';
    const checked = false;
    const hasError = false;
    const validationOption = {
      check: true,
      required: true
    };
    const wrapper = getWrapper(checked, validationOption, hasError);
    const $input = wrapper.find('.checkbox__box');
    const $labelValue = wrapper.find('#value');
    const $labelHasError = wrapper.find('#hasError');
    $input.simulate('focus');
    $input.simulate('blur');
    expect($labelValue.text()).toEqual(result);
    expect($labelHasError.text()).toEqual('has error');
  });

  it('[validationOption.required = false]:Should return not has error when it is not checked because of it is not required', () => {
    const result = 'not checked';
    const checked = false;
    const hasError = false;
    const validationOption = {
      check: true,
      required: false
    };
    const wrapper = getWrapper(checked, validationOption, hasError);
    const $input = wrapper.find('.checkbox__box');
    const $labelValue = wrapper.find('#value');
    const $labelHasError = wrapper.find('#hasError');
    $input.simulate('focus');
    $input.simulate('blur');
    expect($labelValue.text()).toEqual(result);
    expect($labelHasError.text()).toEqual('not has error');
  });

  it('[check]: Should call handleCheckEnd when empty', () => {
    let value = '';
    const wrapper = mount(
      <Checkbox
        value={value}
        onChange={() => {}}
        validationOption={{
          check: true,
          required: true
        }}
      />
    );
    const instance = wrapper.instance();
    instance.handleCheckEnd = jest.fn();
    instance.check(value);
    expect(instance.handleCheckEnd).toHaveBeenCalled();
  });

  it('[pageClick]: Should not call onBlur', () => {
    let value = '';
    const wrapper = mount(
      <Checkbox
        value={value}
        onChange={() => {}}
        validationOption={{
          check: true,
          required: true
        }}
      />
    );
    const instance = wrapper.instance();
    instance.onBlur = jest.fn();
    instance.pageClick({target: null});
    expect(instance.onBlur).not.toHaveBeenCalled();
  });
});

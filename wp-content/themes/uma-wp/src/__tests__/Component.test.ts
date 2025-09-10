import { Component } from '../js/app/core/Component';

// Mock DOM element
const mockElement = {
  querySelector: jest.fn(),
  addEventListener: jest.fn(),
} as unknown as HTMLElement;

interface TestOptions {
  testProp: string;
  count: number;
}

interface TestState {
  isActive: boolean;
  value: string;
}

class TestComponent extends Component<TestOptions, TestState> {
  get defaultOptions() {
    return {
      testProp: 'default',
      count: 0,
    };
  }

  bindEvents() {
    // Test implementation
  }

  render() {
    // Test implementation
  }
}

describe('Component', () => {
  test('should merge default options with provided options', () => {
    const component = new TestComponent(mockElement, { testProp: 'custom' });

    expect(component.options.testProp).toBe('custom');
    expect(component.options.count).toBe(0); // default value
  });

  test('should update state correctly', () => {
    const component = new TestComponent(mockElement);
    const mockStateChange = jest.spyOn(component, 'onStateChange');

    component.setState({ isActive: true });

    expect(component.state.isActive).toBe(true);
    expect(mockStateChange).toHaveBeenCalled();
  });

  test('should handle partial state updates', () => {
    const component = new TestComponent(mockElement);

    component.setState({ isActive: true, value: 'test' });
    component.setState({ isActive: false }); // Only update isActive

    expect(component.state.isActive).toBe(false);
    expect(component.state.value).toBe('test'); // Should remain unchanged
  });
});

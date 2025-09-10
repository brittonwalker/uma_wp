import EventBus from '../js/app/core/EventBus';

describe('EventBus', () => {
  beforeEach(() => {
    // Clear all event listeners between tests
    EventBus['events'].clear();
  });

  test('should emit and receive events', () => {
    const mockCallback = jest.fn();

    EventBus.on('test-event', mockCallback);
    EventBus.emit('test-event', { data: 'test' });

    expect(mockCallback).toHaveBeenCalledWith({ data: 'test' });
  });

  test('should handle multiple listeners for same event', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    EventBus.on('same-event', callback1);
    EventBus.on('same-event', callback2);
    EventBus.emit('same-event', 'shared-data');

    expect(callback1).toHaveBeenCalledWith('shared-data');
    expect(callback2).toHaveBeenCalledWith('shared-data');
  });

  test('should remove specific event listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    EventBus.on('test-event', callback1);
    EventBus.on('test-event', callback2);
    EventBus.off('test-event', callback1);
    EventBus.emit('test-event', 'data');

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith('data');
  });

  test('should handle emitting to non-existent event', () => {
    expect(() => {
      EventBus.emit('non-existent', 'data');
    }).not.toThrow();
  });

  test('should handle removing non-existent listener', () => {
    const callback = jest.fn();
    expect(() => {
      EventBus.off('non-existent', callback);
    }).not.toThrow();
  });
});

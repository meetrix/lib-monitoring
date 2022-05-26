import { generateFakeState } from './fakeStateGenerator';

describe('FakeStateGenerator', () => {
  it('should generate fake state', () => {
    const state = generateFakeState({
      component: 'camera',
      status: 'running',
      subComponent: 'p480',
    });

    expect(state).toEqual({
      key: 'camera',
      label: 'Checking your camera',
      status: 'running',
      subOrder: ['p240', 'p480', 'p720', 'generic'],
      subMessages: {
        p240: [
          'Procedure 1 completed successfully.',
          'Procedure 2 completed successfully.',
          'Procedure 3 completed successfully.',
        ],
        p480: ['Procedure 1 completed successfully.', 'Procedure 2 completed successfully.'],
      },
      subStatus: { p240: 'success', p480: 'success' },
      message: 'Checking your camera',
    });
  });
});

import deriveOverallStatus, { Strategy } from './deriveOverallStatus';

describe('deriveOverallStatus', () => {
  describe('when the strategy is AND', () => {
    // NOT USED
    it('should return the overall status as success when the list is empty', () => {
      expect(deriveOverallStatus([])).toBe('success');
    });

    it('should return the overall status as failure when any has failed and none is running or empty', () => {
      expect(deriveOverallStatus(['failure'])).toBe('failure');
      expect(deriveOverallStatus(['failure', 'success'])).toBe('failure');
    });

    it('should return the overall status as success when all are success', () => {
      expect(deriveOverallStatus(['success'])).toBe('success');
      expect(deriveOverallStatus(['success', 'success'])).toBe('success');
    });

    it('should return the overall status as running when one is empty, others are not', () => {
      expect(deriveOverallStatus(['success', ''])).toBe('running');
      expect(deriveOverallStatus(['failure', ''])).toBe('running');
      expect(deriveOverallStatus(['failure', 'success', ''])).toBe('running');
      expect(deriveOverallStatus(['failure', 'success', 'running', ''])).toBe('running');
    });

    it('should return the overall status as running when one is running', () => {
      expect(deriveOverallStatus(['', 'running'])).toBe('running');
      expect(deriveOverallStatus(['success', 'running'])).toBe('running');
      expect(deriveOverallStatus(['failure', 'running'])).toBe('running');
      expect(deriveOverallStatus(['failure', 'success', 'running'])).toBe('running');
    });

    it('should return the overall status as empty when all are empty', () => {
      expect(deriveOverallStatus(['', ''])).toBe('');
    });

    it('should let the optional items affect the overall status when any of them is empty or running', () => {
      expect(deriveOverallStatus([''], Strategy.AND, ['running'])).toBe('running');
      expect(deriveOverallStatus(['running'], Strategy.AND, ['running'])).toBe('running');
      expect(deriveOverallStatus(['success'], Strategy.AND, ['running'])).toBe('running');
      expect(deriveOverallStatus(['failure'], Strategy.AND, ['running'])).toBe('running');

      expect(deriveOverallStatus([''], Strategy.AND, [''])).toBe('');
      expect(deriveOverallStatus(['running'], Strategy.AND, [''])).toBe('running');
      expect(deriveOverallStatus(['success'], Strategy.AND, [''])).toBe('running');
      expect(deriveOverallStatus(['failure'], Strategy.AND, [''])).toBe('running');
    });

    it('should not let the optional items affect the overall status unless mandatory ones are empty when they have completed', () => {
      expect(deriveOverallStatus([''], Strategy.AND, ['success'])).toBe('running');
      expect(deriveOverallStatus(['running'], Strategy.AND, ['success'])).toBe('running');
      expect(deriveOverallStatus(['success'], Strategy.AND, ['success'])).toBe('success');
      expect(deriveOverallStatus(['failure'], Strategy.AND, ['success'])).toBe('failure');

      expect(deriveOverallStatus([''], Strategy.AND, ['failure'])).toBe('running');
      expect(deriveOverallStatus(['running'], Strategy.AND, ['failure'])).toBe('running');
      expect(deriveOverallStatus(['success'], Strategy.AND, ['failure'])).toBe('success');
      expect(deriveOverallStatus(['failure'], Strategy.AND, ['failure'])).toBe('failure');
    });
  });

  describe('when the strategy is OR', () => {
    // NOT USED
    it('should return the overall status as success when the list is empty', () => {
      expect(deriveOverallStatus([], Strategy.OR)).toBe('');
    });

    it('should return the overall status as success when any has succeeded and none is running or empty', () => {
      expect(deriveOverallStatus(['success'], Strategy.OR)).toBe('success');
      expect(deriveOverallStatus(['failure', 'success'], Strategy.OR)).toBe('success');
    });

    it('should return the overall status as failure when all are failed', () => {
      expect(deriveOverallStatus(['failure'], Strategy.OR)).toBe('failure');
      expect(deriveOverallStatus(['failure', 'failure'], Strategy.OR)).toBe('failure');
    });

    it('should return the overall status as running when one is empty, others are not', () => {
      expect(deriveOverallStatus(['success', ''], Strategy.OR)).toBe('running');
      expect(deriveOverallStatus(['failure', ''], Strategy.OR)).toBe('running');
      expect(deriveOverallStatus(['failure', 'success', ''], Strategy.OR)).toBe('running');
      expect(deriveOverallStatus(['failure', 'success', 'running', ''], Strategy.OR)).toBe(
        'running',
      );
    });

    it('should return the overall status as running when one is running', () => {
      expect(deriveOverallStatus(['', 'running'], Strategy.OR)).toBe('running');
      expect(deriveOverallStatus(['success', 'running'], Strategy.OR)).toBe('running');
      expect(deriveOverallStatus(['failure', 'running'], Strategy.OR)).toBe('running');
      expect(deriveOverallStatus(['failure', 'success', 'running'], Strategy.OR)).toBe('running');
    });

    it('should return the overall status as empty when all are empty', () => {
      expect(deriveOverallStatus(['', ''], Strategy.OR)).toBe('');
    });
  });
});

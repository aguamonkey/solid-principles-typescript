import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './good-example/UserProfile';
import { userApi } from './good-example/services/userApi';
import { userValidator } from './good-example/services/userValidator';

describe('Single Responsibility Principle', () => {
  describe('Good Implementation', () => {
    it('should separate concerns properly', () => {
      // Test that each class has a single responsibility
      expect(userValidator.validate).toBeDefined();
      expect(userApi.getUser).toBeDefined();
      
      // Validator should only validate
      const validationResult = userValidator.validate({ email: 'test@test.com' });
      expect(Array.isArray(validationResult)).toBe(true);
    });

    it('should allow independent testing of each component', async () => {
      // Mock API calls
      vi.spyOn(userApi, 'getUser').mockResolvedValue({
        id: '1',
        name: 'Test User',
        email: 'test@test.com'
      });

      render(<UserProfile />);
      
      // Component should only handle presentation
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('Bad Implementation', () => {
    it('should demonstrate violation of SRP', () => {
      // The bad example has multiple responsibilities
      // This test would show how difficult it is to test
    });
  });
});

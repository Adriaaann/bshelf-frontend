import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { WrappedApp, App } from './App';

describe('App', () => {
   it('Renders hello', () => {
      render(<WrappedApp />);

      expect(
         screen.getByRole('heading', {
            level: 1,
         })
      ).toHaveTextContent('Hello');
   });
   it('Renders not found if invalid path', () => {
      render(
         <MemoryRouter initialEntries={['/non-existent-route']}>
            <App />
         </MemoryRouter>
      );

      expect(
         screen.getByRole('heading', {
            level: 1,
         })
      ).toHaveTextContent('Not Found');
   });
});

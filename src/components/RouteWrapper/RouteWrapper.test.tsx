import React from 'react';
import RouteWrapper from './RouteWrapper';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('render', () => {
  it('should render children', () => {
    render(
      <RouteWrapper>
        <div data-testid="child" />
      </RouteWrapper>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

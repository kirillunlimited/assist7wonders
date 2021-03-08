import React from 'react';
import Layout from './Layout';
import { render, screen } from '@testing-library/react';

describe('render', () => {
  it('should render children', () => {
    render(
      <Layout>
        <div data-testid="child" />
      </Layout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

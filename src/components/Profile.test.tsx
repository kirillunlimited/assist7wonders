import React from 'react';
import Profile from './Profile';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('render', () => {
  it('should render portrait and name', () => {
    render(<Profile name={'John Doe'} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

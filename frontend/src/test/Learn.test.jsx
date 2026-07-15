import { fireEvent, render, screen, within } from '@testing-library/react';
import Learn from '../pages/Learn';

function openModule(name) {
  const heading = screen.getByRole('heading', { name });
  fireEvent.click(heading.closest('summary'));
}

it('expands and collapses lesson cards with a pointer', () => {
  render(<Learn />);
  const button = screen.getAllByRole('button', { name: /Definition/ })[0];
  expect(button).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByLabelText('What is DNA?: Definition full explanation')).toBeInTheDocument();
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'false');
});

it.each(['Enter', ' '])('toggles a lesson card with the %s key', (key) => {
  render(<Learn />);
  const button = screen.getAllByRole('button', { name: /Why It Matters/ })[0];
  fireEvent.keyDown(button, { key });
  expect(button).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(button, { key });
  expect(button).toHaveAttribute('aria-expanded', 'false');
});

it('renders the complete FASTA example as text', () => {
  render(<Learn />);
  openModule('What is a FASTA file?');
  const module = screen.getByRole('heading', { name: 'What is a FASTA file?' }).closest('details');
  const button = within(module).getByRole('button', { name: /Small Example/ });
  fireEvent.click(button);
  expect(screen.getByLabelText('What is a FASTA file?: Small Example full explanation'))
    .toHaveTextContent('>sample ATGC');
});

it('shows grouped authoritative sources with safe external-link attributes', () => {
  render(<Learn />);
  expect(screen.getByRole('heading', { name: 'Sources & Further Reading' })).toBeInTheDocument();
  const sources = document.getElementById('sources');
  const externalLinks = within(sources).getAllByRole('link');
  expect(externalLinks).toHaveLength(11);
  externalLinks.forEach((link) => {
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

it('keeps Learn search working with the revised module structure', () => {
  render(<Learn />);
  fireEvent.change(screen.getByLabelText('Search learning concepts'), { target: { value: 'ambiguity' } });
  expect(screen.getByRole('heading', { name: 'Sequence ambiguity' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'What is DNA?' })).not.toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

const routes = ['/', '/lab', '/learn', '/docs', '/about'];

it.each(routes)('shows creator attribution in the global footer on %s', (route) => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByText('Built by', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Creator and project links' })).toBeInTheDocument();
});

it('shows the creator signature on the homepage', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByLabelText('Creator attribution')).toHaveTextContent(
    'Created by Avanthika Ashokkumar, Rutgers University–New Brunswick',
  );
});

it('shows the founder section and connection links on the About page', () => {
  render(
    <MemoryRouter initialEntries={['/about']}>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'About the Founder' })).toBeInTheDocument();
  const founderLinks = screen.getByRole('navigation', { name: 'Avanthika Ashokkumar links' });
  expect(founderLinks).toHaveTextContent('LinkedIn');
  expect(founderLinks).toHaveTextContent('GitHub');
  expect(founderLinks).toHaveTextContent('GenomeLens repository');
});

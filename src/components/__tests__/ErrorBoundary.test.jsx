import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';

function AlwaysCrash() {
  throw new Error('boom');
}

function CrashOnce({ crash }) {
  if (crash) {
    throw new Error('fail once');
  }
  return <div>Recovered Content</div>;
}

describe('ErrorBoundary', () => {
  it('renders default fallback UI when child crashes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <AlwaysCrash />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar Novamente' })).toBeInTheDocument();
  });

  it('calls onError callback with error details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <AlwaysCrash />
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });

    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('supports custom fallback and reset flow', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    function Container() {
      const [crash, setCrash] = useState(true);

      return (
        <ErrorBoundary
          fallback={(_error, reset) => (
            <button
              onClick={() => {
                setCrash(false);
                reset();
              }}
            >
              Recover
            </button>
          )}
        >
          <CrashOnce crash={crash} />
        </ErrorBoundary>
      );
    }

    render(<Container />);

    fireEvent.click(screen.getByRole('button', { name: 'Recover' }));

    await waitFor(() => {
      expect(screen.getByText('Recovered Content')).toBeInTheDocument();
    });
  });
});

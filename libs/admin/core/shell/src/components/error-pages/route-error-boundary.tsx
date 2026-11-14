import { Component } from 'react';

import { CrashPage } from './crash-page';

import type { ReactNode } from 'react';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  fullScreen?: boolean;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches a render crash below it and shows the 500 page instead of a white screen.
 * Give it a `key` (for example the path) so navigation clears the error.
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  override state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <CrashPage
          fullScreen={this.props.fullScreen}
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

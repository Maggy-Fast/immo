import React from 'react';

const ErrorBoundary = ({ children, fallback }) => {
  return (
    <React.Suspense fallback={fallback || <div>Chargement...</div>}>
      {children}
    </React.Suspense>
  );
};

export default ErrorBoundary;

export const loginPath = '/login';

const returnToParameter = 'returnTo';

/** Login URL that brings the user back to where the session ended. */
export const buildLoginPath = (returnTo: string): string =>
  returnTo && returnTo !== '/' && !returnTo.startsWith(loginPath)
    ? `${loginPath}?${returnToParameter}=${encodeURIComponent(returnTo)}`
    : loginPath;

/** Accepts only in-app paths, so a crafted link cannot send the user to another site. */
export const readReturnPath = (search: string, fallback: string): string => {
  const value = new URLSearchParams(search).get(returnToParameter);

  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')
    ? value
    : fallback;
};

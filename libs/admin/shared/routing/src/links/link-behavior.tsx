import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import type { Components, Theme } from '@mui/material/styles';
import type { AnchorHTMLAttributes } from 'react';

type LinkBehaviorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const externalHref = /^([a-z][a-z\d+.-]*:|\/\/)/i;

/**
 * MUI links and buttons with `href` navigate through the router, so shared and domain UI
 * libraries stay free of router imports. External, new-tab, and download links stay plain anchors.
 */
export const LinkBehavior = forwardRef<HTMLAnchorElement, LinkBehaviorProps>(function LinkBehavior(
  { children, href, ...props },
  ref,
) {
  if (externalHref.test(href) || props.target === '_blank' || props.download !== undefined) {
    return (
      <a href={href} ref={ref} {...props}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink ref={ref} to={href} {...props}>
      {children}
    </RouterLink>
  );
});

/** Theme `components` entries that route every MUI link and `href` button through `LinkBehavior`. */
export const routerLinkComponents = {
  MuiButtonBase: { defaultProps: { LinkComponent: LinkBehavior } },
  MuiLink: { defaultProps: { component: LinkBehavior } },
} satisfies Components<Theme>;

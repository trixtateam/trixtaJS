import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectHasTrixtaRoleAccessForRoles } from '../../selectors';
import { TrixtaAuthProps, TrixtaState } from '../../types/common';

const TrixtaAuth = ({
  children,
  roles,
  ...rest
}: TrixtaAuthProps & { children: React.ReactNode }): JSX.Element | null => {
  const roleAccessSelector = useMemo(makeSelectHasTrixtaRoleAccessForRoles, []);
  const rolesArr = useMemo(
    () => (Array.isArray(roles) ? roles : roles ? [roles] : []),
    [roles],
  );
  const hasRoleAccess = useSelector((state: { trixta: TrixtaState }) =>
    roleAccessSelector(state, { roles: rolesArr }),
  );

  if (!hasRoleAccess) return null;

  if (typeof children === 'function') {
    return children(rest);
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, rest);
  }
  return null;
};
export default TrixtaAuth;

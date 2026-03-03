import useAuth from '../hooks/useAuth';

const RoleBasedRender = ({ allowedRoles, children, fallback = null }) => {
  const { auth } = useAuth();

  if (!auth?.roles) {
    return fallback;
  }

  if (allowedRoles.includes(auth.roles)) {
    return children;
  }

  return fallback;
};

export default RoleBasedRender;

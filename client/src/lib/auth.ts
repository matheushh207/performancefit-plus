import { trpc } from "./trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const getLoginUrl = () => {
    const redirectUrl = window.location.origin;
    return `/api/oauth/login?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return {
    user,
    isLoading,
    logout,
    getLoginUrl,
  };
}
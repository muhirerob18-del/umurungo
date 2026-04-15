import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Role, createActor } from "../backend";
import type { User } from "../backend";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const isAuthenticated = loginStatus === "success" && !!identity;

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<User | null>({
    queryKey: ["profile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: isAuthenticated && !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = profile?.role === Role.Admin;

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
  };

  return {
    identity,
    isAuthenticated,
    isAdmin,
    profile,
    profileLoading,
    loginStatus,
    login: handleLogin,
    logout: handleLogout,
    refetchProfile,
  };
}

"use server";

import { isAuthenticated } from "@/lib/auth/auth-check";
import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export interface UserProfileResponse {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  accounts: {
    providerId: string;
    createdAt: string;
  }[];
  stats: {
    ownedWorkspaces: number;
    memberWorkspaces: number;
    activeSessions: number;
  };
}

export async function getUserProfile(): Promise<UserProfileResponse | null> {
  try {
    await isAuthenticated();
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie");
    const serverApi =
      process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000/api";
    const response = await fetch(`${serverApi}/user/profile`, {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as UserProfileResponse;
  } catch (error) {
    if (
      isRedirectError(error) ||
      (error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

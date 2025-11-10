"use client";

// Core
import React from "react";
import { useEffect, useState } from "react";

// Libraries
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Higher-order component (HOC) to protect a page or component.
 * It checks if a user is authenticated by looking for a token in localStorage.
 * If the token exists, it renders the wrapped component.
 * If not, it redirects the user to the login page.
 *
 * @param WrappedComponent - The React component to wrap and protect
 * @returns A new component that only renders if the user is authenticated
 */
const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const router: AppRouterInstance = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
      const token: string | null = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
    }, [router]);

    const content: React.ReactElement | null = isAuthenticated ? <WrappedComponent {...props} /> : null;

    return content;
  };

  return WithAuthComponent;
};

export default withAuth;

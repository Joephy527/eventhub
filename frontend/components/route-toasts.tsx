"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export function RouteToasts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lastShown = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    const signature = `${error ?? ""}-${success ?? ""}`;

    if (!signature || signature === lastShown.current) return;

    if (error) {
      if (error === "unauthorized") {
        toast.error("You need organizer access to view that page.");
      } else {
        toast.error(error);
      }
    } else if (success) {
      toast.success(success);
    }

    lastShown.current = signature;
    // strip query params after showing
    router.replace(pathname);
  }, [pathname, router, searchParams]);

  return null;
}

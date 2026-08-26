"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Landing } from "@/components/Landing";
import { useApp } from "@/components/AppProvider";
import { isLocalUid } from "@/lib/identity";
import { WRITE_HREF } from "@/lib/nav";

export default function HomePage() {
  const { profile } = useApp();
  const router = useRouter();
  const guest = isLocalUid(profile?.uid);

  useEffect(() => {
    if (profile && !guest) router.replace(WRITE_HREF);
  }, [profile, guest, router]);

  if (profile && !guest) return null;
  return <Landing />;
}

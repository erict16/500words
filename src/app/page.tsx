"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Landing } from "@/components/Landing";
import { useApp } from "@/components/AppProvider";
import { isLocalUid } from "@/lib/identity";
import { WRITE_HREF, didLeaveWrite } from "@/lib/nav";

export default function HomePage() {
  const { profile } = useApp();
  const router = useRouter();
  const guest = isLocalUid(profile?.uid);
  const [ready, setReady] = useState(false);
  const [leftWrite, setLeftWrite] = useState(false);

  useLayoutEffect(() => {
    setLeftWrite(didLeaveWrite());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (profile && !guest && !leftWrite) router.replace(WRITE_HREF);
  }, [profile, guest, leftWrite, ready, router]);

  if (profile && !guest && ready && !leftWrite) return null;
  return <Landing />;
}

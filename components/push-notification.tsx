"use client";
import { useEffect } from "react";

export function PushNotification() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  const subscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    const reg = await navigator.serviceWorker.ready;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY });
    await fetch("/api/push/subscribe", { method: "POST", body: JSON.stringify(sub) });
  };

  return <button onClick={subscribe} className="btn-primary">Включить уведомления</button>;
}

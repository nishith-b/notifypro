import { useEffect, useMemo, useState } from "react";
import Card from "../components/common/Card";
import Toggle from "../components/common/Toggle";
import Button from "../components/common/Button";

export default function Dashboard() {
  const [online, setOnline] = useState(true);
  const [notify, setNotify] = useState({
    email: false,
    whatsapp: false,
    push: false,
    inapp: true,
  });

  useEffect(() => {
    if (online) {
      setNotify((n) => ({
        email: false,
        whatsapp: false,
        push: false,
        inapp: n.inapp,
      }));
    } else {
      setNotify((n) => ({ ...n, inapp: false }));
    }
  }, [online]);

  const visibleToggles = useMemo(() => {
    if (online) return [{ key: "inapp", label: "In-app" }];
    return [
      { key: "email", label: "Email" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "push", label: "Push notification" },
    ];
  }, [online]);

  const setToggle = (key, val) => setNotify((n) => ({ ...n, [key]: val }));

  return (
    <main className="max-w-5xl px-4 py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Manage your preferences and activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Notification types">
          <div className="flex flex-wrap gap-2">
            {visibleToggles.map((t) => (
              <Toggle
                key={t.key}
                label={t.label}
                checked={!!notify[t.key]}
                onChange={(v) => setToggle(t.key, v)}
              />
            ))}
            {!online && (
              <p className="w-full mt-2 text-sm text-gray-500">
                In-app notifications are available only when user is Online.
              </p>
            )}
          </div>
        </Card>

        <Card title="User activity">
          <div className="flex items-center gap-3">
            <Button
              variant={online ? "primary" : "ghost"}
              onClick={() => setOnline(true)}
            >
              Online
            </Button>
            <Button
              variant={!online ? "primary" : "ghost"}
              onClick={() => setOnline(false)}
            >
              Offline
            </Button>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {online
              ? "You are currently marked as Online."
              : "You are currently marked as Offline."}
          </p>
        </Card>
      </div>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import Card from "../components/common/Card";
import Toggle from "../components/common/Toggle";
import Button from "../components/common/Button";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Dashboard() {
  const [online, setOnline] = useState(true);
  const [notify, setNotify] = useState({
    email: false,
    whatsapp: false,
    push: false,
    inapp: true,
  });

  // Keep notify state in sync with online/offline mode
  useEffect(() => {
    if (online) {
      setNotify((n) => ({
        email: false,
        whatsapp: false,
        push: false,
        inapp: n.inapp, // preserve current inapp toggle
      }));
    } else {
      setNotify((n) => ({ ...n, inapp: false })); // disable inapp when offline
    }
  }, [online]);

  // Visible toggles depend on online state
  const visibleToggles = useMemo(() => {
    if (online) return [{ key: "inapp", label: "In-app" }];
    return [
      { key: "email", label: "Email" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "push", label: "Push notification" },
      { key: "sms", label: "SMS" },
    ];
  }, [online]);

  const setToggle = (key, val) => setNotify((n) => ({ ...n, [key]: val }));

  // Selected preferences (only those set to true)
  const selected = useMemo(
    () =>
      Object.entries(notify)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    [notify]
  );

  // Handler for save action
  const handleSave = async () => {
    const savingToast = toast.loading("Saving changes...");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notification/save`,
        { preferences: notify }, // send the object
        { withCredentials: true }
      );

      toast.success("Changes saved!", { id: savingToast });
    } catch (err) {
      console.error("Error saving notification prefs:", err);
      toast.error("Failed to save changes", { id: savingToast });
    }
  };

  return (
    <main className="max-w-5xl px-4 py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Manage your preferences and activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification preferences */}
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

          {/* Show what user has chosen */}
          <div className="mt-3 text-sm text-gray-700">
            Selected:{" "}
            {selected.length > 0
              ? selected.join(", ")
              : "No preferences chosen"}
          </div>
        </Card>

        {/* Online/Offline status */}
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

      {/* Save button */}
      <div className="flex justify-center mt-10 mb-2">
        <Button
          onClick={handleSave}
          className="px-8 py-3 text-lg font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Save Changes
        </Button>
      </div>
    </main>
  );
}

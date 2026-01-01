"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const ROLE_OPTIONS = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Editor", value: "editor" },
    { label: "Manager", value: "manager" },
    { label: "Viewer", value: "viewer" },
  ];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const res = await fetch(`/api/getUserProfile?uid=${currentUser.uid}`);
        const data = await res.json();

        setUser(data.user);
        setName(data.user?.name || "");
        setRole(data.user?.role || "");
      } else {
        router.push("/sign-in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const res = await fetch("/api/updateUserProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name,
          role,
        }),
      });

      if (!res.ok) throw new Error();

      setUser({ ...user, name, role });
      setIsEditing(false);
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg font-medium">
        Loading profile...
      </p>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium">No profile found.</p>
        <Button className="mt-4" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">

        {/* PROFILE AVATAR */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="flex-1 space-y-4 w-full">

          {/* NAME */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Name
            </p>
            {isEditing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
            )}
          </div>

          {/* EMAIL */}
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Email:</strong> {user.email}
          </p>

          {/* ROLE */}
          {/* ROLE */}
          <div className="text-gray-600 dark:text-gray-300">
            <strong>Role:</strong>{" "}
            {isEditing ? (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="capitalize">{user.role}</span>
            )}
          </div>

          {/* UID */}
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <strong>UID:</strong> {user.uid}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setRole(user.role);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
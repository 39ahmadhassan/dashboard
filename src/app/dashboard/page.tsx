"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ROLE_OPTIONS = ["admin", "user", "editor", "manager", "viewer"];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    address: "",
    role: "user",
    designation: "",
  });

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      const res = await fetch(`/api/getUserProfile?uid=${currentUser.uid}`);
      const data = await res.json();

      const fullName = data.user?.name || "";

      setUser(data.user);
      setForm({
        name: fullName,
        dob: data.user?.dob || "",
        address: data.user?.address || "",
        role: data.user?.role || "user",
        designation: data.user?.designation || "",
      });

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/updateUserProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: form.name,
          dob: form.dob,
          address: form.address,
          role: form.role,
          designation: form.designation,
        }),
      });
      if (!res.ok) throw new Error();

      setUser({ ...user, ...form });
      setIsEditing(false);
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading profile...</p>;

  // Profile completion calculation
  const profileFields = ["name", "dob", "address", "role", "designation"];
  const filledFields = profileFields.filter((field) => form[field as keyof typeof form]);
  const completion = Math.round((filledFields.length / profileFields.length) * 100);
  const progressColor =
    completion < 40 ? "bg-red-500" : completion < 70 ? "bg-yellow-400" : "bg-green-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center py-12 px-4">
      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6">
        {/* AVATAR & PROGRESS */}
        <div className="flex flex-col items-center md:items-start gap-6 w-full md:w-1/3">
          <div className="w-36 h-36 rounded-full bg-indigo-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
            {form.name?.charAt(0) || "U"}
          </div>

          {/* Profile Completion */}
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1 font-medium">Profile Completion</p>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`${progressColor} h-4 rounded-full transition-all duration-500`}
                style={{ width: `${completion}%` }}
              ></div>
              <span className="absolute right-2 top-0 text-xs font-semibold text-gray-700">
                {completion}%
              </span>
            </div>
          </div>

          <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* PROFILE INFO */}
        <CardContent className="flex-1 flex flex-col gap-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>

          {/* Form Fields */}
          <Field label="Name">
            <InputField editing={isEditing} name="name" value={form.name} onChange={handleChange} />
          </Field>

          <p className="text-sm text-gray-600"><strong>Email:</strong> {user.email}</p>

          <Field label="Date of Birth">
            <InputField editing={isEditing} name="dob" value={form.dob} onChange={handleChange} type="date" />
          </Field>

          <Field label="Address">
            <InputField editing={isEditing} name="address" value={form.address} onChange={handleChange} />
          </Field>

          <Field label="Designation">
            <InputField editing={isEditing} name="designation" value={form.designation} onChange={handleChange} />
          </Field>

          <Field label="Role">
            {isEditing ? (
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            ) : (
              <p className="capitalize">{form.role}</p>
            )}
          </Field>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 mt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* REUSABLE COMPONENTS */
function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">{label}</label>
      {children}
    </div>
  );
}

function InputField({ editing, ...props }: any) {
  return editing ? (
    <Input {...props} className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-md" />
  ) : (
    <p className="text-gray-700">{props.value || "—"}</p>
  );
}

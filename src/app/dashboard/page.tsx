"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Users</h1>
      {users.map((u) => (
        <div key={u.uid} className="border p-2 mb-2 rounded">{u.name} – {u.role}</div>
      ))}
    </div>
  );
}

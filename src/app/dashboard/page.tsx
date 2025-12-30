"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null); // store current user profile
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (!currentUser) {
        router.push("/login"); // redirect if not logged in
        return;
      }

      // Fetch user details from Firestore
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        // fallback if Firestore data is missing
        setUser({
          name: currentUser.displayName || "No Name",
          email: currentUser.email,
          uid: currentUser.uid,
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
          <CardDescription className="text-gray-500">Your Profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-700 font-semibold">Email:</p>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">UID:</p>
            <p className="text-gray-900">{user.uid}</p>
          </div>
          {user.role && (
            <div>
              <p className="text-gray-700 font-semibold">Role:</p>
              <p className="text-gray-900">{user.role}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


















// "use client";

// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [users, setUsers] = useState<any[]>([]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "users"), (snap) => {
//       setUsers(snap.docs.map(d => d.data()));
//     });
//     return () => unsub();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-2">Users</h1>
//       {users.map((u) => (
//         <div key={u.uid} className="border p-2 mb-2 rounded">{u.name} – {u.role}</div>
//       ))}
//     </div>
//   );
// }

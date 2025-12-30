import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center px-6 py-12">
      <main className="max-w-4xl w-full space-y-12">
        
        {/* Header Section */}
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Welcome to HealthShare
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            HealthShare empowers you to share and manage your health information
            securely and easily.
          </p>
        </header>

        {/* Info Cards */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="text-center">
              <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">
                Trusted Info
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Access reliable health guidance from professionals.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="text-center">
              <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">
                Easy Access
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                View and share records in a secure platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="text-center">
              <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">
                Get Started
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Create your account 💪
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA Buttons */}
        <section className="flex flex-col sm:flex-row justify-center gap-6">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Link href="/sign-up">Create Account</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </section>

        {/* Small Footer */}
        <footer className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          © 2025 HealthShare • All rights reserved.
        </footer>

      </main>
    </div>
  );
}

















// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }

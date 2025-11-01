import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { paths } from "@/lib/paths";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 sm:p-6">
        <Logo />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4 -mt-16">
        <div className="relative mb-8">
          <div className="absolute -inset-2">
            <div className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
          </div>
          <h1 className="relative font-headline text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-foreground to-gray-400">
            GeekForce Central
          </h1>
        </div>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10">
          The ultimate command center for the elite Geek Squad. Collaborate,
          track missions, and conquer tech challenges together.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href={paths.login}>Agent Login</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={paths.signup}>Join the Force</Link>
          </Button>
        </div>
      </main>
      <footer className="text-center p-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} GeekForce Central. All Systems Nominal.</p>
      </footer>
    </div>
  );
}

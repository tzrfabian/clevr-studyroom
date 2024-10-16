"use client";
import { useAppContext } from "../lib/AppContext";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { Bounce, toast } from "react-toastify";
import Loader from "./Loader";

export default function AppLayout({ children }) {
  const { user, loading } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const showAuthLinks = pathname !== "/login" && pathname !== "/register";

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
      toast('See you next time!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center transition-all duration-300 ease-in-out transform hover:shadow-2xl">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-wide hover:text-blue-200 transition duration-300 ease-in-out"
          >
            <img src="https://i.imgur.com/iMIZkSz.png" alt="logo img" width={150}/>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {showAuthLinks &&
              (user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="btn btn-ghost text-lg hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost text-lg hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn btn-ghost text-lg hover:bg-green-600 hover:text-white transition duration-300 ease-in-out"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-ghost text-lg hover:bg-yellow-500 hover:text-white transition duration-300 ease-in-out"
                  >
                    Register
                  </Link>
                </>
              ))}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

import Link from "next/link";
import { cookies } from "next/headers";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");
  const isLoggedIn = Boolean(accessToken || refreshToken);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-semibold text-gray-900">
              Article Hub
            </Link>
          </div>
          <HeaderClient isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}


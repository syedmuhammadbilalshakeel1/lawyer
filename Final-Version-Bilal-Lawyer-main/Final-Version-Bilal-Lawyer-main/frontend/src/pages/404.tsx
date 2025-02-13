import Link from "next/link";
import React from "react";

function ErrorPage() {
  return (
    <div className="flex flex-col text-center gap-7 py-20">
      <h4 className="text-8xl font-bold text-[#65676b]">404</h4>
      <p className="text-6xl bg-[#ffbb00] py-10 font-semibold">
        Page not found!
      </p>
      <p className="text-[#acacac]">
        The page you are looking for not available.
      </p>
      <Link
        href="/"
        className="p-3 text-red-900 bg-[#ffbb00] w-40 mx-auto rounded-md"
      >
        Go back to Home
      </Link>
    </div>
  );
}

export default ErrorPage;

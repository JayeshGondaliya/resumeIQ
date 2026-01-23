import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-7xl font-bold text-accent mb-4">404</h1>

      <h2 className="text-2xl font-semibold mb-2">
        Page Not Found
      </h2>

      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium
                   bg-accent text-accent-foreground hover:bg-accent/90 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

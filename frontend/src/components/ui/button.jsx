import React from "react";

const Button = ({ children, className = "", variant = "default", ...props }) => {
    const base =
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition";

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 hover:bg-gray-100",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

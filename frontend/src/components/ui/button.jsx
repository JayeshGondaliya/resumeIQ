import React from "react";

const Button = ({
    children,
    className = "",
    variant = "default",
    size = "md",
    ...props
}) => {
    const base =
        "flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
        ghost: "bg-transparent hover:bg-gray-100",
        gradient: "",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-6 text-base",   // ⭐ BEST DEFAULT
        lg: "h-14 px-8 text-lg",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

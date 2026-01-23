import React, { createContext } from "react";

export const TooltipProvider = ({ children }) => {
  return <div className="tooltip-provider">{children}</div>;
};

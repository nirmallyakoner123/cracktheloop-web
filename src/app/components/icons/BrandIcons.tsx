import React from "react";

export function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M17.05 12.72c-.08-2.67 2.21-3.92 2.31-3.98-1.26-1.84-3.19-2.09-3.88-2.12-1.65-.17-3.23 1-4.07 1-.84 0-2.14-1-3.52-1-1.81.02-3.48 1.05-4.4 2.64-1.9 3.28-.48 8.12 1.34 10.76.89 1.29 1.94 2.74 3.32 2.69 1.32-.05 1.83-.85 3.42-.85 1.59 0 2.05.85 3.43.82 1.44-.03 2.37-1.31 3.25-2.58.98-1.42 1.38-2.8 1.4-2.88-.03-.01-2.67-1.02-2.7-4.12zM12.8 5.47c.75-.9 1.25-2.15 1.11-3.4-1.07.04-2.37.72-3.13 1.62-.69.81-1.26 2.07-1.09 3.3 1.2.93 2.45.18 3.11-.52z" />
    </svg>
  );
}

export function WindowsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 3.449L9.75 2.1v9.45H0V3.449z M0 12.45h9.75v9.45L0 20.551V12.45z M10.8 1.95L24 0v11.55H10.8V1.95z M10.8 12.45H24v11.55l-13.2-1.95V12.45z" />
    </svg>
  );
}

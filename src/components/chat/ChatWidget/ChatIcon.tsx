export function ChatIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 13.89 2.525 15.66 3.44 17.17L2 22L6.83 20.56C8.34 21.475 10.11 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
        fill="currentColor"
      />
      <circle
        cx="8"
        cy="12"
        r="1.5"
        fill="white"
        fillOpacity="0.9"
      />
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="white"
        fillOpacity="0.9"
      />
      <circle
        cx="16"
        cy="12"
        r="1.5"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  )
}

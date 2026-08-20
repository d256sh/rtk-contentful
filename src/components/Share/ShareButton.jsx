import React, { useState, useCallback } from "react";

const ShareButton = ({ count }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <button
      type="button"
      className={`share-btn${copied ? " share-btn--copied" : ""}${!count ? " share-btn--disabled" : ""}`}
      onClick={handleCopy}
      disabled={!count}
      aria-label="Copy share link"
    >
      <span className="share-btn__icon">
        {copied ? "✓" : "🔗"}
      </span>
      <span className="share-btn__text">
        {copied ? "Link Copied!" : `Share Playlist${count ? ` (${count})` : ""}`}
      </span>
    </button>
  );
};

export default ShareButton;

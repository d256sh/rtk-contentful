import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";

const ShareButton = ({ count, hidePreview }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return window.location.origin + "/shared" + window.location.hash;
  };

  const handleCopy = useCallback(async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {!hidePreview && (
        <Link 
          to={`/shared${window.location.hash}`} 
          className={`share-btn share-btn--secondary${!count ? " share-btn--disabled" : ""}`}
          style={!count ? { pointerEvents: 'none' } : {}}
        >
          <span className="share-btn__icon">👁️</span>
          <span className="share-btn__text">Preview List</span>
        </Link>
      )}

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
          {copied ? "Link Copied!" : `Copy Link${count ? ` (${count})` : ""}`}
        </span>
      </button>
    </div>
  );
};

export default ShareButton;

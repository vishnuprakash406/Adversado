"use client";

export default function OpenMiaButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("open-mia"))}>
      <span>Ask Mia</span><strong>Open the cat assistant</strong><i>↓</i>
    </button>
  );
}

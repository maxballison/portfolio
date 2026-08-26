// Shared window z-order management. Windows register their DOM node under an
// id; focusWindow raises one to the top and flashes its title bar.

const registry = new Map<string, HTMLDivElement>();
let zCounter = 10;

/** Next z-index for a window being raised. */
export function nextZ(): number {
  return ++zCounter;
}

/** Register a window element. Returns an unregister cleanup. */
export function registerWindow(id: string, el: HTMLDivElement): () => void {
  registry.set(id, el);
  return () => {
    if (registry.get(id) === el) registry.delete(id);
  };
}

/** Raise a window above everything else and flash its title bar. */
export function focusWindow(id: string): void {
  const el = registry.get(id);
  if (!el) return;
  el.style.zIndex = String(nextZ());
  const titleBar = el.querySelector(".title-bar");
  if (titleBar) {
    titleBar.classList.remove("title-bar-flash");
    // Restart the animation if it was already flashing
    void (titleBar as HTMLElement).offsetWidth;
    titleBar.classList.add("title-bar-flash");
  }
}

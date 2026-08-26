"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { nextZ, registerWindow } from "./windowRegistry";

/**
 * Windows-9x window chrome (98.css).
 * - Minimize button (and double-clicking the title bar) collapses the window
 *   to its title bar, like the classic window-shade behavior.
 * - On fine-pointer devices the window can be dragged by its title bar from
 *   its default position. Transforms are applied directly to the DOM node
 *   during the drag so nothing re-renders per frame.
 * - Pass a windowId to allow focusWindow(id) to raise it from elsewhere.
 */
export function WindowFrame({
  title,
  children,
  menuBar,
  statusFields,
  className = "",
  windowId,
  defaultCollapsed = false,
  onHelp,
  onClose,
}: {
  title: string;
  children: ReactNode;
  menuBar?: ReactNode;
  statusFields?: string[];
  className?: string;
  windowId?: string;
  defaultCollapsed?: boolean;
  /** When set, shows a "?" title-bar button (98.css Help control). */
  onHelp?: () => void;
  /** When set, shows an "X" title-bar button (98.css Close control). */
  onClose?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const windowRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(
    null
  );

  /**
   * Collapse/expand without changing the page height: before shading the
   * window, lock its current height onto the wrapper so the space below
   * stays reserved (the window shades within it).
   */
  const toggleCollapsed = () => {
    const wrapper = wrapperRef.current;
    const win = windowRef.current;
    if (wrapper && win) {
      wrapper.style.height = collapsed ? "" : `${win.offsetHeight}px`;
    }
    setCollapsed((c) => !c);
  };

  useEffect(() => {
    if (!windowId || !windowRef.current) return;
    return registerWindow(windowId, windowRef.current);
  }, [windowId]);

  const bringToFront = () => {
    if (windowRef.current) {
      windowRef.current.style.zIndex = String(nextZ());
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    bringToFront();
    // Dragging conflicts with scroll on touch screens; fine pointers only.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // Title-bar buttons still need to be clickable.
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.current.x,
      baseY: offset.current.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !windowRef.current) return;
    offset.current = {
      x: d.baseX + e.clientX - d.startX,
      y: d.baseY + e.clientY - d.startY,
    };
    windowRef.current.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div ref={wrapperRef}>
      <div
        ref={windowRef}
        className={`window relative ${className}`}
        onPointerDown={bringToFront}
      >
        <div
          className="title-bar"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            toggleCollapsed();
          }}
        >
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            {onHelp && (
              <button type="button" aria-label="Help" onClick={onHelp} />
            )}
            <button
              type="button"
              aria-label="Minimize"
              aria-expanded={!collapsed}
              onClick={toggleCollapsed}
            />
            {onClose && (
              <button type="button" aria-label="Close" onClick={onClose} />
            )}
          </div>
        </div>
        {!collapsed && (
          <>
            {menuBar}
            <div className="window-body">{children}</div>
            {statusFields && statusFields.length > 0 && (
              <div className="status-bar">
                {statusFields.map((field) => (
                  <p key={field} className="status-bar-field">
                    {field}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

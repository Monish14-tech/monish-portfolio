import { useEffect, useRef, useState } from 'react';

/**
 * Mounts children only when the placeholder nears the viewport.
 * Defers heavy section JS/WebGL until the user scrolls near them.
 */
export function DeferMount({ children, rootMargin = '320px', minHeight = '60vh' }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const show = () => setReady(true);
    let disconnectObserver = () => {};

    const startObserver = () => {
      if (!('IntersectionObserver' in window)) {
        show();
        return;
      }

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            show();
            io.disconnect();
          }
        },
        { rootMargin, threshold: 0 }
      );
      io.observe(el);
      disconnectObserver = () => io.disconnect();
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => startObserver(), { timeout: 1200 });
      return () => {
        window.cancelIdleCallback(idleId);
        disconnectObserver();
      };
    }

    startObserver();
    return () => disconnectObserver();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: ready ? undefined : minHeight }}>
      {ready ? children : null}
    </div>
  );
}

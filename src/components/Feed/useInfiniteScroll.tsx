"use client";
import { useRef, useEffect } from "react";

export default function useInfiniteScroll(
  scrollRefElem: HTMLDivElement | null,
  callback: () => void,
) {
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const handleObserver: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (observer.current && scrollRefElem) {
      observer.current.observe(scrollRefElem);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [callback, scrollRefElem]);
}

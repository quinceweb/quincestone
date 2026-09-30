import type { SVGProps } from "react";

export function QuincestoneQMark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 36 36" role="img" aria-label="Quincestone" {...props}><path fill="currentColor" fillRule="evenodd" d="M2 18C2 8.2 9.2 2 18.2 2S34.4 8.2 34.4 18c0 5.4-2.3 9.8-6.2 12.5l5.3 3.1-4.4 2.1-5.5-3.4c-1.7.6-3.5.9-5.4.9C9.2 33.2 2 27.3 2 18Zm6.5 0c0 6.1 3.9 9.8 9.7 9.8h.8l-4.2-2.5 4.4-2.1 4.3 2.6c2.7-1.6 4.4-4.2 4.4-7.8 0-6.2-3.9-9.9-9.7-9.9S8.5 11.8 8.5 18Z"/></svg>;
}

export function QuincestoneWordmark({ title = "Quincestone", ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return <svg viewBox="0 0 244 34" role="img" aria-label={title} {...props}><g fill="currentColor"><path fillRule="evenodd" d="M3 17C3 7.7 9.9 2 18.5 2S34 7.7 34 17c0 5.2-2.2 9.4-5.9 12l5.1 3-4.2 2-5.3-3.2c-1.6.5-3.4.8-5.2.8C9.9 31.6 3 26 3 17Zm6.2 0c0 5.8 3.7 9.3 9.3 9.3h.8l-4-2.4 4.2-2 4.1 2.5c2.6-1.5 4.2-4 4.2-7.4 0-5.9-3.7-9.4-9.3-9.4S9.2 11.1 9.2 17Z"/><path d="M42 3h5.7v17.1c0 4.2 2 6.2 5.8 6.2s5.8-2 5.8-6.2V3H65v17.4c0 7.2-4.2 11.2-11.5 11.2S42 27.6 42 20.4V3Zm30.6 0h5.8v28h-5.8V3Zm13.5 0h5.4l12.7 18.1V3h5.7v28h-5.3L91.8 12.8V31h-5.7V3Zm31.3 14c0-8.6 6-14.5 14.5-14.5 5.5 0 9.7 2.5 12.1 6.4l-4.8 3c-1.5-2.5-3.8-4-7.2-4-5.1 0-8.7 3.7-8.7 9.1 0 5.5 3.6 9.2 8.7 9.2 3.4 0 5.8-1.5 7.3-4.1l4.8 2.9c-2.5 4.1-6.7 6.6-12.2 6.6-8.5 0-14.5-5.9-14.5-14.6Zm33.2-14h18.9v5.3h-13.1v5.9h11.8v5.1h-11.8v6.4h13.5V31h-19.3V3Zm24.8 21.1 4.7-2.7c1.4 3.2 3.7 4.9 7 4.9 2.9 0 4.7-1.2 4.7-3.3 0-2.3-1.9-3.1-6.1-4.4-5.1-1.6-8.8-3.7-8.8-8.3 0-4.8 4.1-7.8 9.8-7.8 5 0 8.8 2.2 10.8 6.1l-4.5 2.7c-1.3-2.4-3.4-3.6-6.3-3.6-2.6 0-4.1 1-4.1 2.7 0 1.9 1.6 2.7 5.8 4 5.5 1.7 9.2 3.9 9.2 8.6 0 5.2-4.3 8.5-10.6 8.5-5.8 0-9.8-2.7-11.6-7.4ZM201 8.3h-8.1V3h22v5.3h-8.1V31H201V8.3Zm17.1 8.7c0-8.5 6.2-14.5 14.5-14.5 8.4 0 14.4 6 14.4 14.5s-6 14.6-14.4 14.6c-8.3 0-14.5-6.1-14.5-14.6Zm5.9 0c0 5.5 3.5 9.2 8.6 9.2s8.6-3.7 8.6-9.2c0-5.4-3.5-9.1-8.6-9.1S224 11.6 224 17Z"/></g></svg>;
}

export function QuincestoneSignature({ className = "" }: { className?: string }) {
  return <span className={className}><QuincestoneWordmark className="qs-brand-wordmark" /><span className="qs-brand-tagline">Intent into outcomes.</span></span>;
}

import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { useSprings, animated, SpringValue } from '@react-spring/web';

const AnimatedSpan = animated.span as React.FC<React.HTMLAttributes<HTMLSpanElement>>;

interface BlurTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text?: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, any>;
  animationTo?: Record<string, any>[];
  easing?: (t: number) => number | string;
  onAnimationComplete?: () => void;
}

const BlurText = forwardRef<HTMLParagraphElement, BlurTextProps>(({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = 'easeOutCubic',
  onAnimationComplete,
  ...rest
}, ref) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const internalRef = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  // Default animations based on direction
  const defaultFrom: Record<string, any> = direction === 'top'
    ? { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,-50px,0)' }
    : { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,50px,0)' };
  
  const defaultTo: Record<string, any>[] = [
    {
      filter: 'blur(5px)',
      opacity: 0.5,
      transform: direction === 'top' ? 'translate3d(0,5px,0)' : 'translate3d(0,-5px,0)',
    },
    { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
  ];

  // Combine external and internal refs
  const combinedRef = (el: HTMLParagraphElement | null) => {
    internalRef.current = el;
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLParagraphElement | null>).current = el;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (internalRef.current) {
            observer.unobserve(internalRef.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (internalRef.current) {
      observer.observe(internalRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: animationFrom || defaultFrom,
      to: inView
        ? async (next: (arg: Record<string, SpringValue<any>>) => Promise<void>) => {
          for (const step of animationTo || defaultTo) {
            await next(step);
          }
          animatedCount.current += 1;
          if (animatedCount.current === elements.length && onAnimationComplete) {
            onAnimationComplete();
          }
        }
        : animationFrom || defaultFrom,
      delay: i * delay,
      config: { easing: easing as any },
    }))
  );

  return (
    <p 
      ref={combinedRef} 
      className={`blur-text ${className} flex flex-wrap`}
      {...rest}
    >
      {springs.map((props, index) => (
        <AnimatedSpan
          key={index}
          style={props}
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {elements[index] === ' ' ? '\u00A0' : elements[index]}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </AnimatedSpan>
      ))}
    </p>
  );
});

BlurText.displayName = 'BlurText';

export default BlurText;
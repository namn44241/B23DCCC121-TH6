import { animated, type SpringConfig, useSpring } from "@react-spring/web";
import React, { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";

interface AnimatedContentProps {
    children: ReactNode;
    distance?: number;
    direction?: "vertical" | "horizontal";
    reverse?: boolean;
    config?: SpringConfig;
    initialOpacity?: number;
    animateOpacity?: boolean;
    scale?: number;
    threshold?: number;
    delay?: number;
}

const AnimatedContent = forwardRef<HTMLDivElement, AnimatedContentProps>(({
    children,
    distance = 100,
    direction = "vertical",
    reverse = false,
    config = { tension: 50, friction: 25 },
    initialOpacity = 0,
    animateOpacity = true,
    scale = 1,
    threshold = 0.1,
    delay = 0,
}, ref) => {
    const [inView, setInView] = useState(false);
    const localRef = useRef<HTMLDivElement | null>(null);

    // Combine external and internal refs
    const combinedRef = (node: HTMLDivElement | null) => {
        localRef.current = node;

        // Handle forwarded ref
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    };

    useEffect(() => {
        const element = localRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    observer.unobserve(element);
                    setTimeout(() => {
                        setInView(true);
                    }, delay);
                }
            },
            { threshold }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, delay]);

    const directions: Record<"vertical" | "horizontal", string> = {
        vertical: "Y",
        horizontal: "X",
    };

    const springProps = useSpring({
        from: {
            transform: `translate${directions[direction]}(${reverse ? `-${distance}px` : `${distance}px`
                }) scale(${scale})`,
            opacity: animateOpacity ? initialOpacity : 1,
        },
        to: inView
            ? {
                transform: `translate${directions[direction]}(0px) scale(1)`,
                opacity: 1,
            }
            : undefined,
        config,
    });

    return (
        //ignore the ref warning
        // @ts-ignore
        <animated.div ref={combinedRef} style={springProps}>
            {children}
        </animated.div>
    );
});

// Add a display name for better debugging
AnimatedContent.displayName = 'AnimatedContent';

export default AnimatedContent;
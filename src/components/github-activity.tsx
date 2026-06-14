
"use client"

import { useEffect, useRef, useSyncExternalStore } from "react";
import { GitHubCalendar, type Activity } from 'react-github-calendar';
import { Loader2 } from "lucide-react";

export function GithubActivity() {
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the right end after mounted
        // We use a timeout to ensure the calendar data has loaded and rendered
        if (mounted && scrollRef.current) {
            const scrollToBottom = () => {
                if (scrollRef.current) {
                    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
                }
            };

            // Attempt immediately
            scrollToBottom();

            // Retry after delays to handle data fetching time
            const timer1 = setTimeout(scrollToBottom, 500);
            const timer2 = setTimeout(scrollToBottom, 1500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [mounted]);

    if (!mounted) {
        return (
            <div className="w-full flex justify-center py-4 h-[120px] items-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            className="w-full flex justify-start lg:justify-center py-4 overflow-x-auto scrollbar-hide"
        >
            <GitHubCalendar
                username="m-guchi"
                colorScheme="dark"
                blockSize={12}
                blockMargin={4}
                fontSize={12}
                transformData={selectLastHalfYear}
                theme={{
                    dark: ['#333', '#40c463', '#30a14e', '#216e39', '#216e39'], // Fallback
                    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'], // Fallback
                }}
                labels={{
                    totalCount: '{{count}} contributions in the last 6 months',
                }}
                style={{
                    color: 'white',
                }}
            />
        </div>
    )
}

const selectLastHalfYear = (contributions: Activity[]) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const shownMonths = 6;

    return contributions.filter(day => {
        const date = new Date(day.date);
        const monthDiff = (currentYear - date.getFullYear()) * 12 + (currentMonth - date.getMonth());
        return monthDiff < shownMonths;
    });
};

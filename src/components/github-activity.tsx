
"use client"

import { useEffect, useState } from "react";
import { GitHubCalendar } from 'react-github-calendar';
import { Loader2 } from "lucide-react";

export function GithubActivity() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full flex justify-center py-4 h-[120px] items-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (

        <div className="w-full flex justify-center py-4 overflow-hidden">

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

const selectLastHalfYear = (contributions: any[]) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const shownMonths = 6;

    return contributions.filter(day => {
        const date = new Date(day.date);
        const monthDiff = (currentYear - date.getFullYear()) * 12 + (currentMonth - date.getMonth());
        return monthDiff < shownMonths;
    });
};

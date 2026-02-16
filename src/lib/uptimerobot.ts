
export interface UptimeRobotMonitor {
    id: number;
    friendly_name: string;
    url: string;
    type: number;
    sub_type?: string;
    keyword_type?: number;
    keyword_value?: string;
    http_username?: string;
    http_password?: string;
    port?: string;
    interval: number;
    status: number; // 0: paused, 1: not checked yet, 2: up, 8: seems down, 9: down
    create_datetime: number;
    uptime_ratio: string; // "99.98" etc. (hyphen separated if multiple ranges)
    all_time_uptime_ratio?: string;
    custom_uptime_ratio?: string;
}


export async function getUptimeRobotMonitors(): Promise<UptimeRobotMonitor[]> {
    // 1. Collect all API keys (single main key OR multiple monitor keys)
    const keys: string[] = [];

    // Check for the main/single key
    if (process.env.UPTIMEROBOT_API_KEY) {
        keys.push(process.env.UPTIMEROBOT_API_KEY);
    }

    // Check for multiple keys (UPTIMEROBOT_MK_1, UPTIMEROBOT_MK_PROJECTNAME, etc.)
    for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith('UPTIMEROBOT_MK_') && value) {
            keys.push(value);
        }
    }

    if (keys.length === 0) {
        // console.warn('No UPTIMEROBOT_API_KEY or UPTIMEROBOT_MK_* environment variables set.');
        return [];
    }

    try {
        const monitors: UptimeRobotMonitor[] = [];

        // 2. Fetch data for ALL keys in parallel
        await Promise.all(keys.map(async (apiKey) => {
            try {
                const res = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cache-Control': 'no-cache',
                    },
                    // logs=0: no logs, custom_uptime_ratios=30: last 30 days
                    body: `api_key=${apiKey}&format=json&logs=0&custom_uptime_ratios=30`,
                    next: { revalidate: 60 }
                });

                const data = await res.json();

                if (data.stat === 'ok' && data.monitors) {
                    monitors.push(...data.monitors);
                } else {
                    console.error(`UptimeRobot API Error for key ending in ...${apiKey.slice(-5)}:`, data.error);
                }
            } catch (err) {
                console.error('Failed to fetch UptimeRobot data for a key:', err);
            }
        }));

        return monitors;

    } catch (error) {
        console.error('Failed to process UptimeRobot data:', error);
    }
    return [];
}

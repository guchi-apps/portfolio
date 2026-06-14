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

async function fetchUptimeRobotMonitors(apiKey: string | undefined): Promise<UptimeRobotMonitor[]> {
    if (!apiKey) {
        return [];
    }

    try {
        const res = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `api_key=${apiKey}&format=json&logs=0&custom_uptime_ratios=30`,
            cache: 'no-store'
        });

        const data = await res.json();

        if (data.stat === 'ok' && data.monitors) {
            return data.monitors;
        } else {
            console.error('UptimeRobot API Error:', data.error);
        }
    } catch (err) {
        console.error('Failed to fetch UptimeRobot data:', err);
    }

    return [];
}

export async function fetchUptimeRobotMonitorsServer(): Promise<UptimeRobotMonitor[]> {
    return fetchUptimeRobotMonitors(process.env.UPTIMEROBOT_READ_ONLY_KEY);
}

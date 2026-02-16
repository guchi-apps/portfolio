
import fs from 'fs';
import path from 'path';

export interface StatsConfig {
    yearsDetail: string
    projectsDetail: string
    totalAssets: number
    launchDate: string
    location: string
}

export function getStatsConfig(): StatsConfig | null {
    try {
        const filePath = path.join(process.cwd(), 'public', 'stats-config.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Failed to read stats config:', error);
        return null;
    }
}

/** Display project start date as YYYY.MM.DD */
export function formatProjectPeriod(period: string): string {
    const trimmed = period.trim()
    if (!trimmed) return ""

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
        return `${isoMatch[1]}.${isoMatch[2]}.${isoMatch[3]}`
    }

    const dotFullMatch = trimmed.match(/^(\d{4})\.(\d{2})\.(\d{2})$/)
    if (dotFullMatch) {
        return `${dotFullMatch[1]}.${dotFullMatch[2]}.${dotFullMatch[3]}`
    }

    const dotMonthMatch = trimmed.match(/^(\d{4})\.(\d{2})$/)
    if (dotMonthMatch) {
        return `${dotMonthMatch[1]}.${dotMonthMatch[2]}.01`
    }

    return trimmed
}

/** Convert stored period to YYYY-MM-DD for <input type="date"> */
export function parseProjectPeriodForInput(period: string): string {
    const trimmed = period.trim()
    if (!trimmed) return ""

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) return trimmed

    const dotFullMatch = trimmed.match(/^(\d{4})\.(\d{2})\.(\d{2})$/)
    if (dotFullMatch) {
        return `${dotFullMatch[1]}-${dotFullMatch[2]}-${dotFullMatch[3]}`
    }

    const dotMonthMatch = trimmed.match(/^(\d{4})\.(\d{2})$/)
    if (dotMonthMatch) {
        return `${dotMonthMatch[1]}-${dotMonthMatch[2]}-01`
    }

    return ""
}

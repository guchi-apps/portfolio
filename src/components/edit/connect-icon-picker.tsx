import { cn } from "@/lib/utils"
import {
    CONNECT_ICON_OPTIONS,
    getConnectIcon,
    getConnectIconLabel,
} from "@/lib/connect-icons"
import type { ConnectIconName } from "@/types/site-content"

interface ConnectIconPickerProps {
    value: ConnectIconName
    onChange: (icon: ConnectIconName) => void
}

export function ConnectIconPicker({ value, onChange }: ConnectIconPickerProps) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {CONNECT_ICON_OPTIONS.map((iconName) => {
                const Icon = getConnectIcon(iconName)
                const selected = value === iconName

                return (
                    <button
                        key={iconName}
                        type="button"
                        onClick={() => onChange(iconName)}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-md border transition-colors",
                            selected
                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        )}
                        aria-pressed={selected}
                        aria-label={getConnectIconLabel(iconName)}
                        title={getConnectIconLabel(iconName)}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                    </button>
                )
            })}
        </div>
    )
}

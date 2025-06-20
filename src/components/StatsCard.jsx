import { useTheme } from "@/context/theme-context";

export function StatsCard({ label, value, icon: Icon, change, color }) {
    const { darkMode } = useTheme();

    return (
        <div
            className={`rounded-lg border transition-all duration-200 hover:shadow-lg ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
        >
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p
                            className={`text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            {label}
                        </p>
                        <p className="text-2xl font-bold">{value}</p>
                        <p className={`text-xs ${color}`}>{change} from last month</p>
                    </div>
                    <div className={`p-3 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

export default function ComparisonChart() {
    const traditionalData = {
        avgWait: 45,
        throughput: 12,
        ambulanceTime: 180,
    };

    const aiData = {
        avgWait: 28,
        throughput: 18,
        ambulanceTime: 95,
    };

    const improvement = {
        avgWait: ((traditionalData.avgWait - aiData.avgWait) / traditionalData.avgWait * 100).toFixed(0),
        throughput: ((aiData.throughput - traditionalData.throughput) / traditionalData.throughput * 100).toFixed(0),
        ambulanceTime: ((traditionalData.ambulanceTime - aiData.ambulanceTime) / traditionalData.ambulanceTime * 100).toFixed(0),
    };

    const BarComparison = ({ label, traditional, ai, unit, better }: any) => (
        <div className="mb-4">
            <div className="text-xs text-white/70 mb-2">{label}</div>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-20">Traditional</span>
                    <div className="flex-1 h-6 bg-white/10 rounded-lg overflow-hidden">
                        <div
                            className="h-full bg-red-500/50"
                            style={{ width: `${(traditional / Math.max(traditional, ai)) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-white w-16">{traditional}{unit}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-accent-teal w-20">AI-Adaptive</span>
                    <div className="flex-1 h-6 bg-white/10 rounded-lg overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-accent-teal to-accent-cyan"
                            style={{ width: `${(ai / Math.max(traditional, ai)) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs text-white w-16">{ai}{unit}</span>
                </div>
            </div>
            <div className="text-xs text-green-400 mt-1 text-right">
                {better === 'lower' ? '↓' : '↑'} {Math.abs(Number(improvement[label as keyof typeof improvement]))}% improvement
            </div>
        </div>
    );

    return (
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-96 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
                Performance Comparison
            </h2>

            <BarComparison
                label="avgWait"
                traditional={traditionalData.avgWait}
                ai={aiData.avgWait}
                unit="s"
                better="lower"
            />

            <BarComparison
                label="throughput"
                traditional={traditionalData.throughput}
                ai={aiData.throughput}
                unit=" v/m"
                better="higher"
            />

            <BarComparison
                label="ambulanceTime"
                traditional={traditionalData.ambulanceTime}
                ai={aiData.ambulanceTime}
                unit="s"
                better="lower"
            />

            <div className="mt-4 p-3 bg-gradient-to-r from-accent-teal/20 to-accent-cyan/20 border border-accent-teal/30 rounded-lg">
                <p className="text-xs text-white/80">
                    <strong className="text-accent-teal">AI-Adaptive signals</strong> reduce wait times by{' '}
                    <strong>{improvement.avgWait}%</strong> and improve ambulance response by{' '}
                    <strong>{improvement.ambulanceTime}%</strong>
                </p>
            </div>
        </div>
    );
}

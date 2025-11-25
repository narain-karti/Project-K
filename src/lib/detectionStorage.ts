// Detection history storage and management
export interface DetectionRecord {
    id: string;
    timestamp: number;
    className: string;
    confidence: number;
    location: { lat: number; lng: number };
    isAccident: boolean;
}

export class DetectionStorage {
    private static STORAGE_KEY = 'project_k_detections';
    private static MAX_RECORDS = 1000;

    static addDetection(detection: Omit<DetectionRecord, 'id' | 'timestamp'>): DetectionRecord {
        const record: DetectionRecord = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...detection
        };

        const history = this.getAllDetections();
        history.push(record);

        // Keep only latest MAX_RECORDS
        const trimmed = history.slice(-this.MAX_RECORDS);

        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
        }

        return record;
    }

    static getAllDetections(): DetectionRecord[] {
        if (typeof window === 'undefined') return [];

        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static getFilteredDetections(filters: {
        className?: string;
        minConfidence?: number;
        maxConfidence?: number;
        startTime?: number;
        endTime?: number;
    }): DetectionRecord[] {
        let records = this.getAllDetections();

        if (filters.className) {
            records = records.filter(r => r.className === filters.className);
        }

        const minConf = filters.minConfidence;
        if (minConf !== undefined) {
            records = records.filter(r => r.confidence >= minConf);
        }

        const maxConf = filters.maxConfidence;
        if (maxConf !== undefined) {
            records = records.filter(r => r.confidence <= maxConf);
        }

        const start = filters.startTime;
        if (start) {
            records = records.filter(r => r.timestamp >= start);
        }

        const end = filters.endTime;
        if (end) {
            records = records.filter(r => r.timestamp <= end);
        }

        return records;
    }

    static getStatistics() {
        const records = this.getAllDetections();
        const totalDetections = records.length;
        const avgConfidence = records.length > 0
            ? records.reduce((sum, r) => sum + r.confidence, 0) / records.length
            : 0;

        const accidents = records.filter(r => r.isAccident);
        const accidentCount = accidents.length;

        // Calculate detection rate (detections per minute in last hour)
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        const recentDetections = records.filter(r => r.timestamp >= oneHourAgo);
        const detectionRate = recentDetections.length / 60; // per minute

        return {
            totalDetections,
            avgConfidence,
            accidentCount,
            detectionRate,
            recentDetections: recentDetections.length
        };
    }

    static exportToCSV(): string {
        const records = this.getAllDetections();
        const headers = ['ID', 'Timestamp', 'Date', 'Class', 'Confidence', 'Latitude', 'Longitude', 'Is Accident'];

        const rows = records.map(r => [
            r.id,
            r.timestamp.toString(),
            new Date(r.timestamp).toISOString(),
            r.className,
            r.confidence.toFixed(4),
            r.location.lat.toFixed(6),
            r.location.lng.toFixed(6),
            r.isAccident ? 'Yes' : 'No'
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    static clearAll() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    }
}

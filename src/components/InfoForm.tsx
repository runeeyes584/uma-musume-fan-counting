import React, { useState, useEffect, useRef } from 'react';
import { Save, Calendar, Scan, Loader2 } from 'lucide-react';
import type { FormData } from '../types';
import { processImage } from '../utils/ocr';

interface InfoFormProps {
    onSave: (data: FormData) => void;
}

export const InfoForm: React.FC<InfoFormProps> = ({ onSave }) => {
    const [formData, setFormData] = useState<FormData>({
        umaName: '',
        totalRaces: 0,
        totalWins: 0,
        totalFan: 0,
        time: '',
        date: ''
    });
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Set default time to system time on mount
    useEffect(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toISOString().split('T')[0];

        setFormData(prev => ({
            ...prev,
            time: timeString,
            date: dateString
        }));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'totalRaces' || name === 'totalWins' || name === 'totalFan' ? Number(value) : value
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsScanning(true);
            try {
                const results = await processImage(e.target.files[0]);

                // Merge OCR results into form data
                setFormData(prev => ({
                    ...prev,
                    umaName: results.name || prev.umaName, // Keep existing if not found
                    totalRaces: results.totalRaces || prev.totalRaces,
                    totalWins: results.totalWins || prev.totalWins,
                    totalFan: results.totalFan || prev.totalFan,
                    // Note: date format might need adjustment if OCR returns strictly formatted string
                }));
            } catch (error) {
                console.error("Failed to scan image", error);
                alert("Failed to scan image. Please try a clearer screenshot.");
            } finally {
                setIsScanning(false);
                if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Information</h2>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {/* Left Column */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                        <label>Your uma</label>
                        <input
                            type="text"
                            name="umaName"
                            value={formData.umaName}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter uma name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Total races</label>
                        <input
                            type="number"
                            name="totalRaces"
                            value={formData.totalRaces}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Total races win</label>
                        <input
                            type="number"
                            name="totalWins"
                            value={formData.totalWins}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Total fan</label>
                        <input
                            type="number"
                            name="totalFan"
                            value={formData.totalFan}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                        <label>Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Dates</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="input-field"
                                style={{ flex: 1 }}
                            />
                            <button className="icon-btn"><Calendar size={20} /></button>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <button
                            className="btn-outline"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isScanning}
                        >
                            {isScanning ? <Loader2 className="spin" size={18} /> : <Scan size={18} />}
                            {isScanning ? 'Scanning...' : 'Scan from Image'}
                        </button>

                        <button className="btn-primary" onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Save size={18} /> SAVE
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

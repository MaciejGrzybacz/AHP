'use client'

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function EditableText({ value, onChange, className = '' }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            onChange(tempValue);
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setTempValue(value);
        }
    };

    if (isEditing) {
        return (
            <Input
                value={tempValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempValue(e.target.value)}
                onBlur={() => {
                    setIsEditing(false);
                    onChange(tempValue);
                }}
                onKeyDown={handleKeyDown}
                className={className}
                autoFocus
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer hover:bg-gray-100 p-2 rounded ${className}`}
        >
            {value}
        </div>
    );
}
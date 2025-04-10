import React from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonLoaderProps {
    lines?: number; // Number of lines to render
    widths?: string[]; // Array of widths for each line
    borderRadius?: string; // Border radius for each line
    baseColor?: string; 
    highlightColor: string;
  }

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = (props) => {
    const {lines=0, widths, borderRadius, baseColor, highlightColor} = props;
    return (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} borderRadius={borderRadius}>
            {Array.from({length: lines}).map((_, index) => (
                <Skeleton key={index} width={widths?.[index]}/>
            ))}
        </SkeletonTheme>
    )
}
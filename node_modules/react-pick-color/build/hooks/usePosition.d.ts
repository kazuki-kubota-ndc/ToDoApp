/// <reference types="react" />
export declare type Position = {
    left: number;
    top: number;
};
export declare type usePositionProps = {
    onMove: (value: Position) => void;
};
declare const usePosition: ({ onMove }: usePositionProps) => {
    ref: import("react").RefObject<HTMLDivElement>;
    handleStart: (e: any) => void;
};
export default usePosition;

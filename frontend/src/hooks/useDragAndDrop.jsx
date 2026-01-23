// hooks/useDragAndDrop.js
import { useState, useCallback } from "react";

export const useDragAndDrop = (onFileDrop) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        if (e.type === "dragleave") setDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileDrop(e.dataTransfer.files[0]);
        }
    }, [onFileDrop]);

    return { dragActive, handleDrag, handleDrop };
};

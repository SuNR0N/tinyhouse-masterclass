import { createContext, useContext } from 'react';

import { Viewer } from '../models/viewer';

interface ViewerContext {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const ViewerContext = createContext<ViewerContext | undefined>(undefined);

export const ViewerContextProvider = ViewerContext.Provider;

export const useViewerContext = () => {
    const context = useContext(ViewerContext);
    if (!context) {
        throw new Error('useViewerContext must be used within a ViewerContextProvider');
    }

    return context;
};

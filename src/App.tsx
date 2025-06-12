import React from "react";
import Providers from "./Providers.tsx";
import AppRoutes from "./routes";


const App: React.FC = () => {
    return (
        <Providers>
            <div className="bg-white w-full h-dscreen font-sans">
                <AppRoutes />
            </div>
        </Providers>
    );
}

export default App;
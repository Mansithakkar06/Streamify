import React, { useEffect, useState } from 'react'
import DevicenotSupported from './pages/DevicenotSupported';

function ScreenGuard({children}) {
    const [isDesktop, setIsDesktop] = useState(
        window.innerWidth >= 1024
    );

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isDesktop ? children : <DevicenotSupported />;
}

export default ScreenGuard

import { useEffect, useRef, useState } from "react";

const useIdleTimeout = (onLogout, idleTime = 15 * 60 * 1000) => {
    const [showModal, setShowModal] = useState(false);

    const timerRef = useRef(null);
    const warningTimerRef = useRef(null);
    const showModalRef = useRef(false);

    const WARNING_TIME = Math.max(idleTime - 5 * 1000, 0);

    useEffect(() => {
        showModalRef.current = showModal;
    }, [showModal]);

    const resetTimer = () => {
        if (showModalRef.current) return;

        clearTimeout(timerRef.current);
        clearTimeout(warningTimerRef.current);

        warningTimerRef.current = setTimeout(() => {
            setShowModal(true);
        }, WARNING_TIME);

        timerRef.current = setTimeout(() => {
            onLogout();
        }, idleTime);
    };

    useEffect(() => {
        //  user activity listeners
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer); // optional

        resetTimer(); // start timer

        return () => {
            clearTimeout(timerRef.current);
            clearTimeout(warningTimerRef.current);

            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);
        };
    }, []);

    return { showModal, setShowModal, resetTimer };
};

export default useIdleTimeout;
import { useEffect, useRef } from "react";
import socketService from "../services/websocket/socketService";

const useSupportSocket = ({ threadId, onMessageReceived }) => {
    const previousThreadId = useRef(null);

    useEffect(() => {
        if (!threadId) return;

        // Leave previous thread
        if (previousThreadId.current && previousThreadId.current !== threadId) {
            socketService.leaveThread(previousThreadId.current);
        }

        previousThreadId.current = threadId;

        // Connect and join
        socketService.connect();

        const channel = socketService.joinThread(threadId, (message) => {
            console.log("🎉 Message received in hook:", message);
            if (onMessageReceived) {
                onMessageReceived(message);
            }
        });

        return () => {
            if (previousThreadId.current === threadId) {
                socketService.leaveThread(threadId);
            }
        };
    }, [threadId, onMessageReceived]);
};

export default useSupportSocket;
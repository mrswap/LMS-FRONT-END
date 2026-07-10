import { useEffect, useRef } from "react";
import socketService from "../services/websocket/socketService";

const useSupportSocket = ({ threadId, onMessageReceived }) => {
    const previousThreadId = useRef(null);

    useEffect(() => {
        if (!threadId) return;

        if (previousThreadId.current && previousThreadId.current !== threadId) {
            socketService.leaveThread(previousThreadId.current);
        }

        previousThreadId.current = threadId;

        socketService.connect();

        const channel = socketService.joinThread(threadId, (message) => {
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
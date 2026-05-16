import Pusher from "pusher-js";

let pusher = null;
let activeChannels = {};

const PUSHER_CONFIG = {
    key: "d40bce87f29057b18c8f",
    cluster: "ap2",
};

class SocketService {
    connect() {
        if (pusher && pusher.connection.state === 'connected') {
            return pusher;
        }

        const token = localStorage.getItem("token");
        // const deviceId = localStorage.getItem("deviceId");

        if (!token) {
            console.error("❌ No token found");
            return null;
        }

        pusher = new Pusher(PUSHER_CONFIG.key, {
            authEndpoint: "https://lms-backend.netswaptech.com/api/broadcasting/auth",
            cluster: PUSHER_CONFIG.cluster,
            forceTLS: true,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    // "X-Device-Id": deviceId,
                },
            },
        });

        pusher.connection.bind("connected", () => {
            console.log("✅ Pusher connected");
        });

        pusher.connection.bind("error", (err) => {
            console.error("❌ Pusher error:", err);
        });

        return pusher;
    }

    joinThread(threadId, callback) {
        if (!threadId) {
            console.error("❌ No threadId");
            return null;
        }

        console.log(`🔌 Joining thread: ${threadId}`);

        if (!pusher) {
            this.connect();
        }

        if (pusher.connection.state !== 'connected') {
            console.log("⏳ Waiting for connection...");
            setTimeout(() => {
                this.joinThread(threadId, callback);
            }, 1000);
            return null;
        }

        const channelName = `private-support.thread.${threadId}`;

        if (activeChannels[channelName]) {
            console.log(`Already in channel: ${channelName}`);
            return activeChannels[channelName];
        }

        console.log(`📡 Subscribing to: ${channelName}`);
        const channel = pusher.subscribe(channelName);

        channel.bind("pusher:subscription_succeeded", () => {
            console.log(`✅ Subscribed to ${channelName}`);
        });

        // 🔥 CRITICAL: Listen to ALL possible event names
        const possibleEvents = [
            "support.message.sent",
            "App\\Events\\SupportMessageSent",
            "SupportMessageSent",
            "message.sent",
            "new_message"
        ];

        possibleEvents.forEach(eventName => {
            channel.bind(eventName, (data) => {
                console.log(`📨 Event "${eventName}" received:`, data);

                // Extract message from different possible structures
                let message = data?.message || data?.data?.message || data;

                if (message?.id) {
                    console.log("✅ Valid message:", message);
                    callback(message);
                } else {
                    console.warn("⚠️ No valid message in event:", data);
                }
            });
        });

        // Debug: Log ALL events
        channel.bind_global((eventName, data) => {
            console.log(`🌍 [GLOBAL] Event: ${eventName}`, data);
        });

        activeChannels[channelName] = channel;
        return channel;
    }

    leaveThread(threadId) {
        const channelName = `private-support.thread.${threadId}`;
        if (pusher && activeChannels[channelName]) {
            pusher.unsubscribe(channelName);
            delete activeChannels[channelName];
        }
    }

    disconnect() {
        if (pusher) {
            pusher.disconnect();
            pusher = null;
            activeChannels = {};
        }
    }
}

export default new SocketService();
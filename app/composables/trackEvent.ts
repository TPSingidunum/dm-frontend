// Session id

export function getOrGenerateSessionId() {
    if (import.meta.client) { // Do not execute this on the server
        // Only on hte client side
        let sessionId = localStorage.getItem('user_session')

        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString()}`
            localStorage.setItem("user_session", sessionId)
        }

        return sessionId;
    }
}

export async function tractEvent(eventType: string, productId: number) {

    const sessionId = getOrGenerateSessionId();
    await $fetch("/api/event/tract", {
        method: "POST",
        body: {
            event_type: eventType,
            product_id: productId,
            user_session: sessionId
        }
    })
}
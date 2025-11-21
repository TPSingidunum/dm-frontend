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

export async function trackEvent(eventType: string, productId: number) {

    const sessionId = getOrGenerateSessionId();
    return await $fetch("/api/event/track", {
        method: "POST",
        body: {
            event_type: eventType,
            product_id: productId,
            user_session: sessionId
        }
    })
}

export async function addToShoppingCartEvent(product_id: number) {
    // To save this to a shopping cart componnet to show the user
    return trackEvent('add_to_cart', product_id);
}

export async function buyProductEvent(product_id: number) {
    return trackEvent('purchase', product_id);
}
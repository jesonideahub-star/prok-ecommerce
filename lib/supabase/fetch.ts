function offlineResponse() {
  return new Response(JSON.stringify({ error: "offline" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

export function supabaseFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return fetch(input, init).catch(() => offlineResponse());
  } catch {
    return Promise.resolve(offlineResponse());
  }
}

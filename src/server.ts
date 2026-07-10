export default {
  async fetch() {
    return new Response("CloudAxis Vite app is running", {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};

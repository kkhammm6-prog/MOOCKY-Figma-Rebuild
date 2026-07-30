/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/prototypes/public-course-detail",
        has: [
          {
            type: "query",
            key: "course",
            value: "(?<course>[^/]+)",
          },
        ],
        destination: "/courses/:course",
        permanent: false,
      },
      {
        source: "/prototypes/public-course-detail",
        destination: "/courses/cognitive-interface-architecture",
        permanent: false,
      },
      {
        source: "/prototypes/redeem-preview",
        destination: "/redeem",
        permanent: false,
      },
    ];
  },
  outputFileTracingIncludes: {
    "/api/moocky-ai": ["./docs/ai-system-prompt.md"],
    "/api/moocky-ai/stream": ["./docs/ai-system-prompt.md"],
    "/api/moocky-ai/health": ["./docs/ai-system-prompt.md"],
  },
};

export default nextConfig;

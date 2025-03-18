import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Clerk modules
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockReturnValue({ userId: "mocked-user-id" }),
  clerkClient: {
    users: {
      getUser: jest.fn().mockResolvedValue({
        id: "mocked-user-id",
        firstName: "Test",
        lastName: "User",
      }),
    },
  },
}));

// jest.setup.js
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
// Add this to your jest.setup.ts
jest.mock("@/utils/cache", () => ({
  __esModule: true,
  default: jest.fn((cb, keyParts, options) => cb),
}));
// Add this to your jest.setup.ts
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((cb) => cb),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      headers: new Headers(init?.headers || {}),
      json: async () => body,
      body,
    })),
  },
}));

global.Request = jest.fn().mockImplementation((url, options = {}) => ({
  url,
  method: options.method || "GET",
  headers: new Headers(options.headers || {}),
  body: options.body,
  json: async () => JSON.parse(options.body),
}));

global.Response = jest.fn().mockImplementation((body, init = {}) => ({
  status: init.status || 200,
  headers: new Headers(init.headers || {}),
  ok: init.status ? init.status >= 200 && init.status < 300 : true,
  json: async () => (typeof body === "string" ? JSON.parse(body) : body),
}));

global.Headers = jest.fn().mockImplementation(() => ({
  append: jest.fn(),
  get: jest.fn(),
  has: jest.fn(),
}));

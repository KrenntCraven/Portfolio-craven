/**
 * Unit tests for CravunLauncher.
 *
 * Verifies the floating launcher renders, lazily mounts the chat panel on
 * first open, and closes it again — without touching the network or the real
 * streaming chat component.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "variants", "transition",
  "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
  "layout", "layoutId",
]);
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    __esModule: true,
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    motion: new Proxy(
      {},
      {
        get: (_t, tag: string) =>
          ({ children, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) => {
            const clean = Object.fromEntries(
              Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k)),
            );
            return React.createElement(tag, clean, children);
          },
      },
    ),
  };
});

// Lightweight stand-in for the streaming chat panel.
jest.mock("@/app/frontend/chatbot/cravun-chat", () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="cravun-chat">
        <button onClick={onClose}>close-panel</button>
      </div>
    ) : null,
}));

// next/dynamic → resolve synchronously to the mocked chat component.
jest.mock("next/dynamic", () => () =>
  require("@/app/frontend/chatbot/cravun-chat").default,
);

import CravunLauncher from "@/app/frontend/chatbot/cravun-launcher";

describe("CravunLauncher", () => {
  it("renders the floating launcher button", () => {
    render(<CravunLauncher />);
    expect(
      screen.getByRole("button", { name: /open cravun assistant/i }),
    ).toBeInTheDocument();
  });

  it("does not mount the chat panel until first opened", () => {
    render(<CravunLauncher />);
    expect(screen.queryByTestId("cravun-chat")).not.toBeInTheDocument();
  });

  it("opens the chat panel when the launcher is clicked", async () => {
    const user = userEvent.setup();
    render(<CravunLauncher />);
    await user.click(
      screen.getByRole("button", { name: /open cravun assistant/i }),
    );
    expect(screen.getByTestId("cravun-chat")).toBeInTheDocument();
  });

  it("closes the chat panel again", async () => {
    const user = userEvent.setup();
    render(<CravunLauncher />);
    await user.click(
      screen.getByRole("button", { name: /open cravun assistant/i }),
    );
    await user.click(screen.getByText("close-panel"));
    expect(screen.queryByTestId("cravun-chat")).not.toBeInTheDocument();
  });
});

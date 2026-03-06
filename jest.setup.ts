import "@testing-library/jest-dom";

// Silence expected React DOM warnings that come from mocked components receiving
// Next.js / framer-motion specific props (fill, priority, whileHover, etc.)
const SILENCED = [
  /Received `true` for a non-boolean attribute/,
  /React does not recognize the `(whileHover|whileTap|whileFocus|whileDrag|whileInView|startContent|fullWidth|initial|animate|exit|variants|transition|layout|layoutId)` prop/,
];

const originalError = console.error.bind(console);
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    if (SILENCED.some((r) => r.test(String(args[0])))) return;
    originalError(...args);
  });
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
});

// --------------------------------------------------------
// helpers
// --------------------------------------------------------
/**
 * Just some log helper, in case it is needed.
 */
function logMockFunction(name: string, args?: any[]) {
  // if (args) {
  //   console.log(`[jest-global-mocks] ${name} called with`, ...args);
  // } else {
  //   console.log(`[jest-global-mocks] ${name} called`);
  // }
}

// --------------------------------------------------------
// `this` context
// --------------------------------------------------------
// Whatever the global context is, relates to
// browser or node.js executions
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const whateverThisIs = window || global;

// --------------------------------------------------------
// window mocks
// --------------------------------------------------------

// --------------------------------------------------------
// domain mocks
// --------------------------------------------------------

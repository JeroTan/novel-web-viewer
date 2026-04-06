# test
Unit and integration tests using Vitest.

## Quick Start
- Place test files next to source files as `*.test.ts` or in this folder as `**/*.test.ts`.
- Run all tests: `npm test`
- Run once (CI mode): `npm run build` (includes `vitest run`)
- Watch mode: `npm test` (Vitest default)

## Writing a Test
```typescript
import { describe, it, expect } from 'vitest';

describe('MyModule', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
});
```

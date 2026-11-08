import { describe, expect, it } from 'vitest';

import { validateRoleTitle } from './role-title-rules';

describe('validateRoleTitle', () => {
  it('needs 1 to 100 characters after trimming', () => {
    expect(validateRoleTitle('   ')).toBe('Вкажіть назву ролі.');
    expect(validateRoleTitle('a'.repeat(101))).toBe('Назва ролі — не більше 100 символів.');
    expect(validateRoleTitle(' Логіст ')).toBeNull();
    expect(validateRoleTitle('a'.repeat(100))).toBeNull();
  });
});

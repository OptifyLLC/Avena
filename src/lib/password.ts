export type PasswordRule = {
  key: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "lower", label: "A lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "upper", label: "An uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "digit", label: "A number (0-9)", test: (p) => /\d/.test(p) },
  { key: "symbol", label: "A symbol (!@#$%…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function isPasswordStrong(password: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(password));
}

export function firstPasswordFailure(password: string): string | null {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return rule.label;
  }
  return null;
}

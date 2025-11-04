/**
 * Icon size composable
 */

export function useIconSizes() {
  return {
    xxs: 16,
    xs: 20,
    sm: 24,
    md: 34,
    lg: 40,
    xl: 50,
    xxl: 100
  } as const
}

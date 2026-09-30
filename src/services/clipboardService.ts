/**
 * Copies sensitive text to clipboard and schedules auto-clear after delay.
 */
export async function copyToClipboardWithAutoClear(
  text: string,
  clearDelayMs = 30000
): Promise<{ success: boolean; clearTimerId?: number }> {
  if (!navigator?.clipboard?.writeText) {
    return { success: false };
  }

  try {
    await navigator.clipboard.writeText(text);

    // Schedule clipboard wipe after delay
    let timerId: number | undefined = undefined;
    if (clearDelayMs > 0) {
      timerId = window.setTimeout(async () => {
        try {
          // Check if clipboard still holds the same text before clearing
          const current = await navigator.clipboard.readText();
          if (current === text) {
            await navigator.clipboard.writeText('');
          }
        } catch {
          // Permission to readText might not be granted; overwrite anyway
          await navigator.clipboard.writeText('');
        }
      }, clearDelayMs);
    }

    return { success: true, clearTimerId: timerId };
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return { success: false };
  }
}

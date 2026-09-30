import type { PatternMatch } from '../../types/analyzer';

/**
 * Detects standalone years (1900-2099) and common full date formats.
 */
export function findDates(password: string): PatternMatch[] {
  const matches: PatternMatch[] = [];

  // 1. Formatted dates: YYYY-MM-DD, DD/MM/YYYY, MM-DD-YYYY, etc.
  const fullDateRegex = /(?:^|[^0-9])((?:19\d\d|20\d\d)[-/.](?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12]\d|3[01])|(?:0[1-9]|[12]\d|3[01])[-/.](?:0[1-9]|1[0-2])[-/.](?:19\d\d|20\d\d))(?:$|[^0-9])/g;
  let fullMatch;
  while ((fullMatch = fullDateRegex.exec(password)) !== null) {
    const token = fullMatch[1];
    const startIndex = fullMatch.index + fullMatch[0].indexOf(token);
    const endIndex = startIndex + token.length;
    matches.push({
      id: `date-full-${startIndex}`,
      type: 'date',
      token,
      startIndex,
      endIndex,
      description: `Full calendar date pattern ("${token}")`,
      severity: 'high',
    });
  }

  // 2. Compact 8-digit date: YYYYMMDD or DDMMYYYY
  const compactDateRegex = /(?:^|[^0-9])((?:19\d\d|20\d\d)(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])|(?:0[1-9]|[12]\d|3[01])(?:0[1-9]|1[0-2])(?:19\d\d|20\d\d))(?:$|[^0-9])/g;
  let compactMatch;
  while ((compactMatch = compactDateRegex.exec(password)) !== null) {
    const token = compactMatch[1];
    const startIndex = compactMatch.index + compactMatch[0].indexOf(token);
    const endIndex = startIndex + token.length;

    const isCovered = matches.some(m => startIndex >= m.startIndex && endIndex <= m.endIndex);
    if (!isCovered) {
      matches.push({
        id: `date-compact-${startIndex}`,
        type: 'date',
        token,
        startIndex,
        endIndex,
        description: `Compact date format ("${token}")`,
        severity: 'high',
      });
    }
  }

  // 3. Standalone 4-digit years (1920-2035)
  const yearRegex = /(?:^|[^0-9])(19[2-9]\d|20[0-3]\d)(?:$|[^0-9])/g;
  let yearMatch;
  while ((yearMatch = yearRegex.exec(password)) !== null) {
    const yearToken = yearMatch[1];
    const startIndex = yearMatch.index + yearMatch[0].indexOf(yearToken);
    const endIndex = startIndex + yearToken.length;

    const isCovered = matches.some(m => startIndex >= m.startIndex && endIndex <= m.endIndex);
    if (!isCovered) {
      matches.push({
        id: `date-year-${startIndex}`,
        type: 'date',
        token: yearToken,
        startIndex,
        endIndex,
        description: `Recent calendar year ("${yearToken}")`,
        severity: 'medium',
      });
    }
  }

  return matches;
}

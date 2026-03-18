# Exercise 5 - Prompt

You are an experienced Senior QA Automation Engineer with expertise in TypeScript and Playwright E2E testing.

Project & framework:  
- Stack: TypeScript + Playwright  

- File to fix:  
// path: src/utils/DateHelper.ts  

- Code to fix:  
 static formatLocalDate(date?: Date, locale = 'en-GB'): string {
  return date!.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  }

Problem:  
Function throws on null/undefined input. Must return empty string in that case.  

Fix:  
- Add null/undefined guard.  
- Keep other behavior unchanged (format valid Date objects using toLocaleDateString).  
- Keep function signature consistent with project.  
- Output corrected code only.

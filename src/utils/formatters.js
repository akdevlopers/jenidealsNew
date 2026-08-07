/**
 * Formats a discount value by ensuring it has exactly one leading minus sign.
 * @param {string|number} value - The discount value (e.g., 10, "10%", "-10").
 * @returns {string} The formatted discount string (e.g., "-10", "-10%").
 */
export const formatDiscountLabel = (value) => {
  if (value === undefined || value === null || value === "") return "";
  
  const stringValue = String(value).trim();
  if (stringValue === "0" || stringValue === "0%") return "";
  
  // Strip any leading dashes and then prepend one
  const cleanValue = stringValue.replace(/^-+/, "");
  return `-${cleanValue}`;
};

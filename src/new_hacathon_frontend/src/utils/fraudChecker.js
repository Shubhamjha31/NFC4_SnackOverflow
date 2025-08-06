// utils/fraudChecker.js
export function simpleFraudCheck(credentials) {
  if (!Array.isArray(credentials) || credentials.length === 0) {
    return { verdict: "legit", reason: "No credentials to analyze" };
  }

  // Count revoked credentials
  const revokedCount = credentials.filter(c => c.revoked).length;
  const revokedRatio = revokedCount / credentials.length;

  if (revokedRatio > 0.3) {
    return { verdict: "fraud", reason: `High revoked rate: ${(revokedRatio * 100).toFixed(1)}%` };
  }

  // Group by issue date
  const dateCounts = {};
  credentials.forEach(c => {
    const date = c.dateIssued || c.issueDate;
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });

  for (const [date, count] of Object.entries(dateCounts)) {
    if (count > 5) {
      return { verdict: "fraud", reason: `Too many credentials issued on ${date} (${count})` };
    }
  }

  // Check expiry anomalies
  const suspiciousExpiry = credentials.some(c => {
    if (c.expiry && c.issueDate && new Date(c.expiry) < new Date(c.issueDate)) {
      return true;
    }
    return false;
  });

  if (suspiciousExpiry) {
    return { verdict: "fraud", reason: "Some credentials have expiry dates before issue dates" };
  }

  return { verdict: "legit", reason: "No suspicious patterns found" };
}

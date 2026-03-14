const calculateStatus = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "expired";
  } else if (diffDays <= 30) {
    return "renewal";
  }
  return null;
};

module.exports = calculateStatus;
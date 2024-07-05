const employeeOptionMapping=[
  'View Menu', 'View Notification', 'Give Feedback','Vote for Recommended Menu','Give Detailed Feedback for Discard Item','Logout',
]

const chefOptionMapping=[
  'Roll Out Items', 'Send Final Menu','View Menu','View Notifcation','View Discard Menu','Logout',
]

const adminOptionMapping=[
  'Add Item','Update Item','Delete Item','View Menu','Logout'
]

export const getFunctionsByRole = (roleName: string) => {
  switch (roleName) {
    case "employee":
      return employeeOptionMapping;
    case "admin":
      return adminOptionMapping;
    case "chef":
      return chefOptionMapping;
    default:
      return null;
  }
};

export function getTopWords(words: string[], topN: number): string[] {
  const wordCount: { [key: string]: number } = {};

  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(topN, Object.entries(wordCount).length))
    .map(entry => entry[0]);
}

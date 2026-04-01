export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const getPersonalityPromptModifier = (
  personality: "friendly" | "formal" | "energetic" | "calm"
): string => {
  const modifiers = {
    friendly:
      "Be warm, conversational, and use a casual friendly tone. Use friendly language and emojis occasionally.",
    formal:
      "Be professional and use a formal tone. Maintain a business-like demeanor and use proper grammar.",
    energetic:
      "Be enthusiastic and lively. Use exclamation marks, energy, and excitement in your responses.",
    calm:
      "Be soft, balanced, and peaceful. Use gentle language and maintain a serene, composed tone.",
  };

  return modifiers[personality];
};

export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

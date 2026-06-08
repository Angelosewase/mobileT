export interface WordOfTheDay {
  word: string;
  definition: string;
  partOfSpeech: string;
  example?: string;
  funFact?: string;
}

const wordsOfTheDay: WordOfTheDay[] = [
  {
    word: "serendipity",
    definition: "The occurrence of events by chance in a happy or beneficial way",
    partOfSpeech: "noun",
    example: "A fortunate stroke of serendipity brought them together.",
    funFact: "Coined in 1754 by Horace Walpole, inspired by a Persian fairy tale.",
  },
  {
    word: "ephemeral",
    definition: "Lasting for a very short time",
    partOfSpeech: "adjective",
    example: "The ephemeral beauty of cherry blossoms draws millions of visitors.",
    funFact: "From Greek 'ephemeros' meaning 'lasting only a day'.",
  },
  {
    word: "eloquent",
    definition: "Fluent or persuasive in speaking or writing",
    partOfSpeech: "adjective",
    example: "Her eloquent speech moved the entire audience to tears.",
    funFact: "Derives from Latin 'eloquens' - speaking out.",
  },
  {
    word: "resilient",
    definition: "Able to withstand or recover quickly from difficult conditions",
    partOfSpeech: "adjective",
    example: "The resilient community rebuilt after the disaster.",
    funFact: "Originally used in physics to describe materials that spring back.",
  },
  {
    word: "ubiquitous",
    definition: "Present, appearing, or found everywhere",
    partOfSpeech: "adjective",
    example: "Smartphones have become ubiquitous in modern society.",
    funFact: "From Latin 'ubique' meaning 'everywhere'.",
  },
  {
    word: "mellifluous",
    definition: "Sweet or musical; pleasant to hear",
    partOfSpeech: "adjective",
    example: "The singer's mellifluous voice filled the concert hall.",
    funFact: "Literally means 'flowing with honey' from Latin.",
  },
  {
    word: "sonder",
    definition: "The realization that each passerby has a life as vivid as your own",
    partOfSpeech: "noun",
    example: "Standing in the crowd, she felt a deep sense of sonder.",
    funFact: "A neologism coined by John Koenig in 'The Dictionary of Obscure Sorrows'.",
  },
  {
    word: "petrichor",
    definition: "A pleasant smell that frequently accompanies the first rain after a dry spell",
    partOfSpeech: "noun",
    example: "The petrichor after the summer storm was refreshing.",
    funFact: "Coined in 1964 by Australian scientists from Greek 'petra' (stone) and 'ichor' (the fluid in the veins of gods).",
  },
  {
    word: "ineffable",
    definition: "Too great or extreme to be expressed in words",
    partOfSpeech: "adjective",
    example: "The view from the mountaintop was of ineffable beauty.",
    funFact: "From Latin 'ineffabilis' - not to be spoken.",
  },
  {
    word: "luminous",
    definition: "Full of or shedding light; bright or shining",
    partOfSpeech: "adjective",
    example: "The luminous moon lit up the night sky.",
    funFact: "Related to 'illuminate' and 'luminary', all from Latin 'lumen' (light).",
  },
  {
    word: "ethereal",
    definition: "Extremely delicate and light in a way that seems too perfect for this world",
    partOfSpeech: "adjective",
    example: "The ethereal music transported listeners to another realm.",
    funFact: "From Greek 'aither', the upper air where gods were thought to dwell.",
  },
  {
    word: "cacophony",
    definition: "A harsh, discordant mixture of sounds",
    partOfSpeech: "noun",
    example: "The cacophony of car horns made conversation impossible.",
    funFact: "The opposite of 'euphony' (pleasant sound).",
  },
];

export function getWordOfTheDay(): WordOfTheDay {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return wordsOfTheDay[dayOfYear % wordsOfTheDay.length];
}

export interface QuickFact {
  title: string;
  content: string;
  icon: string;
}

const quickFacts: QuickFact[] = [
  {
    title: "Most Common Letter",
    content: "The letter 'E' appears in about 11% of all English words",
    icon: "text",
  },
  {
    title: "Longest Word",
    content: "Pneumonoultramicroscopicsilicovolcanoconiosis (45 letters) is the longest word in major dictionaries",
    icon: "resize",
  },
  {
    title: "Word Origins",
    content: "About 60% of English words have Latin or Greek origins",
    icon: "globe",
  },
  {
    title: "New Words",
    content: "Around 1,000 new words are added to the dictionary each year",
    icon: "add-circle",
  },
  {
    title: "Shakespeare's Legacy",
    content: "Shakespeare invented over 1,700 words including 'lonely', 'generous', and 'assassination'",
    icon: "create",
  },
  {
    title: "Silent Letters",
    content: "About 60% of English words contain silent letters",
    icon: "volume-mute",
  },
  {
    title: "Palindrome Power",
    content: "'Rotavator' is the longest single-word palindrome in English",
    icon: "sync",
  },
];

export function getRandomFact(): QuickFact {
  return quickFacts[Math.floor(Math.random() * quickFacts.length)];
}

export function getDailyFact(): QuickFact {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return quickFacts[dayOfYear % quickFacts.length];
}

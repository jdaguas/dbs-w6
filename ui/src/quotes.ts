// Daily quotes. One is picked per date, so it stays the same all day.
export const QUOTES: { text: string; by: string }[] = [
  { text: 'Well begun is half done.', by: 'Aristotle' },
  { text: 'A journey of a thousand miles begins with a single step.', by: 'Laozi' },
  { text: 'Knowing is not enough; we must apply. Willing is not enough; we must do.', by: 'Johann Wolfgang von Goethe' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', by: 'Will Durant' },
  { text: 'Inspiration exists, but it has to find you working.', by: 'Pablo Picasso' },
  { text: 'I am always doing that which I cannot do, in order that I may learn how to do it.', by: 'Pablo Picasso' },
  { text: 'Genius is one percent inspiration and ninety-nine percent perspiration.', by: 'Thomas Edison' },
  { text: 'Nothing in life is to be feared, it is only to be understood.', by: 'Marie Curie' },
  { text: 'If I have seen further, it is by standing on the shoulders of giants.', by: 'Isaac Newton' },
  { text: 'Do what you can, with what you have, where you are.', by: 'Theodore Roosevelt' },
  { text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', by: 'Antoine de Saint-Exupéry' },
  { text: 'The best way to predict the future is to invent it.', by: 'Alan Kay' },
  { text: 'Simplicity is prerequisite for reliability.', by: 'Edsger W. Dijkstra' },
  { text: 'Make it work, make it right, make it fast.', by: 'Kent Beck' },
  { text: 'Talk is cheap. Show me the code.', by: 'Linus Torvalds' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', by: 'Harold Abelson & Gerald Jay Sussman' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', by: 'Martin Fowler' },
  { text: 'The only way to do great work is to love what you do.', by: 'Steve Jobs' },
  { text: 'Stay hungry. Stay foolish.', by: 'Stewart Brand, quoted by Steve Jobs' },
  { text: 'You miss 100% of the shots you don’t take.', by: 'Wayne Gretzky' },
  { text: 'Hard work beats talent when talent doesn’t work hard.', by: 'Tim Notke' },
  { text: 'Fall seven times, stand up eight.', by: 'Japanese proverb' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', by: 'Proverb' },
  { text: 'You don’t have to be great to start, but you have to start to be great.', by: 'Zig Ziglar' },
];

export function quoteFor(date: string) {
  // Days since epoch → index, so consecutive days get consecutive quotes.
  const days = Math.floor(new Date(date + 'T12:00Z').getTime() / 864e5);
  return QUOTES[((days % QUOTES.length) + QUOTES.length) % QUOTES.length];
}

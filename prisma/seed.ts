import { PrismaClient } from "@prisma/client";
import pets from "../data/pets.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  const users = [
    "burhan",
    "clay",
    "derek",
    "hazel",
    "mallory",
    "ming",
    "thomas",
  ];

  await Promise.all(
    users.map(async (user) => {
      const email = `${user}@example.test`;
      const posts = new Array(Math.floor(Math.random() * 20))
        .fill(0)
        .map((_, i) => ({
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
          ),
          downvotes: Math.floor(Math.random() * 100),
          upvotes: Math.floor(Math.random() * 1000),
          content: generateRandomSentence(20 + Math.floor(Math.random() * 100)),
          groupId: null,
        }));

      const userUpsert = await prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
          email,
          name: user,
          posts: {
            createMany: {
              data: posts.map((p) => ({
                ...p,
              })),
            },
          },
        },
        select: {
          posts: {
            select: {
              id: true,
              createdAt: true,
            },
          },
          id: true,
        },
      });
      await Promise.all(
        userUpsert.posts.map(async (post) => {
          const comments = new Array(Math.floor(Math.random() * 7)).fill(0);
          const createComments = await prisma.comment.createMany({
            data: comments.map((c) => ({
              content: generateRandomSentence(
                2 + Math.floor(Math.random() * 4),
              ),
              postId: post.id,
              createdById: userUpsert.id,
              createdAt: new Date(
                post.createdAt.getTime() +
                  Math.floor(Math.random() * 4) * 24 * 60 * 60 * 1000,
              ),
            })),
          });
          await prisma.post.update({
            where: { id: post.id },
            data: {
              numComments: {
                increment: createComments.count,
              },
            },
          });
        }),
      );
    }),
  );

  await Promise.all(
    pets.map(async (animal) => {
      await prisma.animal.upsert({
        where: { name: animal.animal },
        update: {},
        create: {
          name: animal.animal,
          breeds: {
            createMany: {
              skipDuplicates: true,
              data: animal.breeds.map((b) => ({
                name: b,
              })),
            },
          },
        },
      });
    }),
  );

  console.log("seeded");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function generateRandomSentence(sentenceLength = 10): string {
  const verbs: string[] = ["run", "jump", "eat", "sleep", "dance", "laugh"];
  const nouns: string[] = ["cat", "dog", "sun", "moon", "tree", "ocean"];
  const adjectives: string[] = [
    "happy",
    "green",
    "sparkling",
    "giant",
    "mysterious",
    "playful",
  ];
  const adverbs: string[] = [
    "quickly",
    "silently",
    "joyfully",
    "unexpectedly",
    "carefully",
    "randomly",
  ];

  const getRandomWord = (wordBank: string[]): string => {
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    return wordBank[randomIndex] ?? "";
  };

  let sentence = "";

  for (let j = 0; j < sentenceLength; j++) {
    const subject = getRandomWord(nouns);
    const verb = getRandomWord(verbs);
    const adjective = getRandomWord(adjectives);
    const adverb = getRandomWord(adverbs);
    const object = getRandomWord(nouns);

    sentence += `${subject} ${adverb} ${verb} a ${adjective} ${object}. `;
  }
  return sentence;
}

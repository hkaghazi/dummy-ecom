import prisma from '@/lib/db'
import { QuoteKind } from '@/lib/prisma-enums'

const main = async () => {
  console.log('Seeding database...')
  console.time('Seeding complete 🌱')

  await prisma.quotes.deleteMany()

  await prisma.quotes.createMany({
    skipDuplicates: true,
    data: [
      {
        quote: 'The only way to do great work is to love what you do.',
        kind: QuoteKind.Opinion,
      },
      {
        quote:
          'Success is not final, failure is not fatal: It is the courage to continue that counts.',
        kind: QuoteKind.Opinion,
      },
      {
        quote: 'In the middle of every difficulty lies opportunity.',
        kind: QuoteKind.Opinion,
      },
      {
        quote: "Believe you can and you're halfway there.",
        kind: QuoteKind.Opinion,
      },
            {
        quote:
          'The future belongs to those who believe in the beauty of their dreams.',
        kind: QuoteKind.Opinion,
      },
      {
        quote:
          'Do not wait for the perfect moment, take the moment and make it perfect.',
        kind: QuoteKind.Opinion,
      },
      {
        quote: 'The only source of knowledge is experience.',
        kind: QuoteKind.Opinion,
      },

      // Facts
      {
        quote: 'Honey never spoils and can last thousands of years.',
        kind: QuoteKind.Fact,
      },
      {
        quote: 'Bananas are berries, but strawberries are not.',
        kind: QuoteKind.Fact,
      },
      { quote: 'Octopuses have three hearts.', kind: QuoteKind.Fact },
      {
        quote: "A group of flamingos is called a 'flamboyance'.",
        kind: QuoteKind.Fact,
      },
      {
        quote: 'Humans share 60% of their DNA with bananas.',
        kind: QuoteKind.Fact,
      },
      {
        quote: 'The Eiffel Tower can be 15 cm taller during hot days.',
        kind: QuoteKind.Fact,
      },
      { quote: 'Wombat poop is cube-shaped.', kind: QuoteKind.Fact },
      {
        quote:
          'Some metals are so reactive that they explode on contact with water.',
        kind: QuoteKind.Fact,
      },
      {
        quote:
          'There are more stars in the universe than grains of sand on Earth.',
        kind: QuoteKind.Fact,
      },
      {
        quote: 'Venus is the only planet that spins clockwise.',
        kind: QuoteKind.Fact,
      },
    ],
  })

  console.timeEnd('Seeding complete 🌱')
}

main()
  .then(() => {
    console.log('Process completed')
  })
  .catch((e) => console.log(e))
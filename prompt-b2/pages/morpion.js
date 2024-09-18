

import Head from 'next/head';
import Morpion from '../components/morpion';

const JeuMorpion = () => (
  <div>
    <Head>
      <title>Morpion</title>
      <meta name="description" content="Jeu de morpion en React avec Next.js" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <h1>Jeu de Morpion</h1>
      <Morpion />
    </main>
  </div>
);

export default JeuMorpion;

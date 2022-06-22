// ecosystem.config.js
// https://stackoverflow.com/q/60581617

module.exports = {
  apps: [
    {
      name: 'node-album-api',
      // On doit passer directement le chemin vers l'"exécutable" ts-node
      // script: './node_modules/.bin/ts-node',
      // Paramètres recommandés pour le fonctionnement en production
      // (Diminue l'empreinte mémoire)
      // args: '--transpile-only src/index.ts',
    },
  ],
};

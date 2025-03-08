#!/usr/bin/env node
const { program } = require('commander');
const degit = require('degit');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

program
    .version('1.0.0')
    .usage('<project-name>')
    .description('Génère un projet à partir du boilerplate react-native-expo-tailwind')
    .arguments('<projectName>')
    .action(async (projectName) => {
        console.log(`🚀 Création du projet "${projectName}"...\n`);

        const repo = '3myr/RNET-boilerplate';

        try {
            // Vérifier si le dossier du projet existe déjà
            if (fs.existsSync(projectName)) {
                console.error(`❌ Erreur : le dossier "${projectName}" existe déjà.`);
                process.exit(1);
            }

            console.log('📥 Clonage du boilerplate...');
            const emitter = degit(repo, { cache: false, force: true, verbose: true });

            await emitter.clone(projectName);
            console.log('✅ Boilerplate cloné avec succès !\n');

            // 🔹 Génére un sous-domaine unique
            const customDomain = `${projectName}-tunnel`;

            // 📄 Mise à jour du script start.sh
            const startShPath = path.join(projectName, 'start.sh');
            if (fs.existsSync(startShPath)) {
                console.log('🛠 Mise à jour du start.sh avec le sous-domaine personnalisé...');

                const customDomain = `${projectName}-tunnel`; // Génère un sous-domaine basé sur le nom du projet

                let startScript = fs.readFileSync(startShPath, 'utf-8');
                startScript = startScript.replace(/__TUNNEL_SUBDOMAIN__/g, customDomain); // Remplacement de la valeur

                fs.writeFileSync(startShPath, startScript);
                console.log(`✅ start.sh mis à jour avec le domaine "${customDomain}"\n`);
            }

            // 🔧 Personnalisation du package.json
            const packageJsonPath = path.join(projectName, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                console.log('🛠 Mise à jour du package.json...');
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

                // Remplace le nom du projet
                packageJson.name = projectName;

                // Remplace le sous-domaine dans "expose"
                if (packageJson.scripts && packageJson.scripts.expose) {
                    packageJson.scripts.expose = `npx lt --port 8081 --subdomain ${customDomain}`;
                }

                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
                console.log('✅ package.json mis à jour.\n');
            }

            // 📦 Installation des dépendances
            console.log('📦 Installation des dépendances (npm install)...');
            execSync(`cd ${projectName} && npm install`, { stdio: 'inherit' });
            console.log('✅ Dépendances installées.\n');

            console.log(`🎉 Projet "${projectName}" créé avec succès !\n`);

            console.log(`📂 Accédez au projet avec : cd ${projectName}`);
            console.log('🚀 Démarrez avec : npm start ou expo start\n');

            process.exit(0);
        } catch (err) {
            console.error('❌ Erreur lors de la création du projet :', err);
            process.exit(1);
        }
    });

program.parse(process.argv);

/**
 * Bootstrap du tout premier administrateur — jamais exposé en HTTP.
 * Usage : npx ts-node scripts/promote-to-admin.ts <email>
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Usage : npx ts-node scripts/promote-to-admin.ts <email>');
        process.exit(1);
    }

    const dataSource = new DataSource({ type: 'mysql', url: process.env.DATABASE_URL });
    await dataSource.initialize();

    const [user] = await dataSource.query('SELECT id, pseudo FROM utilisateur WHERE email = ?', [email]);
    if (!user) {
        console.error(`Aucun utilisateur avec l'email ${email}.`);
        await dataSource.destroy();
        process.exit(1);
    }

    const [existing] = await dataSource.query('SELECT id FROM administrateur WHERE id = ?', [user.id]);
    if (existing) {
        console.log(`${user.pseudo} (${email}) est déjà administrateur.`);
    } else {
        await dataSource.query('INSERT INTO administrateur (id, niveau_acces) VALUES (?, ?)', [user.id, 'STANDARD']);
        console.log(`${user.pseudo} (${email}) est maintenant administrateur.`);
    }

    await dataSource.destroy();
}

main();
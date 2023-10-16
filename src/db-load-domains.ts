import { AsyncDatabase } from 'promised-sqlite3';
import path from 'path';
import { open } from 'node:fs/promises';

async function main() {
	try {
		const db = await AsyncDatabase.open(path.join(__dirname, '../data/bimi.db'));

    const initialRowCount:any = await db.get('SELECT COUNT(*) AS count FROM domains');
    console.log(`INFO: initial row count: ${initialRowCount.count}`)

    const file = await open(path.join(__dirname, '../cloudflare-radar-domains-top-10000-20230814-20230821.csv'));
    for await (const line of file.readLines()) {
        await db.run('INSERT OR IGNORE INTO domains (domain) VALUES (?)', line.trim());
        console.log(line)
    }

    const finalRowCount:any = await db.get('SELECT COUNT(*) AS count FROM domains');
    console.log(`INFO: initial row count: ${finalRowCount.count}`)

		await db.close();
	} catch (err) {
		console.error(err);
	}
}


main();
import { AsyncDatabase } from 'promised-sqlite3';
import path from 'path';

async function main() {
	try {
		const db = await AsyncDatabase.open(path.join(__dirname, '../data/bimi.db'));

		const rows:any = await db.all("SELECT * FROM domains");

		for (const row of rows) {
			console.log(JSON.stringify(row));
		}

		await db.close();
	} catch (err) {
		console.error(err);
	}
}


main();

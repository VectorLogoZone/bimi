import { AsyncDatabase } from 'promised-sqlite3';
import dns from 'dns/promises';
import path from 'path';

async function checkDomain(db:AsyncDatabase, domain:string):Promise<boolean> {
  try {
    const result = await dns.resolveTxt(`default._bimi.${domain}`);
    await db.run('UPDATE domains SET dnsok = TRUE, dnsraw = ? WHERE domain = ?', JSON.stringify(result), domain);
    return true;
  } catch (err) {
    await db.run('UPDATE domains SET dnsok = FALSE, dnsraw = ? WHERE domain = ?', JSON.stringify(err), domain);
    return false;
  }
}

async function main() {
	try {
		const db = await AsyncDatabase.open(path.join(__dirname, '../data/bimi.db'));

		//const rows:any = await db.all("SELECT domain FROM domains WHERE dnsok IS NULL");
    const rows:any = await db.all("SELECT domain FROM domains WHERE dnsok IS NULL OR dnsok = FALSE");

    console.log(`INFO: checking ${rows.length} domains`);

    dns.setServers([
      "1.1.1.1",
      "8.8.8.8",
      "9.9.9.9",
    ]);

    /*
    // inconsistent results: maybe there is a rate limit somewhere?
    const pendingResults:Promise<boolean>[] = [];
		for (const row of rows) {
      pendingResults.push(checkDomain(db, row.domain));
		}
    const results = await Promise.all(pendingResults);
    const errCount = results.filter(x => !x).length;
    */
    let errCount = 0;
    for (const row of rows) {
      if (await checkDomain(db, row.domain) == false) {
        errCount++;
      }
    }

    console.log(`INFO: complete ${rows.length} checked, ${errCount} errors`);

		await db.close();
	} catch (err) {
		console.error(err);
	}
}


main();


/*
https://bimiradar.com/glob
https://www.spamresource.com/2023/06/by-numbers-dmarc-and-bimi-adoption-in.html
https://www.ctrl.blog/entry/bimi-adoption.html


https://www.mailmunch.com/blog/best-email-service-providers
*/
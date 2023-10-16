CREATE TABLE domains (
	domain VARCHAR(255) NOT NULL PRIMARY KEY,
	dnsok BOOLEAN,
	dnsraw TEXT,
	imgurl VARCHAR(1024),
	imgsvg VARCHAR(32768)
);

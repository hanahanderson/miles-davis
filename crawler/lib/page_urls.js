const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var starTime = moment();

var associateObject = {};
var index = 0;
var urls = "";
fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {
	var $ = cheerio.load(data);

	async.forEachSeries($("li"), (li, cb) => {

		var href = $(li).find("a").attr("href").slice(6);
		console.log(href)
		urls += `'${href}',\n`
		async.setImmediate(() => { cb(); });

	}, () => {

		fs.writeFile(`${__dirname}/../../data/urls.tsv`, urls);
		console.log("done");
	});
});
const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var starTime = moment();

var index = 0;

var outputFileName = `${__dirname}/../../data/interconnected.tsv`;

//fs.writeFile(outputFileName, "Page\tLink\tNum Occurences\t")
fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {

	var $ = cheerio.load(data);

 	var allHREFs = [];
	$("li").each((i, li) => {
		var href = $(li).find("a").attr("href").slice(6);
		allHREFs.push(href.toLowerCase())
		
	});


	// var newData = '<ul><li><a href="/wiki/Miles_Davis" title="Miles Davis">Miles Davis</a>  &lrm; <span class="mw-whatlinkshere-tools">(<a href="/w/index.php?title=Special:WhatLinksHere&amp;target=Miles Davis" title="Special:WhatLinksHere">links</a>&nbsp;| <a href="/w/index.php?title=Miles Davis&amp;action=edit" title="Miles Davis">edit</a>)</span></li><ul>'
	// var $2 = cheerio.load(newData);

	
	async.forEachSeries($("li"), (li, cb) => {

		var href = $(li).find("a").attr("href").slice(6);

		console.log("-----------------------------");
		console.log(`${index}/${$("li").length}`);
		console.log(href);
		console.log(`time elapsed: ${moment().diff(starTime, "minutes")} minutes \n`);
	
		index++;

		var associateObject = { 
			name: $($(li).find("a")[0]).text(), 
			href: `http://en.wikipedia.org/wiki/${href}`,
			mentions: [] 
		};
		console.log(`http://en.wikipedia.org/wiki/${href}`)
		request(`http://en.wikipedia.org/wiki/${href}`, (err1, resp, body) => {

			if(err1){
				async.setImmediate(() => { cb(); });
			} else {

				var $1 = cheerio.load(body);

				var pageHrefs = {};

				$1("#mw-content-text a").filter((i, link) => { 
					if(typeof $1(link).attr("href") === "undefined"){
						return false;
					}
					return $1(link).attr("href").toLowerCase().match(/wiki\//);
				}).each((i, link) => {
					var pageHref = $1(link).attr("href").toLowerCase().replace(/.*wiki\//g, "");
					if(pageHref !== href.toLowerCase() && allHREFs.indexOf(pageHref) !== -1) {
						if(typeof pageHrefs[pageHref] === "undefined") {
							pageHrefs[pageHref] = 0;
						}
						pageHrefs[pageHref]++;
					}
				});

				var rows = "";

				for(var p in pageHrefs){
					rows += `${href}\t${p}\t${pageHrefs[p]}\n`
				}

				console.log(rows)
				fs.appendFile(outputFileName, rows, (err) => {
				  if (err) throw err;
				 	async.setImmediate(() => { cb(); });
				});
				
				
			}

		});

	}, () => {

		console.log("done");
	});
});
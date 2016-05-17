const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");
const geocoder = require('geocoder');

var hrefObj = {};

var startTime = moment();

async.series({
	getAllLinks: (cb) => {

		fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {
			var $ = cheerio.load(data);
			$("li").each((i, li) => {
				var href = $(li).find("a").attr("href").slice(6);
				if(!href.startsWith("ex.php?")){
					hrefObj[href] = {
						name: $($(li).find("a")[0]).text(),
						fileName: `${href.replace(/\:/g, "_").replace(/\//g, "_")}`
					}
				}
			});
			cb();
		});

	},
	getPageViews: (cb) => {
		
		fs.readFile(`${__dirname}/../../data/PageViews.tsv`, "utf8", (err, data) => {
			var rows = data.split("\n").slice(1);
				
			async.forEach(rows, (row, cb1) => {

				if(row.length > 0){
					var parts = row.split("\t");
					var href = parts[0];
					var pageViews = parts[2];
					if(typeof hrefObj[href] !== "undefined"){
						hrefObj[href].pageViews = pageViews;
					}
				}
				async.setImmediate(() => { cb1(); });

			}, () => {
				async.setImmediate(() => { cb(); });
			});

		});

	}, 
	getDBpediaInfo: (cb) => {

		var rows = "URL\tName\tEntityType\tPageViews\n";
		var genreRows = "URL\tName\tGenreAttr\tGenre\n";
		var dateRows = "URL\tName\tDateAttr\tDate\n";
		var typeRows = "URL\tName\tType Attr\tValue\n";
		var fromRows = "URL\tName\tFrom Attr\tValue\n";
		var musicRows = "URL\tName\tMusic Attr\tValue\n";
		var subjectRows = "URL\tName\tType Attr\tValue\n";
		// var urlLinkRows = "URL\tName\tAttr\tValue\n";

		// fs.writeFile(`${__dirname}/../../data/d3-data-obj-url-link.tsv`, urlLinkRows);

		var urlsList = Object.keys(hrefObj).map((key) => { return key.toLowerCase(); });
		var urlRegex = new RegExp(Object.keys(hrefObj).join("|"), "gi");

		async.forEachSeries(Object.keys(hrefObj), (href, cb1) => {

			var pageInfo = hrefObj[href];

			fs.readFile(`${__dirname}/../../data/output/links/${pageInfo.fileName}.json`, 
				"utf8", (err, data) => {
					if(typeof data !== "undefined"){

						var dbpediaInfo = "";
						eval(`dbpediaInfo = ${data}`);
						//console.log("-------------------------------")
						console.log(`${moment().diff(startTime, "minutes")} mins\t\t${pageInfo.name}`)
						rows += `${href}\t${pageInfo.name}\t${dbpediaInfo.entityType}\t${pageInfo.pageViews}\n`;

						for(var x in dbpediaInfo.values){
							var xString = x.replace(/\n/g, "");

							for(var y in dbpediaInfo.values[x]){

								var values = dbpediaInfo.values[x][y].value.replace(/\n/g, "").split("*");

								for(var z in values){
									if(values[z].length > 0){

										if(values[z].toLowerCase().indexOf("(xsd:date)") !== -1){
											dateRows += `${href}\t${pageInfo.name}\t${xString}\t${values[z]}\n`;
										}

										// var val = values[z].replace(/(.)+\:/, "");
										// var matches = val.match(urlRegex);
										// if(matches !== null){
										// 	for(var m in matches){
										// 		if(matches[m] !== href.toLowerCase()){
										// 			if(urlsList.indexOf(val.toLowerCase()) !== -1 &&
										// 				!xString.toLowerCase().match(/sameAs|primaryTopic|wikiPageRedirects|seeAlso/gi)
										// 				){
										// 				//console.log(`${href}\t${pageInfo.name}\t${xString}\t${matches[m]}`)
										// 				//urlLinkRows += `${href}\t${pageInfo.name}\t${xString}\t${matches[m]}\n`;

										// 				fs.appendFileSync(`${__dirname}/../../data/d3-data-obj-url-link.tsv`, 
										// 						`${href}\t${pageInfo.name}\t${xString}\t${matches[m]}\n`);
										// 			}
										// 		}
										// 	}
										// }


										if(xString.toLowerCase().indexOf("genre") !== -1 && xString.toLowerCase().indexOf(":genre of") === -1){
											genreRows += `${href}\t${pageInfo.name}\t${xString}\t${values[z]}\n`;
										}
										
										if(xString.toLowerCase().indexOf("rdf:type") !== -1){
											typeRows += `${href}\t${pageInfo.name}\t${xString}\t${values[z]}\n`;
										}

										if(xString.toLowerCase().indexOf(":subject") !== -1){
											subjectRows += `${href}\t${pageInfo.name}\t${xString}\t${values[z]}\n`;
										}
										
										if(values[z].toLowerCase().indexOf("_from_") !== -1 
											&& values[z].toLowerCase().indexOf("deaths") === -1
											&& values[z].toLowerCase().indexOf("converts") === -1
											&& xString.toLowerCase().indexOf("dct:subject") !== -1){

											fromRows += `${href}\t${pageInfo.name}\t${xString}\t${values[z]}\n`;

										}

										if(xString.toLowerCase() === "dbo:artist"
											//&& values[z].toLowerCase().indexOf("miles_davis") !== -1
											){
											musicRows += `${href}\t${pageInfo.name}\t${xString}\t${values[z]}\n`;
										}


									}
								}
							}
						}

					}
					async.setImmediate(() => { cb1(); });
				});

		}, () => {	
			fs.writeFile(`${__dirname}/../../data/d3-data-obj.tsv`, rows);
			fs.writeFile(`${__dirname}/../../data/d3-data-obj-dates.tsv`, dateRows);
			fs.writeFile(`${__dirname}/../../data/d3-data-obj-genres.tsv`, genreRows);
			fs.writeFile(`${__dirname}/../../data/d3-data-obj-types.tsv`, typeRows);
			fs.writeFile(`${__dirname}/../../data/d3-data-obj-from.tsv`, fromRows);
			fs.writeFile(`${__dirname}/../../data/d3-data-obj-music.tsv`, musicRows);
			fs.writeFile(`${__dirname}/../../data/d3-data-obj-subject.tsv`, subjectRows);
			//fs.writeFile(`${__dirname}/../../data/d3-data-obj-url-link.tsv`, urlLinkRows);

			cb();
		});

		//console.log(hrefObj)
	}, 	
	getMentionInfo: (cb) => {
		var rows = "URL\tName\tsectionHeader\tsectionSubHeader\tsectionIndex\twordCountBeforeSection\tquote\n";
		async.forEach(Object.keys(hrefObj), (href, cb1) => {

			var pageInfo = hrefObj[href];

			fs.readFile(`${__dirname}/../../data/output/mentions/${pageInfo.fileName}.json`, 
				"utf8", (err, data) => {
					if(typeof data !== "undefined"){

						var mentionInfo = "";
						eval(`mentionInfo = ${data}`);

						for(var x in mentionInfo.mentions){
							var mention = mentionInfo.mentions[x];
							for(var q in mention.quote){
								var quote = mention.quote[q].replace(/\n/g, " ");
								rows += `${href}\t${pageInfo.name}\t${mention.sectionHeader}\t${mention.sectionSubHeader}\t${mention.sectionIndex}\t${mention.wordCountBeforeSection}\t${quote}\n`
							}
						}
					}
					async.setImmediate(() => { cb1(); });
			});
		}, () => {	
			fs.writeFile(`${__dirname}/../../data/d3-data-obj-mentions.tsv`, rows);
			cb();
		});

	}, 
	done: () => {
		console.log("done");
	}
});


// var eras = {};

// subjects.forEach((s) => { 

// 	var subject = s.Value
//                       .replace(/(.)+\:/, "")
//                       .replace(/[\_|\-]+/g, " ").toLowerCase();

//   // if(subject.match(/\d{4}s in/g)
//   // 	|| subject.match(/in \d{4}/g)){
//   // 	eras.push(subject)
//   // }
//   if(subject.match(/\d{4}/g) && !subject.match(/birth|death/g)){
//   	var text = subject.replace(/\d{4}s/g, '')
//   										.replace(/\d{4}/g, '')
//   										// .replace("disestablished", "")
//   										// .replace("reestablished", "")
//   										// .replace("established", "")
//   										// .replace("set in the", "")
//   										// .replace(/(.)+in/, "")
//   	if(typeof eras[text] === "undefined"){
//   		eras[text] = 0;
//   	}
//   	eras[text]++;
//   }

// })

// var subjectList = Object.keys(eras)


// var subjectIdentifiers = {
//     works: [],
//     musicians: [],
//     people: [],
//     events: [],
//     places: [],
//     genres: [],
//     companies: []
//   }

//   async.forEach(subjectList, function (subject, cb) {

//     if(subject.match(worksRegex)){
//       subjectIdentifiers.works = subjectIdentifiers.works.concat(subject.match(worksRegex));
//     }
//     if(subject.match(musiciansRegex)){
//       subjectIdentifiers.musicians = subjectIdentifiers.musicians.concat(subject.match(musiciansRegex));
//     }
//     if(subject.match(peopleRegex)){
//       subjectIdentifiers.people = subjectIdentifiers.people.concat(subject.match(peopleRegex));
//     }
//     if(subject.match(eventsRegex)){
//       subjectIdentifiers.events = subjectIdentifiers.events.concat(subject.match(eventsRegex));
//     }
//     if(subject.match(placesRegex)){
//       subjectIdentifiers.places = subjectIdentifiers.places.concat(subject.match(placesRegex));
//     }
//     if(subject.match(genresRegex)){
//       subjectIdentifiers.genres = subjectIdentifiers.genres.concat(subject.match(genresRegex));
//     }
//     if(subject.match(companiesRegex)){
//       subjectIdentifiers.companies = subjectIdentifiers.companies.concat(subject.match(companiesRegex));
//     }

//     async.setImmediate(function() { cb(); });


//   }, function () {
//     console.log(subjectIdentifiers);
//   });

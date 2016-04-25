const async = require("async");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require("util");
const moment = require("moment");

var starTime = moment();

var index = 0;

fs.readFile(`${__dirname}/../../wiki-links.html`, "utf8", (err, data) => {

	var $ = cheerio.load(data);

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

				function getSection(obj) {
					if($1(obj).attr("id") === "mw-content-text"){
						return null;
					}

					var siblings = $1(obj).siblings();
					var isSection = false;

					$1(siblings).each((i, sibling) => {
						if($1(sibling).is("h2") || $1(sibling).is("h3") /*|| $1(obj).parent().attr("id") === "mw-content-text"*/) {
							isSection = true;
						}
					});

					if(isSection){
						return $1(obj);
					} else {
						return getSection($1(obj).parent());
					}
				}

				var allSections = $1("#mw-content-text").children();

				var links = $1("#mw-content-text a").filter((i, a) => {
					return $1(a).attr("href").match(/Miles_Davis/i);
				});


				async.forEach(links, (link, cb1) => {

					var section = getSection($1(link));
					var linkText = $1(link).text();
					// var quote = $1(link).parent().text()
					// 							.replace(/(\[[^\]]+\])*/gi, "")
					// 							.match(/[^\.]*Miles Davis[^\.]*/ig);

					var re = /\b(\w\.\w\.)|([.?!])\s+(?=[A-Za-z])/g; 

					var str = $1(link).parent().text()
						 							.replace(/(\[[^\]]+\])*/gi, "")
						 							.replace(/Mr./g, "Mr")
						 							.replace(/Mrs./g, "Mrs")
						 							.replace(/Miss./g, "Miss")
						 							.replace(/Dr./g, "Dr")

					var result = str.replace(re, (m, g1, g2) => {
					  return g1 ? g1 : g2+"\r";
					});
					var sentences = result.split("\r");

					var quote = [];
					
					for(var s in sentences){
						var sentence = sentences[s];
						if(sentence.match(/Miles Davis/ig)){
							quote.push(sentence);
						}
					}			

					var maxH2 = -1,
							maxH3 = -1,
						 	h2SectionText = "",
							h3SectionText = "",
							sectionIndex = -1,
							wordCountBeforeSection = 0;
							
					if(section !== null){
						var sectionIndexes = allSections.map((i, ch) => {
							if($1(ch)[0] === $1(section)[0]){
								return i;
							}
							return -1;
						}).filter((i, ch) => { 
							return ch !== -1
						});

						if(sectionIndexes.length > 0){
							var index = sectionIndexes[0];

							sectionIndex = index;

							for(var x = 0; x < index; x++){
								var thisSection = $1(allSections[x]);
								wordCountBeforeSection += $1(thisSection).text().length;

								if(thisSection.is("h2")){
									maxH2 = x;
									h2SectionText = thisSection.text();
								}//if

								if(thisSection.is("h3")){
									maxH3 = x;
									h3SectionText = thisSection.text();
								}//if
							}//for

							if(maxH3 > maxH2) {
								maxH3 = -1;
								h3SectionText = "";
							}


						}//if

					}//if

					var mention = {
						sectionHeader: h2SectionText.replace(/\[edit\]/gi, ""),
						sectionSubHeader: h3SectionText.replace(/\[edit\]/gi, ""),
						sectionIndex: sectionIndex,
						wordCountBeforeSection: wordCountBeforeSection,
						quote: quote
					}
					console.log(quote)
					associateObject.mentions.push(mention);

					async.setImmediate(() => { cb1(); });
				}, () => {

					fs.writeFile(`${__dirname}/../../data/output/mentions/${href.replace(/\:/g, "_").replace(/\//g, "_")}.json`, util.inspect(associateObject, false, null));
					async.setImmediate(() => { cb(); });

				});

			}

		});

	}, () => {

		console.log("done");
	});
});
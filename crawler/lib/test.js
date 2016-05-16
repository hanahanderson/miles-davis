const async = require("async");
const fs = require("fs");

//works
var worksRegex = new RegExp(/album\)|albums|ballads|books|comics titles|compositions|dances|discographies|documentaries|episodes|films|grammy award for|jazz standards|live album|magazines|music history|music related lists|musicals|novels|radio programs|songs|singles|soundtracks|television series|video games/gi);

//musicians
var musiciansRegex = new RegExp(/accordionists|audio engineers|band\)|\(band\) members|band members|bandleaders|baritones|bassists|bassoonists|beatboxers|cellists|choreographers|clarinetists|composers|conductors|dancers|djs|drummers|ensembles|flautists|flugelhornists|frank sinatra|guitarists|harpists|hip hop groups|horn players|instrumentalists|jazz organizations|keyboardist|keyboardists|keytarists|lyricists|mandolinists|mastering engineers|military personnel|music groups|music organizations|musical advocacy groups|musical artist|musical groups|musical quartets|musician\)|musicians|occupations in music|orchestra members|percussionists|performers|pianists|production companies|rappers|recordings artists|record labels|records artists|record producers|rock groups|saxophonists|singer\)|singers|songwriters|sopranos|trombonists|trumpeters|tubists|violinists|vibraphonists/gi);

//people
var peopleRegex = new RegExp(/actors|actresses|activists|artists|births|biographers|boxing promoters|businesspeople|deaths|directors|dramatists|entertainers|fictional characters|filmmakers|historians|journalists|linguists|models|novelists|painters|passions characters|people from|personalities|playwrights|photographers|poets|politicians|presenters|producers|scientist|sculptors|socialists|sports announcers|surgeon|writers/gi);

//events
var eventsRegex = new RegExp(/\d{4}s|\d{4} in|annual events|awards|award categories|award ceremony|concert tours|concerts|days of the year|deaths by person|festivals|grammy award|recurring events|world\'s fairs/gi);

//places
var placesRegex = new RegExp(/buildings|cities|by city|by country|concert halls|districts in the united states|educational institutions |establishments|event venues |districts|districts and streets|hotels|jazz clubs|lincoln center|music venues|neighborhoods in|nightclubs|populated places|recording studios|restaurants|squares in |schools in|stadium|states|streets in|structures|territories|towns|venues|villages|washington\, d\.c\.|upstate new york|five points\, denver/gi);

//genres
var genresRegex = new RegExp(/australian jazz|british music|cabaret|classical music|counterculture|culture of|culture canon|drums|electro music|electronic organs|ethnic music in|experimental music|film styles|funk|genre|genres|industrial music|instruments|jazz by nationality|jazz terminology|modes|musical scales|musical subcultures|musical techniques|pitched percussion|popular culture|styles of music/gi);

//companies
var companiesRegex = new RegExp(/companies|headphones manufacturers|subsidiary/gi)


var pageSubjectObj = {};
var mentionsObj = {};


function getSubject(URL, callback) {


  var subjectList = pageSubjectObj[URL] || [];

  if( !URL.toLowerCase().startsWith("draft:")
    && !URL.toLowerCase().startsWith("file:")
    && !URL.toLowerCase().startsWith("portal:")
    && !URL.toLowerCase().startsWith("talk:")
    && !URL.toLowerCase().startsWith("user:")
    && !URL.toLowerCase().startsWith("user talk:")
    && !URL.toLowerCase().startsWith("wikipedia:")
    && !URL.toLowerCase().startsWith("wikipedia talk:")){
      subjectList.push(URL)
  }

  var subjectIdentifiers = {
    works: [],
    musicians: [],
    people: [],
    events: [],
    places: [],
    genres: [],
    companies: []
  }

  async.forEach(subjectList, function (subject, cb) {

    if(subject.match(worksRegex)){
      subjectIdentifiers.works = subjectIdentifiers.works.concat(subject.match(worksRegex));
    }
    if(subject.match(musiciansRegex)){
      subjectIdentifiers.musicians = subjectIdentifiers.musicians.concat(subject.match(musiciansRegex));
    }
    if(subject.match(peopleRegex)){
      subjectIdentifiers.people = subjectIdentifiers.people.concat(subject.match(peopleRegex));
    }
    if(subject.match(eventsRegex)){
      subjectIdentifiers.events = subjectIdentifiers.events.concat(subject.match(eventsRegex));
    }
    if(subject.match(placesRegex)){
      subjectIdentifiers.places = subjectIdentifiers.places.concat(subject.match(placesRegex));
    }
    if(subject.match(genresRegex)){
      subjectIdentifiers.genres = subjectIdentifiers.genres.concat(subject.match(genresRegex));
    }
    if(subject.match(companiesRegex)){
      subjectIdentifiers.companies = subjectIdentifiers.companies.concat(subject.match(companiesRegex));
    }

    async.setImmediate(function() { cb(); });


  }, function () {
    callback(subjectIdentifiers);
  });


}


async.series({
	subjects: (cb) => {
    fs.readFile(`${__dirname}/../../data/d3-data-obj-subject.tsv`, "utf8", (error, rows) => {
      if (error) throw error;

      async.forEach(rows.split("\n").slice(1), (row, cb1) => {

      	if(row.length > 0){
      		var parts = row.split("\t");
	      	var URL = parts[0];
	        var subject = parts[3]
	                    .replace(/(.)+\:/, "")
	                    .replace(/[\_|\-]+/g, " ").toLowerCase();
	       

	        if(typeof pageSubjectObj[URL] === "undefined"){
	          pageSubjectObj[URL] = [];
	        }

	        pageSubjectObj[URL].push(subject)
	       }

	      async.setImmediate(() => { cb1(); });

      }, () => {
      	cb();

      })

    });
	},
	mentions: (cb) => {
		fs.readFile(`${__dirname}/../../data/d3-data-obj-mentions.tsv`, "utf8", (error, rows) => {
      if (error) throw error;
    	
    	async.forEach(rows.split("\n").slice(1), (row, cb1) => {

    		if(row.length > 0){
      		var parts = row.split("\t");
	      	var URL = parts[0];
	      	var sectionIndex = parts[4];

	        var sectionHeader = parts[2].replace(/[^a-z|A-Z|0-9|\s]/gi, "").toLowerCase();
	        if(sectionHeader.trim().length === 0) {
	          sectionHeader = "first paragraph";
	          sectionIndex = 0;
	        }

	        if(typeof mentionsObj[URL] === "undefined"){
	          mentionsObj[URL] = [];
	        }

	        mentionsObj[URL].push({sectionHeader: sectionHeader, sectionIndex: sectionIndex});
	      }

	      async.setImmediate(() => { cb1(); });

      }, () => {
      	cb();

      });

    });


	},
	data: (cb) => {
		fs.readFile(`${__dirname}/../../data/d3-data-obj.tsv`, "utf8", (error, rows) => {
      if (error) throw error;
    		
    	var outputRow = "URL\tName\tSubject\tSection Header\tSection Index\tPageViews\n";

    	async.forEach(rows.split("\n").slice(1), (row, cb1) => {

    		if(row.length > 0){
      		var parts = row.split("\t");
      		var URL = parts[0];
      		var name = parts[1];
      		var entityType = parts[2];
      		var pageViews = parts[3];

      		getSubject(URL, function(subjectIdentifiers){
            
            var mostIdentifiers = Object.keys(subjectIdentifiers)
                                    .filter(function(sub){
                                      return subjectIdentifiers[sub].length > 0;
                                    }).sort((a, b) => { return subjectIdentifiers[b].length - subjectIdentifiers[a].length});

            var mainSubjectType = "other";
            if(mostIdentifiers.length > 0){

              mainSubjectType = mostIdentifiers[0];

              if(mainSubjectType === "people" && subjectIdentifiers["musicians"].length > 0){
                mainSubjectType = "musicians";
              }

            }

            for(var x in subjectIdentifiers){
              if(x.match(entityType, "gi")){
                mainSubjectType = x;
              }
            }

            async.forEachSeries(mentionsObj[URL], (mention, cb2) => {
								
							outputRow += `${URL}\t${name}\t${mainSubjectType}\t${mention.sectionHeader}\t${mention.sectionIndex}\t${pageViews}\n`;
							async.setImmediate(function() { cb2(); });

            }, () => {
            	async.setImmediate(function() { cb1(); });
            })
          });

      	} else {
      		cb1();
      	}

      }, () => {

      	fs.writeFile(`${__dirname}/../../data/google-docs-data.tsv`, outputRow);
      	cb();
      });


    });
	},
	done: () => {

		console.log("done")
	}
});




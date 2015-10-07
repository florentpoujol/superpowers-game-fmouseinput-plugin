
class fLangBehavior extends Sup.Behavior {
  
  awake() {
    Sup.log("f.Lang");
    Sup.log(f.Lang);


    f.Lang.config.locales.push("fr");

    var en: any = Sup.get( "Lang/en.cson", fText ).parse();
    Sup.log(en);
    f.Lang.dictionariesByLocale.en = en;

    var fr: any = (<fText>Sup.get( "Lang/fr.json" )).parse();
    Sup.log(fr);
    f.Lang.dictionariesByLocale.fr = fr


    var fn = function(locale) {
      Sup.log("====================");
      Sup.log("new locale");
      Sup.log(locale);
      Sup.log("====================");
    }

    f.Lang.onUpdate(fn);



    Sup.log("----------------------------");
    Sup.log("Expected: " + en.localeName);
    Sup.log( f.Lang.get( "localeName" ) );


    Sup.log("----------------------------");
    Sup.log("Expected: " + en.greetings.welcome);
    Sup.log( f.Lang.get( "greetings.welcome" ) );


    Sup.log("----------------------------");
    Sup.log("Expected: " + fr.greetings.welcome);
    Sup.log( f.Lang.get( "fr.greetings.welcome" ) );


    Sup.log("----------------------------");
    f.Lang.config.searchInDefaultLocale = false;
    Sup.log("Expected printed twice in the console: Lang.get(): Key not found:");
    Sup.log( f.Lang.get( "fr.localeName" ) );
    f.Lang.config.searchInDefaultLocale = true;


    Sup.log("----------------------------");
    Sup.log("Expected: " + en.localeName);
    Sup.log( f.Lang.get( "fr.localeName" ) );


    Sup.log("----------------------------");
    Sup.log("Expected: Welcome Florent!");
    Sup.log( f.Lang.get( "greetings.welcome", { player_name: "Florent" } ) );

    Sup.log("----------------------------");

    f.Lang.config.replacementPattern = ":placeholder";
    f.Lang.dictionariesByLocale.fr.greetings.welcome = "Bienvenu :player_name!"
    delete f.Lang.cache["fr.greetings.welcome"];
    f.Lang.update("fr");

    Sup.log("Expected: Bienvenu Florent !");
    Sup.log( f.Lang.get( "greetings.welcome", { player_name: "Florent" } ) );


    Sup.log("----------------------------");
    f.Lang.config.locales.push("de");
    Sup.log("Expected: dictionary not found error printed in the console + returned");
    Sup.log( f.Lang.get( "de.localeName" ) );


    Sup.log("----------------------------");
    f.Lang.dictionariesByLocale.de = { localeName: 123 }; // wrong value type
    Sup.log("Expected: wrong type error printed in the console + returned");
    Sup.log( f.Lang.get( "de.localeName" ) );
  }
}

Sup.registerBehavior(fLangBehavior);

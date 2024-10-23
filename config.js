import {
  @ColorProperty,
  @ButtonProperty,
  @SwitchProperty,
  @TextProperty,
  @Vigilant,
  @PercentSliderProperty,
  @SliderProperty,
  @SelectorProperty,
  Color
} from 'Vigilance';

@Vigilant('chearys', 'for special people', {
  getCategoryComparator: () => (a, b) => {
    const categories = ['General', 'Party', 'HUD', 'Crimson isle', 'Kuudra', 'Debug'];
    return categories.indexOf(a.name) - categories.indexOf(b.name);
},
// getSubcategoryComparator: () => (a, b) => {
//   const subcategories = ["Ragnarock", "General"];

//   return subcategories.indexOf(a.getValue()[0].attributesExt.subcategory) -
//       subcategories.indexOf(b.getValue()[0].attributesExt.subcategory);
// },
// getPropertyComparator: () => (a, b) => {
//   const names = ["Autojoin", "Enable whitelist", "Whitelist", "Blacklist", "Ragnarock overlay", "Ragnarock scale", "Ragnarock boo!", "Stats Display","Opacity", "Scale", "Overlay X", "Overlay Y", "Enable custom splits", "Overlay Opacity", "Splits Scale", "Type",  "X Location", "Y Location"];

//   return names.indexOf(a.attributesExt.name) - names.indexOf(b.attributesExt.name);
// }


})




class Settings {

  //
  //GENERAL CATEGORY
  //

  //general/chat waypoints
  @SliderProperty({
    name: "Draw Chat Waypoints",
    description: "Creates waypoints taken from chat messages in patcher sendcoords format and how long they should stay (in seconds)\n&cTurned off at 0",
    min: 0,
    max: 160,
    category: "General",
    subcategory: "Waypoints"
  })
  waypoint = 0;

  //General/Ragnarock
  @TextProperty({
    name: 'Ragnarock boo!',
    description: 'Displays a message when casting Ragnarock ability.',
    category: 'General',
    subcategory: 'Ragnarock',
    placeholder: '&6BOO!',
  })
  overlayText = '&4kwuromi &c<3';
  //General/Ragnarock
  @TextProperty({
    name: 'Ragnarock scale',
    description: 'Default scale is 4',
    category: 'General',
    subcategory: 'Ragnarock',
    placeholder: 'value',
  })
  ragnarockscale = '4';
 //General/Ragnarock
  @SwitchProperty({
    name: "Ragnarock overlay", 
    description: "Render an overlay when ragnarock ability is casted",
    category: "General",
    subcategory: "Ragnarock",
})
 enableRagnarock = false;
  //General/General
  @SwitchProperty({
    name: "Pearl config", 
    description: "cancel block interact event",
    category: "General",
    subcategory: "General",
})
 enablePearlConfig = false;
 //General/Wardrobe..
 @SwitchProperty({
  name: "Wardrobe Keybind", 
  description: "",
  category: "General",
  subcategory: "Wardrobe",
})
enableWd = false;
 @TextProperty({
  name: 'Wardrobe #1',
  description: 'Wardrobe 1 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_1 = '';
@TextProperty({
  name: 'Wardrobe #2',
  description: 'Wardrobe 2 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_2 = '';
@TextProperty({
  name: 'Wardrobe #3',
  description: 'Wardrobe 3 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_3 = '';
@TextProperty({
  name: 'Wardrobe #4',
  description: 'Wardrobe 4 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_4 = '';
@TextProperty({
  name: 'Wardrobe #5',
  description: 'Wardrobe 5 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_5 = '';
@TextProperty({
  name: 'Wardrobe #6',
  description: 'Wardrobe 6 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_6 = '';
@TextProperty({
  name: 'Wardrobe #7',
  description: 'Wardrobe 7 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_7 = '';
@TextProperty({
  name: 'Wardrobe #8',
  description: 'Wardrobe 8 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_8 = '';
@TextProperty({
  name: 'Wardrobe #9',
  description: 'Wardrobe 9 keybind',
  category: 'General',
  subcategory: 'Wardrobe',
  placeholder: '',
})
wd_9 = '';

  //
  //PARTY CATEGORY
  //

//Party/Other featrures
  @TextProperty({
    name: 'Party commands blacklist',
    description: 'Blacklist',
    category: 'Party',
    subcategory: 'Other features',
    placeholder: 'ign,ign',
  })
  pcmds_blacklist = '';
  //Party/Other featrures
  @SwitchProperty({
    name: "Party commands", //P COMMANDS
    description: ".help in party to see",
    category: "Party",
    subcategory: "Other features",
})
 enablePartyCommands = false;
   //Party/Other featrures
 @SwitchProperty({
  name: "Auto transfer", 
  description: "Transfers back party leader",
  category: "Party",
  subcategory: "Other features",
})
 autoTransfer = false;
   //Party/Other featrures
   @SwitchProperty({
    name: "Party join notifs", 
    description: "Play a cat meow sound when someone joins party",
    category: "Party",
    subcategory: "Other features",
  })
   joinNotifs = false;

  //Party/Auto join
  @TextProperty({
    name: 'Whitelist',
    description: 'Whitelist',
    category: 'Party',
    subcategory: 'Auto join',
    placeholder: 'ign,ign',
  })
  whitelist = '';
   //Party/Auto join
  @SwitchProperty({
    name: "Enable whitelist",
    description: "toggle",
    category: "Party",
    subcategory: "Auto join",
  })
  enableWhitelist = true
   //Party/Auto join
  @TextProperty({
    name: 'Blacklist',
    description: 'Blacklist',
    category: 'Party',
    subcategory: 'Auto join',
    placeholder: 'ign,ign',
  })
  blacklist = '';
   //Party/Auto join
  @SwitchProperty({
    name: "Auto join",
    description: "Automatically joins party",
    category: "Party",
    subcategory: "Auto join",
  })
  autoJoin = false;



   //
   //CRIMSON ISLE CATEGORY
   //

   //Crimson isle/Vanquisher
  @SelectorProperty({
    name: 'Vanquisher',
    description: 'Autowarp or announce Vanquisher',
    category: 'Crimson isle',
    subcategory: 'Vanquisher',
    options: ['OFF', 'All chat', 'Party chat', 'Auto warp'],
})
 VA_options = 0; // Stores index of option
  //Crimson isle/Vanquisher
  @TextProperty({
  name: 'Auto warp ign',
  description: 'Automatically invites and warp the person to your lobby when you spawn a vanquisher. &cRequires Auto warp',
  category: 'Crimson isle',
  subcategory: 'Vanquisher',
  placeholder: 'ign,ign',
})
VA_list = "";
 //Crimson isle/General
 @SwitchProperty({
    name: "Vanq ESP",
    description: "Vanq ESP but it is waypoint!",
    category: "Crimson isle",
    subcategory: "Vanquisher",
  })
  enableVanqESP = false;

   //
   //KUUDRA CATEGORY
   //

   /**
    * Renders
    */
@SwitchProperty({
  name: "Kuudra HP Bossbar",
  description: "Displays HP percentage from 0 to 100 percent",
  category: "Kuudra",
  subcategory: "Renders"
})
enableKuudraHPPercent = false;
@SwitchProperty({
  name: "Kuudra HP",
  description: "Displays Kuudra's HP",
  category: "Kuudra",
  subcategory: "Renders"
})
enableKuudraHP = false;
@SwitchProperty({
  name: "Supply Drop beacon",
  description: "Draw beacon on piles where supplies are needed",
  category: "Kuudra",
  subcategory: "Renders",
})  
enableNoSupply = false;
@SwitchProperty({
  name: "Kuudra ESP",
  description: "ESP",
  category: "Kuudra",
  subcategory: "Renders",
})
enableKuudraESP = false;
@SwitchProperty({
  name: "Kuudra Directions",
  description: "Requires animation skip",
  category: "Kuudra",
  subcategory: "Renders"
})
enableKuudraDirection = false;
@SwitchProperty({
  name: "Supply beacon",
  description: "Renders beacon beam for supplies",
  category: "Kuudra",
  subcategory: "Renders"
})
enableSupplyBeacon = false;
@SwitchProperty({
  name: "No pre",
  description: "Sends a chat message for no supply",
  category: "Kuudra",
  subcategory: "Others"
})
enableNoPre = false;

//Kuudra/others
@SwitchProperty({
  name: "Kuudra Info",
  description: "Shows player's stats when they join pf.",
  category: "Kuudra",
  subcategory: "Others"
})
kuudraInfo = false;
@SwitchProperty({
  name: "Announce Fresh",
  description: "Says FRESH in p chat",
  category: "Kuudra",
  subcategory: "Others"
})
annouceFresh = false;
//Kuudra/others
@TextProperty({
  name: 'Custom Supply Drop Message',
  description: 'Customize supply drop msg. Example: [MVP++] kwuromi (Whatever you type it in here) 17.05s! (1/6). ',
  category: "Kuudra",
  subcategory: "Others",
  placeholder: 'leave blank for off',
})
customSupplyMessage = "";
//Kuudra/Others
@TextProperty({
  name: "gfs pearl",
  description: "refills pearls to the set amount | &cTo use, set a keybind for /testpearl",
  category: 'Kuudra',
  subcategory: 'Others',
  placeholder: '0',
})
pearlAmount = "";

// Rend


//Kuudra/Rend
@SwitchProperty({
  name: "Backbone tracker",
  description: "Plays a sound when your backbone hits",
  category: 'Kuudra',
  subcategory: 'Rend',
})
backBone = false;
//Kuudra/Rend
@TextProperty({
  name: "Backbone tracker Sound",
  description: "e.g random.anvil_land you can search /playSound 1.8.9 for it",
  category: 'Kuudra',
  subcategory: 'Rend',
  placeholder: '',
})
backBoneSound = "mob.cat.meow"
//Kuudra/Rend
@SwitchProperty({
  name: "Pull tracker",
  description: "Calculates your party's rend damage",
  category: 'Kuudra',
  subcategory: 'Rend',
})
rendDamage = false;
//Kuudra/Rend
@TextProperty({
  name: 'Backbone message',
  description: 'Displays a message when backbone hits with botv/fel',
  category: 'Kuudra',
  subcategory: 'Rend',
  placeholder: '',
})
pullText = '&4Pull!';


//Kuudra/GUI
@SwitchProperty({
  name: "Block click",
  description: "Prevent you from buying useless perks",
  category: "Kuudra",
  subcategory: "GUI",
})
//Kuudra/GUI
enableBlockClick = false;
@SwitchProperty({
  name: "Block Mining frenzy click",
  description: "For stunner",
  category: "Kuudra",
  subcategory: "GUI",
})
enableBlockFrenzy = false;
//Kuudra/Custom Splits
@ButtonProperty({
  name: "Open Splits GUI",
  description: "Opens the custom Splits GUI",
  category: "Kuudra",
  subcategory: "Custom Splits",
  placeholder: "Click!"
})
openSplitGUi() {
ChatLib.command("chearysSplits", true)
};
  

   //
   //DEBUG CATEGORY
   //

  //Debug/Debug check
   @SwitchProperty({
    name: "Debug message",
    description: "Sends you debug messages.",
    category: "Debug",
    subcategory: "Debug check",
  })
  debugEnabled = false;




  constructor() {
      this.initialize(this);

      //GENERAL
      this.setCategoryDescription('General', 'General stuff!'); 
      // General -
      this.setSubcategoryDescription('General', 'Waypoints', '');
      this.setSubcategoryDescription('General', 'Ragnarock', '');
      this.setSubcategoryDescription('General', 'Wardrobe', '');
      this.setSubcategoryDescription('General', 'General', 'Other features');

      //PARTY
      this.setCategoryDescription('Party', 'Party stuff');
      // Party -
      this.setSubcategoryDescription('Party','Auto join', '');
      this.setSubcategoryDescription('Party','Other features', '')

      //CRIMSON ISLE
      this.setCategoryDescription('Crimson isle', 'Crimson isle stuff');
      // CRIMSON ISLE -
      this.setSubcategoryDescription('Crimson isle', 'Vanquisher', 'Vanquisher alerts!');

      //KUUDRA
      this.setCategoryDescription('Kuudra', 'Kuudra stuff');
      // KUUDRA -
      this.setSubcategoryDescription('Kuudra','Custom Splits', 'Custom Kuudra Split');
      this.setSubcategoryDescription('Kuudra','Renders', '');
      this.setSubcategoryDescription('Kuudra','GUI', '');
      this.setSubcategoryDescription('Kuudra','Others', '');

      //DEBUG
      this.setCategoryDescription('Debug', 'Debug stuff');
      // Debug -
      this.setSubcategoryDescription('Debug','debug message', 'Recieve debug messages.');
  }
}

export default new Settings;

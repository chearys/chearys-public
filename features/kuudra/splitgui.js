import {
    @ButtonProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @PercentSliderProperty,
    @SliderProperty,
    @SelectorProperty,
  } from 'Vigilance';

  /**
   * Splits Name
   * -Text properties
   * Colors
   * -
   * Positions
   */
  

  @Vigilant('chearys/features/kuudra', 'split gui', {
    getCategoryComparator: () => (a, b) => {
      const categories = ['General', 'Color'];
      return categories.indexOf(a.name) - categories.indexOf(b.name);
  },
  
  
  })
  
  class Settings {
  
        /**
     * General Category
     */
        SplitsGUI = new Gui();
  @ButtonProperty({
        name: "Move Splits",
        category: "General",
        placeholder: "CLICK ME!"
    })
    MoveFreshTimer() {
        this.SplitsGUI.open();
    };
   @SwitchProperty({
    name: "Kuudra Splits",
    description: "Enable custom splits",
    category: "General",
  })
  displayKS = false;
  @SwitchProperty({
    name: "Less Detailed Splits",
    description: "Less detailed kuudra splits",
    category: "General",
  })
  NoDetail = false;
  @SwitchProperty({
    name: "Run overview",
    description: "Detailed splits at the end of the run",
    category: "General",
  })
  enableRunOverview = false;
  @PercentSliderProperty({
    name: 'Overlay Opacity',
    description: 'Kuudra Splits overlay opacity',
    category: 'General',
  })
  KS_opacity = 1.0;
  @PercentSliderProperty({
    name: 'Splits Scale',
    description: 'The scale of the overlay',
    category: 'General',
  })
  KSscale = 1.0;
  @PercentSliderProperty({
    name: 'X Location',
    description: 'Where in the X coordinate is the overlay drawn',
    category: 'General',
  })
  KS_x = 1.0;
  @PercentSliderProperty({
    name: 'Y Location',
    description: 'Where in the Y coordinate is the overlay drawn',
    category: 'General',
  })
  KS_y = 1.0;
   
      /**
   * Color
   */

  // General
  // @SwitchProperty({
  //   name: "Bold",
  //   description: "Whether the splits are bold or not",
  //   category: "Color",
  //   subcategory: "General",
  // })
  // bold = false;
  @SwitchProperty({
    name: "Split time",
    description: "Changes the color of phase time depending on how fast it is (green, orange, red)",
    category: "Color",
    subcategory: "General",
  })
  splitTime = false;

  // Splits Color
@SelectorProperty({
    name: "Supply Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
supplyColor = 0;
@SelectorProperty({
    name: "Build Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
buildColor = 0;
@SelectorProperty({
    name: "Eaten Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
eatenColor = 0;
@SelectorProperty({
    name: "Stun Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
stunColor = 0;
@SelectorProperty({
    name: "DPS Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
DPSColor = 0;
@SelectorProperty({
    name: "Skip Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
skipColor = 0;
@SelectorProperty({
    name: "P4 Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
P4Color = 0;
@SelectorProperty({
    name: "Overall Color",
    category: "Color",
    subcategory: "Splits Color",
    options: ["BLACK", "DARK_BLUE", "DARK_GREEN", "DARK_AQUA", "DARK_RED", "PURPLE", "GOLD", "GRAY", "DARK_GRAY", "BLUE", "GREEN", "AQUA", "RED", "PINK", "YELLOW", "WHITE"]
})
overallColor = 0;
  
    constructor() {
        this.initialize(this);
  
        this.setCategoryDescription('General', 'General stuff!'); 

        //Color
        this.setCategoryDescription('Color', 'Color stuff');
        this.setSubcategoryDescription('Color', 'General', '');
        this.setSubcategoryDescription('Color', 'Splits Color', '');

    }
  }
  
  export default new Settings();
  
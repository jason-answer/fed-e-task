/**
 * Page template data
 */
module.exports = {
  data: {
    menus: [
      {
        name: "Home",
        icon: "aperture",
        link: "index.html",
      },
      {
        name: "Features",
        link: "features.html",
      },
      {
        name: "About",
        link: "about.html",
      },
      {
        name: "Contact",
        link: "#",
        children: [
          {
            name: "Twitter",
            link: "https://google.com",
          },
          {
            name: "About",
            link: "https://google.com",
          },
          {
            name: "divider",
          },
          {
            name: "About",
            link: "https://github.com/zce",
          },
        ],
      },
    ],
    pkg: require("./package.json"),
    date: new Date(),
  },
};
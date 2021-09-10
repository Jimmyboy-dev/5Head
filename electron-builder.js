module.exports = () => {
  return {
    name: "five-head",
    productName: "5Head Manager",
    asar: true,
    appId: "app.jimmyboy.fivehead",
    files: ["main", "src/out"],
    directories: {
      buildResources: "build",
    },
  }
}

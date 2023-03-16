import VueProgressBar from "@aacassandra/vue3-progressbar"; // vue top bar loader import
// config for the loader
const options = {
  color: "#555cf7",
  failedColor: "#874b4b",
  thickness: "3px",
  transition: {
    speed: "0.2s",
    opacity: "0.6s",
    termination: 300,
  },
  autoRevert: true,
  location: "top",
  inverse: false,
};

export { VueProgressBar, options };

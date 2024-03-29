<template>
  <nav>
    <LocalLang />
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
  <!-- set progressbar -->
  <vue-progress-bar></vue-progress-bar>
  <!--/ set progressbar -->
  <!-- software update notifications -->
  <transition name="slide-fade">
    <div v-show="updateExists" class="fixed bottom-6 right-6 z-10">
      <div class="bg-white w-80 border rounded-lg shadow-lg">
        <div class="flex space-x-5 p-5">
          <div>🚀</div>
          <div class="text-left">
            <div class="font-bold text-lg">Update available!</div>
            <div class="text-sm">
              A new software version is available for download. ―
              <span class="text-xs font-medium text-indigo-500"
                >You will be signed out!</span
              >
            </div>
            <div class="flex pt-4 space-x-2">
              <button
                class="w-full rounded-curl inline-flex font-bold justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-white text-sm hover:bg-indigo-600"
                @click="refreshApp"
              >
                Update
              </button>
              <button
                class="w-full rounded-curl border inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-grayLightMode-100 hover:bg-grayLightMode-200 text-sm font-bold text-gray-700"
                @click="updateExists = false"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!-- / software update notifications -->
</template>

<script>
import LocalLang from "@/components/LocalLang.vue";
export default {
  components: {
    LocalLang,
  },
  data() {
    return {
      refreshing: false,
      registration: null,
      updateExists: false, //if there is an update or not
    };
  },
  mounted() {
    // call finish function component has been mounted
    this.$Progress.finish();
  },
  created() {
    // handler for top progress bar
    this.progressBarHandler();

    // for the service workers
    document.addEventListener("swUpdated", this.updateAvailable, {
      once: true,
    });

    // console.log(navigator.serviceWorker);
    //making sure serviceWorker is not undefined
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // We'll also need to add 'refreshing' to our data originally set to false.
        if (this.refreshing) return;
        this.refreshing = true;
        // Here the actual reload of the page occurs
        window.location.reload();
      });
    }
  },
  methods: {
    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    updateAvailable(event) {
      this.registration = event.detail;
      this.updateExists = true;
      console.log(this.registration);
    },
    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return;
      // Send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: "SKIP_WAITING" });

      // add logic to logout user after updating app `if and only if user is logged in already`
      // if (this.$store.getters["authentication/getCurrentUser"]) {
      //   this.$store.dispatch("authentication/logMeOut", this);
      // }
    },
    // the function that handles the progress top bar
    progressBarHandler() {
      //  [App.vue specific] When App.vue is first loaded start the progress bar
      this.$Progress.start();
      //  hook the progress bar to start before we move router-view
      this.$router.beforeEach((to, from, next) => {
        //  does the page we want to go to have a meta.progress object
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress;
          // parse meta tags
          this.$Progress.parseMeta(meta);
        }
        //  start the progress bar
        this.$Progress.start();
        //  continue to next page
        next();
      });
      //  hook the progress bar to finish after we've finished moving router-view
      // eslint-disable-next-line no-unused-vars
      this.$router.afterEach((to, from) => {
        //  finish the progress bar
        this.$Progress.finish();
      });
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>

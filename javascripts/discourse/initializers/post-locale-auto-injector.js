import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  const composerService = api.container.lookup("service:composer");

  if (composerService) {
    const originalOpen = composerService.open;

    composerService.open = function(options) {
      if (options && (options.action === "createTopic" || options.action === "reply")) {
        const currentUser = api.getCurrentUser();
        const userLocale = currentUser?.effective_locale;

        if (userLocale) {
          options.locale = userLocale.toLowerCase();
          console.log(`🚀 [System] Locale Auto-set: ${options.locale}`);
        } else {
          alert("Language Setting Required: Please set your interface language in your profile settings before posting.");
          console.error("❌ [System] Write Blocked: No effective_locale detected.");
          return; 
        }
      }
      return originalOpen.call(this, options);
    };
  }
});
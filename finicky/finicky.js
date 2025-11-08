const GoogleIdp = {
  Dd: 'C0147pk0i',
  DdGov: 'C03lf3ewa',
  DdGovVault: '887447947818-oeibak5kop4jh95bp61oe2ijem431m07.apps.googleusercontent.com',
}

// Google Chrome profiles:
//
// - "Profile 1": Perso
// - "Default": DD
// - "Profile 2": Govcloud
//
// To figure out which profile is which:
//
// open -n /Applications/Google\ Chrome.app --args --profile-directory="Default" google.fr

const Chrome = (openInBackground = false) => ({
  name: 'Google Chrome',
  openInBackground,
  profile: 'Profile 2',
})
const DdChrome = (openInBackground = false) => ({
  name: 'Google Chrome',
  openInBackground,
  profile: 'Profile 1',
})
const DdGovChrome = (openInBackground = false) => ({
  name: 'Google Chrome',
  profile: 'Profile 2',
})

module.exports = {
  defaultBrowser: "Google Chrome",
  options: {
    logRequests: true,
  },
  handlers: [
    {
      match: "open.spotify.com/*",
      browser: "Spotify"
    },
    {
      match: [
        /datadog.zoom.us\/s\/\d+/,
        /datadog.zoom.us\/rec\/share/,
        /google.zoom.us/
      ],
      browser: DdChrome(),
    },
    {
      match: [
        "zoom.us/*",
        finicky.matchDomains(/.*\zoom.us/),
        /zoom.us\/j\//,
      ],
      url: ({url}) => ({
        ...url,
        search: url.search.substr(0, url.search.indexOf('%3C')) || url.search,
      }),
      browser: "us.zoom.xos"
    },
    {
      match: [
        finicky.matchDomains(/\.fed\.dog/),
        finicky.matchDomains(/\.ddog-gov\.com/),
      ],
      browser: DdGovChrome,
    },
    {
      match: [
        finicky.matchDomains(/.*\.ddbuild\.io/),
        finicky.matchDomains(/datad0g\.com/),
        finicky.matchDomains(/datadoghq\.com/),
        finicky.matchDomains(/datadoghq\.eu/),
        finicky.matchDomains(/\.dog/),
        finicky.matchDomains(/datadoghq\.atlassian\.net/),
        /https:\/\/github\.com\/DataDog\//,
        /https:\/\/dd\.slack\.com\/ssb\/signin_redirect/,
      ],
      browser: DdChrome(),
    },
    {
      match: finicky.matchHostnames(["accounts.google.com"]),
      browser: ({ urlString }) => urlString.includes(GoogleIdp.DdGov) || urlString.includes(GoogleIdp.DdGovVault) ? DdGovChrome() : DdChrome(),
    },
  ],
};

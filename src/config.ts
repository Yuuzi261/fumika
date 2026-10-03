import type {
	AnalyticsConfig,
	CommentConfig,
	DeployConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Nekoya",
	subtitle: "Yuuzi",
	lang: "zh_TW", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	// Leave it empty `[]` if want disable multi-languages. It can be sorted by array order
	supportedLangs: [],
	theme: {
		hue: 260, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		mode: "dark",
	},
	banner: {
		enable: true,
		src: "assets/images/banner-nacho.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "甘城なつき/Nachoneko💤", // Credit text to be displayed
			url: "https://x.com/amsrntk3", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: "/favicon/favicon-nekoya-32.png",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-nekoya-128.png",
			sizes: "128x128",
		},
	],
	ogImage: {
		useDefault: true,
		defaultSrc: "/favicon/favicon-nekoya-128.png",
	},
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		LinkPreset.Friends,
		{
			name: "GitHub",
			url: "https://github.com/Yuuzi261", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Yuuzi",
	bio: "Adorable Is All You Need. Hi there, I'm a programmer who loves anime. This place will probably have some random tutorials and notes.",
	links: [
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
			url: "https://x.com/Yuuzi_261",
		},
		{
			name: "Discord",
			icon: "fa6-brands:discord",
			url: "https://discord.com/users/431016551261405195",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Yuuzi261",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

// Check https://giscus.app/ to get repoId and categoryId
export const commentConfig: CommentConfig = {
	giscus: {
		repo: "Yuuzi261/fumika",
		repoId: "R_kgDOUWyqkA",
		category: "Announcements", // Choose "Announcements" for prevent visitor leave a comment on GitHub directly
		categoryId: "DIC_kwDOUWyqkM4DFYQw",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "1",
		inputPosition: "top",
		theme: "reactive",
		lang: "zh-TW",
		loading: "lazy",
	},
};

// Site analytics config, only support GA4 for now
export const analyticsConfig: AnalyticsConfig = {
	enabled: false,
	// Example if using Google Analytics, don't forget to make `enabled` true
	// google: {
	//	 id: "G-xxx",
	// },
};

// Deploy configuration (Netlify, GitHub Pages, Cloudflare Pages, etc)
export const deployConfig: DeployConfig = {
	siteUrl: "https://blog.yuuzi.cc",
	baseUrl: "/",
};

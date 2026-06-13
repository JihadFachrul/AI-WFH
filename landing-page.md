<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AWOS - AI Workforce OS</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-container": "#5f5ffd",
                        "on-surface": "#0b1c30",
                        "tertiary": "#4b1c00",
                        "tertiary-container": "#6e2c00",
                        "on-error-container": "#93000a",
                        "surface-container-highest": "#d3e4fe",
                        "on-tertiary-fixed-variant": "#773205",
                        "surface-bright": "#f8f9ff",
                        "on-secondary-fixed-variant": "#2c24ce",
                        "secondary-fixed-dim": "#c1c1ff",
                        "outline": "#757682",
                        "secondary-fixed": "#e1dfff",
                        "tertiary-fixed-dim": "#ffb691",
                        "surface-container-high": "#dce9ff",
                        "on-primary-container": "#90a8ff",
                        "tertiary-fixed": "#ffdbcb",
                        "primary-fixed": "#dce1ff",
                        "on-background": "#0b1c30",
                        "error-container": "#ffdad6",
                        "surface": "#f8f9ff",
                        "background": "#f8f9ff",
                        "surface-dim": "#cbdbf5",
                        "primary-container": "#1e3a8a",
                        "text-heading": "#0F172A",
                        "on-surface-variant": "#444651",
                        "surface-container-low": "#eff4ff",
                        "surface-tint": "#4059aa",
                        "inverse-surface": "#213145",
                        "surface-container-lowest": "#ffffff",
                        "surface-variant": "#d3e4fe",
                        "surface-main": "#FFFFFF",
                        "text-body": "#334155",
                        "on-primary-fixed": "#00164e",
                        "error": "#ba1a1a",
                        "on-error": "#ffffff",
                        "inverse-primary": "#b6c4ff",
                        "primary-fixed-dim": "#b6c4ff",
                        "on-tertiary-fixed": "#341100",
                        "surface-subtle": "#F8FAFC",
                        "on-tertiary-container": "#f39461",
                        "on-tertiary": "#ffffff",
                        "inverse-on-surface": "#eaf1ff",
                        "secondary": "#4442e3",
                        "primary": "#00236f",
                        "surface-container": "#e5eeff",
                        "border-low-contrast": "#E2E8F0",
                        "accent-highlight": "#C495FD",
                        "on-secondary-container": "#fffbff",
                        "on-secondary": "#ffffff",
                        "on-primary": "#ffffff",
                        "outline-variant": "#c5c5d3",
                        "on-secondary-fixed": "#09006b",
                        "on-primary-fixed-variant": "#264191"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "stack-sm": "8px",
                        "stack-md": "16px",
                        "stack-lg": "24px",
                        "section-v-space": "80px",
                        "grid-columns": "8",
                        "margin-edge": "32px",
                        "max-width": "1280px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "label-bold": ["Inter"],
                        "headline-xl": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-md": ["Inter"],
                        "body-md": ["Inter"],
                        "display-lg": ["Inter"],
                        "display-lg-mobile": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg": ["30px", { "lineHeight": "1.2", "fontWeight": "700" }],
                        "label-sm": ["12px", { "lineHeight": "1.2", "fontWeight": "500" }],
                        "label-bold": ["14px", { "lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "headline-xl": ["36px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700" }],
                        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
                        "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
                        "display-lg": ["60px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800" }],
                        "display-lg-mobile": ["40px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800" }]
                    }
                }
            }
        }
    </script>
<style>
        body { background-color: #F8FAFC; }
    </style>
</head>
<body class="text-text-body font-body-md antialiased">
<!-- TopNavBar -->
<nav class="bg-surface-container-lowest dark:bg-on-surface border-b border-border-low-contrast dark:border-outline fixed top-0 w-full z-50 transition-all duration-200 ease-in-out">
<div class="flex justify-between items-center px-margin-edge py-4 max-w-max-width mx-auto">
<div class="flex items-center gap-2">
<span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">AWOS</span>
<span class="font-label-sm text-label-sm text-on-surface-variant hidden md:inline">AI Workforce OS</span>
</div>
<div class="hidden md:flex items-center gap-6">
<a class="font-label-bold text-label-bold text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Platform</a>
<a class="font-label-bold text-label-bold text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Solutions</a>
<a class="font-label-bold text-label-bold text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Resources</a>
<a class="font-label-bold text-label-bold text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Pricing</a>
</div>
<div class="flex items-center gap-4">
<button class="hidden md:block font-label-bold text-label-bold text-primary px-4 py-2 border border-primary rounded hover:bg-surface-container-low transition-colors">Request Demo</button>
<button class="font-label-bold text-label-bold text-on-primary bg-primary-container px-4 py-2 rounded hover:bg-primary transition-colors">Get Started</button>
</div>
</div>
</nav>
<main class="pt-[80px]">
<!-- Hero Section -->
<section class="py-section-v-space px-margin-edge max-w-max-width mx-auto">
<div class="grid grid-cols-1 md:grid-cols-8 gap-gutter items-center">
<div class="md:col-span-4 flex flex-col gap-stack-lg">
<h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-text-heading">Run Your Entire Workforce — From Anywhere.</h1>
<p class="font-body-lg text-body-lg text-text-body">AWOS gives founders and CTOs real-time visibility into team performance, task accountability, and AI-powered workforce intelligence — without surveillance.</p>
<div class="flex flex-wrap items-center gap-stack-md mt-stack-sm">
<button class="bg-primary-container text-on-primary font-label-bold text-label-bold px-6 py-3 rounded hover:bg-primary transition-colors shadow-sm hover:shadow-md">Start Free Trial</button>
<button class="flex items-center gap-2 text-primary font-label-bold text-label-bold px-6 py-3 rounded hover:bg-surface-container-low transition-colors">
<span class="material-symbols-outlined" data-icon="play_circle">play_circle</span>
                            Watch Demo
                        </button>
</div>
<div class="font-label-sm text-label-sm text-on-surface-variant mt-stack-md flex items-center gap-2">
<span class="material-symbols-outlined text-[16px]" data-icon="verified">verified</span> SOC 2 Ready · GDPR Compliant · 99.9% Uptime
                    </div>
</div>
<div class="md:col-span-4 mt-stack-lg md:mt-0 relative">
<div class="bg-surface-main border border-border-low-contrast rounded-lg p-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
<img alt="AWOS Dashboard Interface" class="w-full h-auto rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB86bTFXO0JTCE3G7YLFfED7Bh9Iq6M1VAOMXmgHGJGqhMAYM1KnEk-kj4eaE10a0V4RnSwklBsLyaNg8r6rqve9nCOnSEtEWdn-6wxG7a7E5BLG-ApmnBz3PQwivcSc5q3196bTw5zj5Azwnm_lhLQGOmCjvVWscJBluVs1n1MZUm_D2_s7wj2palqR-Hz4EtNAIwJmIVIKG458W0CP19LF7QcJZBjIiABlSch31nB97IjqyJiYRK-K1eRDzs02uW05ox1rVpLh7Sx"/>
</div>
</div>
</div>
</section>
<!-- Logo Bar -->
<section class="border-y border-border-low-contrast bg-surface-main py-stack-lg px-margin-edge">
<div class="max-w-max-width mx-auto text-center">
<p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-stack-md">Trusted by fast-growing teams</p>
<div class="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale">
<!-- Placeholder Logos -->
<div class="h-8 w-24 bg-surface-container-high rounded flex items-center justify-center font-label-bold text-xs text-on-surface-variant">LOGO 1</div>
<div class="h-8 w-24 bg-surface-container-high rounded flex items-center justify-center font-label-bold text-xs text-on-surface-variant">LOGO 2</div>
<div class="h-8 w-24 bg-surface-container-high rounded flex items-center justify-center font-label-bold text-xs text-on-surface-variant">LOGO 3</div>
<div class="h-8 w-24 bg-surface-container-high rounded flex items-center justify-center font-label-bold text-xs text-on-surface-variant">LOGO 4</div>
<div class="h-8 w-24 bg-surface-container-high rounded flex items-center justify-center font-label-bold text-xs text-on-surface-variant">LOGO 5</div>
<div class="h-8 w-24 bg-surface-container-high rounded flex items-center justify-center font-label-bold text-xs text-on-surface-variant">LOGO 6</div>
</div>
</div>
</section>
<!-- Problem / Solution -->
<section class="py-section-v-space px-margin-edge max-w-max-width mx-auto">
<div class="text-center mb-section-v-space">
<h2 class="font-headline-xl text-headline-xl text-text-heading mb-stack-sm">The Accountability Gap</h2>
<p class="font-body-lg text-body-lg text-text-body max-w-2xl mx-auto">Traditional management tools don't show you who is actually moving the needle.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<!-- Problem -->
<div class="bg-surface-main border border-border-low-contrast rounded-lg p-8 flex flex-col gap-stack-lg">
<h3 class="font-headline-md text-headline-md text-text-heading flex items-center gap-2">
<span class="material-symbols-outlined text-error" data-icon="cancel">cancel</span>
                        The Old Way
                    </h3>
<ul class="flex flex-col gap-stack-md">
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-on-surface-variant mt-1" data-icon="visibility_off">visibility_off</span>
<span class="font-body-md text-body-md">You can't see who's actually productive</span>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-on-surface-variant mt-1" data-icon="schedule">schedule</span>
<span class="font-body-md text-body-md">Manager review cycles are manual and slow</span>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-on-surface-variant mt-1" data-icon="scatter_plot">scatter_plot</span>
<span class="font-body-md text-body-md">KPI data is scattered across tools</span>
</li>
</ul>
</div>
<!-- Solution -->
<div class="bg-surface-container-low border border-primary-fixed rounded-lg p-8 flex flex-col gap-stack-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
<h3 class="font-headline-md text-headline-md text-primary-container flex items-center gap-2">
<span class="material-symbols-outlined text-primary-container" data-icon="check_circle">check_circle</span>
                        The AWOS Way
                    </h3>
<ul class="flex flex-col gap-stack-md">
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary mt-1" data-icon="update">update</span>
<span class="font-body-md text-body-md font-medium">Real-time task progress with evidence</span>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary mt-1" data-icon="account_tree">account_tree</span>
<span class="font-body-md text-body-md font-medium">Structured manager review system</span>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary mt-1" data-icon="insights">insights</span>
<span class="font-body-md text-body-md font-medium">Automated KPI engine</span>
</li>
</ul>
</div>
</div>
</section>
<!-- Core Features Grid -->
<section class="py-section-v-space px-margin-edge bg-surface-main border-y border-border-low-contrast">
<div class="max-w-max-width mx-auto">
<div class="text-center mb-section-v-space">
<h2 class="font-headline-xl text-headline-xl text-text-heading mb-stack-sm">Core Features</h2>
<p class="font-body-lg text-body-lg text-text-body max-w-2xl mx-auto">Everything you need to operate a high-performing team.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<!-- Feature 1 -->
<div class="p-6 border border-border-low-contrast rounded-lg bg-surface hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow">
<div class="w-12 h-12 bg-surface-container-high rounded flex items-center justify-center mb-stack-md text-primary-container">
<span class="material-symbols-outlined" data-icon="task">task</span>
</div>
<h4 class="font-headline-md text-headline-md text-text-heading mb-stack-sm">Task Management</h4>
<p class="font-body-md text-body-md text-text-body">Track assignments with required evidence upload.</p>
</div>
<!-- Feature 2 -->
<div class="p-6 border border-border-low-contrast rounded-lg bg-surface hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow">
<div class="w-12 h-12 bg-surface-container-high rounded flex items-center justify-center mb-stack-md text-primary-container">
<span class="material-symbols-outlined" data-icon="history">history</span>
</div>
<h4 class="font-headline-md text-headline-md text-text-heading mb-stack-sm">Daily Work Log</h4>
<p class="font-body-md text-body-md text-text-body">Maintain a continuous ledger of progress.</p>
</div>
<!-- Feature 3 -->
<div class="p-6 border border-border-low-contrast rounded-lg bg-surface hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow">
<div class="w-12 h-12 bg-surface-container-high rounded flex items-center justify-center mb-stack-md text-primary-container">
<span class="material-symbols-outlined" data-icon="rate_review">rate_review</span>
</div>
<h4 class="font-headline-md text-headline-md text-text-heading mb-stack-sm">Manager Review</h4>
<p class="font-body-md text-body-md text-text-body">Streamlined approval workflows for accountability.</p>
</div>
<!-- Feature 4 -->
<div class="p-6 border border-border-low-contrast rounded-lg bg-surface hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow">
<div class="w-12 h-12 bg-surface-container-high rounded flex items-center justify-center mb-stack-md text-primary-container">
<span class="material-symbols-outlined" data-icon="monitoring">monitoring</span>
</div>
<h4 class="font-headline-md text-headline-md text-text-heading mb-stack-sm">KPI Engine</h4>
<p class="font-body-md text-body-md text-text-body">Automated performance tracking aligned with goals.</p>
</div>
<!-- Feature 5 -->
<div class="p-6 border border-border-low-contrast rounded-lg bg-surface hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow">
<div class="w-12 h-12 bg-surface-container-high rounded flex items-center justify-center mb-stack-md text-primary-container">
<span class="material-symbols-outlined" data-icon="view_kanban">view_kanban</span>
</div>
<h4 class="font-headline-md text-headline-md text-text-heading mb-stack-sm">Kanban Scheduling</h4>
<p class="font-body-md text-body-md text-text-body">Visual workflow and meeting scheduler.</p>
</div>
<!-- Feature 6 -->
<div class="p-6 border border-border-low-contrast rounded-lg bg-surface-container-low hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow relative overflow-hidden">
<div class="absolute top-0 right-0 bg-accent-highlight text-on-primary font-label-sm text-[10px] px-2 py-1 rounded-bl">COMING SOON</div>
<div class="w-12 h-12 bg-primary-fixed rounded flex items-center justify-center mb-stack-md text-primary-container">
<span class="material-symbols-outlined" data-icon="psychology">psychology</span>
</div>
<h4 class="font-headline-md text-headline-md text-text-heading mb-stack-sm">AI Intelligence</h4>
<p class="font-body-md text-body-md text-text-body">Predictive workforce insights and risk flagging.</p>
</div>
</div>
</div>
</section>
<!-- CTA Footer Section -->
<section class="bg-primary-container py-section-v-space px-margin-edge">
<div class="max-w-3xl mx-auto text-center flex flex-col items-center gap-stack-lg">
<h2 class="font-headline-xl text-headline-xl text-on-primary">Ready to build an accountable remote team?</h2>
<button class="bg-surface-main text-primary-container font-label-bold text-label-bold px-8 py-4 rounded hover:bg-surface-subtle transition-colors shadow-md">
                    Start Free Trial — No credit card required
                </button>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-surface-container-low dark:bg-on-surface border-t border-border-low-contrast dark:border-outline">
<div class="grid grid-cols-2 md:grid-cols-4 gap-gutter px-margin-edge py-section-v-space max-w-max-width mx-auto">
<div class="flex flex-col gap-stack-sm">
<span class="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed mb-stack-sm">AWOS</span>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Product</a>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Features</a>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Security</a>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Enterprise</a>
</div>
<div class="flex flex-col gap-stack-sm">
<span class="font-label-bold text-label-bold text-text-heading mb-stack-sm">Company</span>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">About</a>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Careers</a>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Contact</a>
</div>
<div class="flex flex-col gap-stack-sm">
<span class="font-label-bold text-label-bold text-text-heading mb-stack-sm">Resources</span>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">API Docs</a>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Community</a>
</div>
<div class="flex flex-col gap-stack-sm">
<span class="font-label-bold text-label-bold text-text-heading mb-stack-sm">Legal</span>
<a class="font-body-md text-body-md text-text-body dark:text-on-surface-variant hover:text-primary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Privacy</a>
</div>
</div>
<div class="px-margin-edge pb-stack-lg max-w-max-width mx-auto">
<p class="font-body-md text-body-md text-text-body dark:text-on-surface-variant opacity-80">© 2024 AWOS AI Workforce Operating System. All rights reserved.</p>
</div>
</footer>
</body></html>
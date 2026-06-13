<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AWOS Enterprise - Dashboard</title>
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
                    "tertiary-fixed-dim": "#ffb691",
                    "surface-container": "#e5eeff",
                    "tertiary-fixed": "#ffdbcb",
                    "tertiary": "#4b1c00",
                    "text-body": "#334155",
                    "secondary-fixed-dim": "#c1c1ff",
                    "outline": "#757682",
                    "on-surface": "#0b1c30",
                    "on-surface-variant": "#444651",
                    "error": "#ba1a1a",
                    "on-secondary-fixed": "#09006b",
                    "on-error-container": "#93000a",
                    "text-heading": "#0F172A",
                    "inverse-on-surface": "#eaf1ff",
                    "surface-dim": "#cbdbf5",
                    "outline-variant": "#c5c5d3",
                    "on-tertiary-fixed": "#341100",
                    "on-tertiary": "#ffffff",
                    "accent-highlight": "#C495FD",
                    "primary-fixed": "#dce1ff",
                    "surface-container-high": "#dce9ff",
                    "surface": "#f8f9ff",
                    "surface-container-highest": "#d3e4fe",
                    "on-primary-fixed": "#00164e",
                    "inverse-surface": "#213145",
                    "on-primary": "#ffffff",
                    "on-error": "#ffffff",
                    "tertiary-container": "#6e2c00",
                    "on-secondary": "#ffffff",
                    "surface-main": "#FFFFFF",
                    "surface-tint": "#4059aa",
                    "error-container": "#ffdad6",
                    "surface-container-low": "#eff4ff",
                    "secondary": "#4442e3",
                    "on-tertiary-container": "#f39461",
                    "surface-variant": "#d3e4fe",
                    "on-secondary-fixed-variant": "#2c24ce",
                    "inverse-primary": "#b6c4ff",
                    "on-primary-container": "#90a8ff",
                    "surface-container-lowest": "#ffffff",
                    "on-secondary-container": "#fffbff",
                    "on-primary-fixed-variant": "#264191",
                    "background": "#f8f9ff",
                    "on-background": "#0b1c30",
                    "secondary-fixed": "#e1dfff",
                    "border-low-contrast": "#E2E8F0",
                    "secondary-container": "#5f5ffd",
                    "primary-fixed-dim": "#b6c4ff",
                    "surface-bright": "#f8f9ff",
                    "primary": "#00236f",
                    "surface-subtle": "#F8FAFC",
                    "primary-container": "#1e3a8a",
                    "on-tertiary-fixed-variant": "#773205"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "spacing": {
                    "stack-lg": "24px",
                    "gutter": "24px",
                    "grid-columns": "8",
                    "stack-sm": "8px",
                    "section-v-space": "80px",
                    "stack-md": "16px",
                    "max-width": "1280px",
                    "margin-edge": "32px"
            },
            "fontFamily": {
                    "body-md": [
                            "Inter"
                    ],
                    "body-lg": [
                            "Inter"
                    ],
                    "label-sm": [
                            "Inter"
                    ],
                    "display-lg-mobile": [
                            "Inter"
                    ],
                    "headline-xl": [
                            "Inter"
                    ],
                    "label-bold": [
                            "Inter"
                    ],
                    "display-lg": [
                            "Inter"
                    ],
                    "headline-md": [
                            "Inter"
                    ],
                    "headline-lg": [
                            "Inter"
                    ]
            },
            "fontSize": {
                    "body-md": [
                            "16px",
                            {
                                    "lineHeight": "1.5",
                                    "fontWeight": "400"
                            }
                    ],
                    "body-lg": [
                            "18px",
                            {
                                    "lineHeight": "1.6",
                                    "fontWeight": "400"
                            }
                    ],
                    "label-sm": [
                            "12px",
                            {
                                    "lineHeight": "1.2",
                                    "fontWeight": "500"
                            }
                    ],
                    "display-lg-mobile": [
                            "40px",
                            {
                                    "lineHeight": "1.1",
                                    "letterSpacing": "-0.02em",
                                    "fontWeight": "800"
                            }
                    ],
                    "headline-xl": [
                            "36px",
                            {
                                    "lineHeight": "1.2",
                                    "letterSpacing": "-0.01em",
                                    "fontWeight": "700"
                            }
                    ],
                    "label-bold": [
                            "14px",
                            {
                                    "lineHeight": "1.2",
                                    "letterSpacing": "0.05em",
                                    "fontWeight": "600"
                            }
                    ],
                    "display-lg": [
                            "60px",
                            {
                                    "lineHeight": "1.1",
                                    "letterSpacing": "-0.02em",
                                    "fontWeight": "800"
                            }
                    ],
                    "headline-md": [
                            "24px",
                            {
                                    "lineHeight": "1.3",
                                    "fontWeight": "600"
                            }
                    ],
                    "headline-lg": [
                            "30px",
                            {
                                    "lineHeight": "1.2",
                                    "fontWeight": "700"
                            }
                    ]
            }
    },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined[data-weight="fill"] {
            font-variation-settings: 'FILL' 1;
        }
        body {
            background-color: #F8FAFC;
        }
    </style>
</head>
<body class="font-body-md text-body-md text-on-surface antialiased bg-surface-subtle">
<!-- TopNavBar -->
<header class="fixed top-0 right-0 w-[calc(100%-240px)] h-[60px] bg-surface-main dark:bg-on-surface text-primary dark:text-primary-fixed-dim font-body-md text-body-md border-b border-border-low-contrast dark:border-outline-variant flat no shadows flex justify-between items-center px-gutter ml-[240px] z-50">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-outline">search</span>
<input class="bg-transparent border-none outline-none text-on-surface placeholder:text-outline w-64 focus:ring-0" placeholder="Search across AWOS..." type="text"/>
</div>
<div class="flex items-center gap-6">
<div class="flex items-center gap-4">
<button class="relative hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors cursor-pointer active:scale-95 duration-100">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
</button>
</div>
<div class="flex items-center gap-3 border-l border-border-low-contrast pl-6">
<div class="text-right">
<p class="font-label-bold text-label-bold text-on-surface">Active Session</p>
<p class="font-label-sm text-label-sm text-outline">Administrator</p>
</div>
<img alt="User Profile" class="w-10 h-10 rounded-full border border-border-low-contrast" data-alt="A professional headshot of a corporate administrator in a modern, well-lit office environment. High-key lighting, bright and airy light-mode aesthetic. Solid white background with subtle geometric shadows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzvK6aUtFULJFAD_Clswsi0kMSk7MTN21g4QDDAhgvIVEisQuUYbvMrUkO7S7jc2lS5o93HQZ7edIloyddwUS0MHQ4oJZ4-swR7pDyyFYRguj951MC2kO5WSKL9DKqcQsJ5WOVfoRiILIZrutrLxzzUbmCvj5Pje5VyUDB8R2kL_QD5TvJGW1uP8rOFP7DD3YALy6wlyutBN1az8rNL0QjtP4W_Vvhlzz8t3aepzmw4k7Hu33tM5YUEraEIatAMKCy6R2zC6nDghTI"/>
</div>
</div>
</header>
<!-- SideNavBar -->
<nav class="fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest dark:bg-inverse-surface text-secondary dark:text-secondary-fixed font-label-bold text-label-bold border-r border-border-low-contrast dark:border-outline-variant flat no shadows flex flex-col py-stack-lg z-50">
<div class="px-gutter mb-8 flex items-center gap-3">
<div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary font-headline-md text-headline-md font-bold">
                A
            </div>
<div>
<h1 class="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">AWOS</h1>
<p class="font-label-sm text-label-sm text-outline font-normal">Global Workspace</p>
</div>
</div>
<div class="px-4 mb-6">
<button class="w-full py-2 bg-primary-container text-on-primary rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">add</span>
                New Initiative
            </button>
</div>
<div class="flex-1 flex flex-col gap-1 px-2">
<a class="flex items-center gap-3 px-4 py-2 bg-secondary-fixed dark:bg-secondary-container text-on-secondary-fixed-variant dark:text-on-secondary-container rounded-lg Active: opacity-80 duration-150" href="#">
<span class="material-symbols-outlined" data-weight="fill">dashboard</span>
                Workspace
            </a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">groups</span>
                People
            </a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">monitoring</span>
                Performance
            </a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">forum</span>
                Collaboration
            </a>
</div>
<div class="mt-auto flex flex-col gap-1 px-2 pt-4 border-t border-border-low-contrast">
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">settings</span>
                Settings
            </a>
<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">help</span>
                Support
            </a>
</div>
</nav>
<!-- Main Content Area -->
<main class="ml-[240px] pt-[60px] p-gutter min-h-screen">
<div class="max-w-[1280px] mx-auto space-y-stack-lg">
<!-- Page Header -->
<div class="flex justify-between items-end mb-6">
<div>
<h2 class="font-headline-lg text-headline-lg text-text-heading">Dashboard Overview</h2>
<p class="text-on-surface-variant mt-1">Monitor operational metrics and team performance.</p>
</div>
<div class="flex items-center gap-3 text-label-sm font-label-sm text-outline">
<span class="material-symbols-outlined text-[18px]">calendar_today</span>
                    Today, Oct 24, 2023
                </div>
</div>
<!-- STAT CARDS (4 columns) -->
<div class="grid grid-cols-4 gap-gutter">
<!-- Card 1 -->
<div class="bg-surface-main p-6 rounded-xl border border-border-low-contrast flex flex-col justify-between h-[140px]">
<div class="flex justify-between items-start">
<span class="font-label-bold text-label-bold text-on-surface-variant">Active Tasks</span>
<div class="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary-container">
<span class="material-symbols-outlined text-[20px]">task_alt</span>
</div>
</div>
<div class="flex items-end gap-3">
<span class="font-display-lg-mobile text-display-lg-mobile text-text-heading">24</span>
<span class="font-label-sm text-label-sm text-primary-container bg-surface-container-low px-2 py-1 rounded-full mb-1">+3 today</span>
</div>
</div>
<!-- Card 2 -->
<div class="bg-surface-main p-6 rounded-xl border border-border-low-contrast flex flex-col justify-between h-[140px]">
<div class="flex justify-between items-start">
<span class="font-label-bold text-label-bold text-on-surface-variant">Team Online</span>
<div class="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[20px]">group</span>
</div>
</div>
<div class="flex items-end gap-3">
<span class="font-display-lg-mobile text-display-lg-mobile text-text-heading">8</span>
<span class="font-label-sm text-label-sm text-outline mb-1">/ 12</span>
</div>
</div>
<!-- Card 3 -->
<div class="bg-surface-main p-6 rounded-xl border border-border-low-contrast flex flex-col justify-between h-[140px]">
<div class="flex justify-between items-start">
<span class="font-label-bold text-label-bold text-on-surface-variant">Pending Reviews</span>
<div class="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
<span class="material-symbols-outlined text-[20px]">pending_actions</span>
</div>
</div>
<div class="flex items-end gap-3">
<span class="font-display-lg-mobile text-display-lg-mobile text-text-heading">5</span>
</div>
</div>
<!-- Card 4 -->
<div class="bg-surface-main p-6 rounded-xl border border-border-low-contrast flex flex-col justify-between h-[140px]">
<div class="flex justify-between items-start">
<span class="font-label-bold text-label-bold text-on-surface-variant">Avg KPI Score</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container">
<span class="material-symbols-outlined text-[20px]">trending_up</span>
</div>
</div>
<div class="flex items-end gap-3">
<span class="font-display-lg-mobile text-display-lg-mobile text-text-heading">78.4</span>
<span class="font-label-sm text-label-sm text-on-secondary-fixed-variant bg-secondary-fixed-dim px-2 py-1 rounded-full mb-1">Good</span>
</div>
</div>
</div>
<!-- MIDDLE ROW (60/40 Split) -->
<div class="grid grid-cols-12 gap-gutter">
<!-- Task Progress Overview (Left 60%) -->
<div class="col-span-7 bg-surface-main rounded-xl border border-border-low-contrast flex flex-col overflow-hidden">
<div class="p-6 border-b border-border-low-contrast flex justify-between items-center">
<h3 class="font-headline-md text-headline-md text-text-heading">Task Progress Overview</h3>
<button class="text-primary-container font-label-bold text-label-bold hover:underline">View All</button>
</div>
<div class="p-0 overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-subtle font-label-bold text-label-bold text-outline border-b border-border-low-contrast">
<th class="px-6 py-4 font-medium">Task Name</th>
<th class="px-6 py-4 font-medium">Assignee</th>
<th class="px-6 py-4 font-medium">Status</th>
<th class="px-6 py-4 font-medium">Progress</th>
</tr>
</thead>
<tbody class="text-body-md text-on-surface divide-y divide-border-low-contrast">
<tr class="hover:bg-surface-subtle transition-colors">
<td class="px-6 py-4 font-medium">Q4 Market Analysis Report</td>
<td class="px-6 py-4 flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-label-bold text-label-sm">SJ</div>
                                        Sarah J.
                                    </td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-bold bg-secondary-fixed text-on-secondary-fixed-variant">IN_PROGRESS</span>
</td>
<td class="px-6 py-4">
<div class="w-full bg-border-low-contrast rounded-full h-1.5">
<div class="bg-primary-container h-1.5 rounded-full" style="width: 65%"></div>
</div>
</td>
</tr>
<tr class="hover:bg-surface-subtle transition-colors">
<td class="px-6 py-4 font-medium">Update Client Onboarding Flow</td>
<td class="px-6 py-4 flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-label-bold text-label-sm">MR</div>
                                        Mike R.
                                    </td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-bold bg-surface-container-high text-primary-container">REVIEW</span>
</td>
<td class="px-6 py-4">
<div class="w-full bg-border-low-contrast rounded-full h-1.5">
<div class="bg-primary-container h-1.5 rounded-full" style="width: 90%"></div>
</div>
</td>
</tr>
<tr class="hover:bg-surface-subtle transition-colors">
<td class="px-6 py-4 font-medium">Design System Audit</td>
<td class="px-6 py-4 flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-surface-dim text-on-surface flex items-center justify-center font-label-bold text-label-sm">AL</div>
                                        Anna L.
                                    </td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-bold bg-border-low-contrast text-on-surface-variant">TODO</span>
</td>
<td class="px-6 py-4">
<div class="w-full bg-border-low-contrast rounded-full h-1.5">
<div class="bg-primary-container h-1.5 rounded-full" style="width: 0%"></div>
</div>
</td>
</tr>
<tr class="hover:bg-surface-subtle transition-colors">
<td class="px-6 py-4 font-medium">Database Migration Phase 1</td>
<td class="px-6 py-4 flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-accent-highlight text-on-primary flex items-center justify-center font-label-bold text-label-sm">DT</div>
                                        David T.
                                    </td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-bold bg-primary-container text-on-primary">DONE</span>
</td>
<td class="px-6 py-4">
<div class="w-full bg-border-low-contrast rounded-full h-1.5">
<div class="bg-primary-container h-1.5 rounded-full" style="width: 100%"></div>
</div>
</td>
</tr>
<tr class="hover:bg-surface-subtle transition-colors">
<td class="px-6 py-4 font-medium">Security Patch Rollout</td>
<td class="px-6 py-4 flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-label-bold text-label-sm">SJ</div>
                                        Sarah J.
                                    </td>
<td class="px-6 py-4">
<span class="inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-bold bg-secondary-fixed text-on-secondary-fixed-variant">IN_PROGRESS</span>
</td>
<td class="px-6 py-4">
<div class="w-full bg-border-low-contrast rounded-full h-1.5">
<div class="bg-primary-container h-1.5 rounded-full" style="width: 45%"></div>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Team Activity Feed (Right 40%) -->
<div class="col-span-5 bg-surface-main rounded-xl border border-border-low-contrast flex flex-col">
<div class="p-6 border-b border-border-low-contrast flex justify-between items-center">
<h3 class="font-headline-md text-headline-md text-text-heading">Team Activity Feed</h3>
<span class="material-symbols-outlined text-outline">history</span>
</div>
<div class="p-6 flex-1 overflow-y-auto">
<div class="relative border-l-2 border-border-low-contrast ml-3 space-y-6">
<div class="relative pl-6">
<div class="absolute w-3 h-3 bg-secondary rounded-full -left-[7px] top-1.5 border-2 border-surface-main"></div>
<div class="flex flex-col gap-1">
<p class="font-body-md text-body-md text-on-surface"><span class="font-bold">Rina</span> uploaded evidence for <span class="font-medium text-primary-container">Task #42</span></p>
<span class="font-label-sm text-label-sm text-outline">10 mins ago</span>
</div>
</div>
<div class="relative pl-6">
<div class="absolute w-3 h-3 bg-border-low-contrast rounded-full -left-[7px] top-1.5 border-2 border-surface-main"></div>
<div class="flex flex-col gap-1">
<p class="font-body-md text-body-md text-on-surface"><span class="font-bold">Budi</span> completed daily work log</p>
<span class="font-label-sm text-label-sm text-outline">45 mins ago</span>
</div>
</div>
<div class="relative pl-6">
<div class="absolute w-3 h-3 bg-primary-container rounded-full -left-[7px] top-1.5 border-2 border-surface-main"></div>
<div class="flex flex-col gap-1">
<p class="font-body-md text-body-md text-on-surface"><span class="font-bold">System</span> automatically assigned 3 new tasks to Design Team</p>
<span class="font-label-sm text-label-sm text-outline">2 hours ago</span>
</div>
</div>
<div class="relative pl-6">
<div class="absolute w-3 h-3 bg-accent-highlight rounded-full -left-[7px] top-1.5 border-2 border-surface-main"></div>
<div class="flex flex-col gap-1">
<p class="font-body-md text-body-md text-on-surface"><span class="font-bold">Sarah</span> approved <span class="font-medium text-primary-container">Pull Request #102</span></p>
<span class="font-label-sm text-label-sm text-outline">3 hours ago</span>
</div>
</div>
<div class="relative pl-6">
<div class="absolute w-3 h-3 bg-error-container rounded-full -left-[7px] top-1.5 border-2 border-surface-main"></div>
<div class="flex flex-col gap-1">
<p class="font-body-md text-body-md text-on-surface"><span class="font-bold">Alex</span> flagged an issue on <span class="font-medium text-primary-container">Server DB Update</span></p>
<span class="font-label-sm text-label-sm text-outline">Yesterday, 4:30 PM</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
</body></html>